import { isCommerceConfigured } from "@/lib/env";
import {
  verifyStripeSignature,
  payloadHash,
  StripeError,
} from "@/lib/commerce/stripe";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { sendReceiptForOrder } from "@/lib/comms/receipt";
import { logger } from "@/lib/observability/logger";

/**
 * Stripe webhook (SPEC §60.2) — the SOLE authority that provisions an
 * entitlement. Flow: verify the signature → dedupe + provision inside the DB
 * (provision_entitlement / apply_refund are idempotent via external_events).
 *
 * A browser hitting /kassa/klar grants nothing; only a signature-verified event
 * here does. Redelivery is safe: the RPC returns the stored result unchanged.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type StripeEvent = {
  id: string;
  type: string;
  created: number;
  data: { object: Record<string, unknown> };
};

export async function POST(req: Request) {
  if (!isCommerceConfigured) {
    return new Response("Betalning är inte aktiverad.", { status: 503 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: StripeEvent;
  try {
    event = verifyStripeSignature(rawBody, signature) as StripeEvent;
  } catch (err) {
    const message = err instanceof StripeError ? err.message : "Ogiltig signatur.";
    logger.warn("stripe.webhook_bad_signature", { message });
    return new Response(message, { status: 400 });
  }

  const hash = payloadHash(rawBody);
  const supabase = createSupabaseServiceClient();

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      // Guard against async/unpaid completions — provision only on real payment.
      if (session.payment_status !== "paid") {
        logger.info("stripe.session_not_paid", {
          eventId: event.id,
          status: String(session.payment_status),
        });
        return Response.json({ status: "ignored_unpaid" });
      }

      const address = (session.customer_details as Record<string, unknown> | null)
        ?.address as Record<string, unknown> | undefined;
      const metadata = (session.metadata as Record<string, string> | null) ?? {};

      const { data, error } = await supabase.rpc("provision_entitlement", {
        p: {
          provider: "stripe",
          event_id: event.id,
          event_type: event.type,
          payload_hash: hash,
          checkout_session_id: session.id,
          amount_total_ore: session.amount_total,
          payment_intent_id: session.payment_intent ?? null,
          customer_country: address?.country ?? null,
          learner_id: metadata.learner_id ?? null,
          paid_at: new Date(event.created * 1000).toISOString(),
        },
      });
      if (error) {
        logger.error("stripe.provision_failed", {
          eventId: event.id,
          message: error.message,
        });
        // 500 so Stripe retries; the RPC's external_events insert rolled back.
        return new Response("Provisioning misslyckades.", { status: 500 });
      }
      logger.info("stripe.provisioned", { eventId: event.id, result: data });
      // Receipt only on the FIRST provisioning (idempotent replays return
      // 'duplicate'/'already_paid'), so Stripe retries never double-send.
      const result = data as { status?: string; order_id?: string } | null;
      if (result?.status === "provisioned" && result.order_id) {
        await sendReceiptForOrder(result.order_id);
      }
      return Response.json({ status: "ok", result: data });
    }

    if (event.type === "charge.refunded") {
      const charge = event.data.object;
      const { data, error } = await supabase.rpc("apply_refund", {
        p: {
          provider: "stripe",
          event_id: event.id,
          event_type: event.type,
          payload_hash: hash,
          payment_intent_id: charge.payment_intent ?? null,
        },
      });
      if (error) {
        logger.error("stripe.refund_failed", {
          eventId: event.id,
          message: error.message,
        });
        return new Response("Återbetalning misslyckades.", { status: 500 });
      }
      logger.info("stripe.refunded", { eventId: event.id, result: data });
      return Response.json({ status: "ok", result: data });
    }

    // Unhandled event types are acknowledged so Stripe stops retrying them.
    return Response.json({ status: "ignored", type: event.type });
  } catch (err) {
    logger.error("stripe.webhook_unhandled", {
      eventId: event.id,
      message: err instanceof Error ? err.message : "okänt fel",
    });
    return new Response("Internt fel.", { status: 500 });
  }
}
