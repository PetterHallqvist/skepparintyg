"use server";

import { z } from "zod";
import {
  clientEnv,
  isCommerceConfigured,
  isSupabaseConfigured,
} from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCatalogProduct } from "@/lib/commerce/catalog";
import { computeOrderTotals } from "@/lib/commerce/money";
import { createStripeCheckoutSession, StripeError } from "@/lib/commerce/stripe";
import { TERMS_VERSION, WITHDRAWAL_CONSENT_VERSION } from "@/lib/commerce/constants";
import { logger } from "@/lib/observability/logger";

/**
 * Checkout server action (SPEC §60.1, §69). The browser success redirect grants
 * NOTHING — this only creates a `pending` order and a Stripe Checkout Session.
 * The signature-verified webhook is the sole authority that marks the order paid
 * and provisions the entitlement (see app/api/stripe/webhook/route.ts).
 *
 * The §69.2 withdrawal consent is a deliberate, unchecked-by-default action:
 * the action refuses to proceed unless the caller affirmatively set it, and it
 * snapshots that consent (with the exact wording version) onto the order.
 */

const checkoutSchema = z.object({
  productId: z.string().min(1),
  /** §69.2: the learner must actively tick "I consent to immediate access and
   *  thereby waive my 14-day withdrawal right". Default-false in the UI. */
  withdrawalConsent: z.boolean(),
  /** Optional: assign the seat to this learner immediately on payment (§43). */
  learnerId: z.string().uuid().optional(),
});

export type CheckoutResult =
  | { ok: true; url: string }
  | {
      ok: false;
      reason:
        | "not_configured"
        | "auth_required"
        | "consent_required"
        | "product_not_found"
        | "stripe_error"
        | "unknown";
      message: string;
    };

export async function createCheckoutSession(
  input: z.input<typeof checkoutSchema>,
): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, reason: "unknown", message: "Ogiltig indata." };
  }
  const { productId, withdrawalConsent, learnerId } = parsed.data;

  // Preview shell: no Stripe/Supabase → the UI already renders disabled; if a
  // request still arrives, refuse cleanly rather than throwing.
  if (!isCommerceConfigured) {
    return {
      ok: false,
      reason: "not_configured",
      message: "Betalning är inte aktiverad i den här miljön.",
    };
  }

  // §69.2 is a hard gate — a purchase cannot proceed without the affirmative act.
  if (withdrawalConsent !== true) {
    return {
      ok: false,
      reason: "consent_required",
      message: "Du måste godkänna villkoren för omedelbar tillgång.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      ok: false,
      reason: "auth_required",
      message: "Du måste vara inloggad för att köpa.",
    };
  }

  const product = await getCatalogProduct(productId);
  if (!product) {
    return {
      ok: false,
      reason: "product_not_found",
      message: "Produkten finns inte.",
    };
  }

  // Money is integer öre throughout; totals derived by the tested engine (§52).
  const totals = computeOrderTotals([
    {
      unitAmountOreIncVat: product.priceOreIncVat,
      vatRateBasisPoints: product.vatRateBasisPoints,
      quantity: 1,
    },
  ]);

  const consentSnapshot = {
    version: WITHDRAWAL_CONSENT_VERSION,
    granted: true,
    // A stable server timestamp, not client-supplied.
    consentedAt: new Date().toISOString(),
    purpose: "immediate_access_withdrawal_waiver",
  };

  // 1) Pending order (caller's RLS client — policy pins status='pending').
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({
      purchaser_user_id: user.id,
      status: "pending",
      currency: product.currency,
      subtotal_ore: totals.subtotalOre,
      vat_ore: totals.vatOre,
      total_ore: totals.totalOre,
      terms_version: TERMS_VERSION,
      withdrawal_consent_snapshot: consentSnapshot,
    })
    .select("id")
    .single();
  if (orderErr || !order) {
    logger.error("checkout.order_insert_failed", { message: orderErr?.message });
    return { ok: false, reason: "unknown", message: "Kunde inte skapa order." };
  }

  // 2) Order line snapshot — the receipt must survive later price edits (§52.2).
  const { error: itemErr } = await supabase.from("order_items").insert({
    order_id: order.id,
    product_id: product.id,
    quantity: 1,
    product_name_snapshot: product.nameSv,
    unit_amount_ore_inc_vat: product.priceOreIncVat,
    vat_rate_basis_points: product.vatRateBasisPoints,
    access_months_snapshot: product.accessMonths,
    seat_count_snapshot: product.seatCount,
  });
  if (itemErr) {
    logger.error("checkout.item_insert_failed", { message: itemErr.message });
    return { ok: false, reason: "unknown", message: "Kunde inte skapa order." };
  }

  // 3) Stripe Checkout Session. Idempotency-Key = our order id, so a double
  //    submit of the same order reuses one session rather than double-charging.
  const base = clientEnv.NEXT_PUBLIC_SITE_URL;
  try {
    const session = await createStripeCheckoutSession({
      lineItems: [
        {
          unitAmountOre: product.priceOreIncVat,
          currency: product.currency,
          nameSv: product.nameSv,
          quantity: 1,
        },
      ],
      successUrl: `${base}/kassa/klar?order=${order.id}`,
      cancelUrl: `${base}/kassa/${product.id}?avbruten=1`,
      clientReferenceId: order.id,
      customerEmail: user.email ?? undefined,
      metadata: {
        order_id: order.id,
        ...(learnerId ? { learner_id: learnerId } : {}),
      },
      idempotencyKey: `order_${order.id}`,
    });

    if (!session.url) {
      return {
        ok: false,
        reason: "stripe_error",
        message: "Stripe returnerade ingen betalningslänk.",
      };
    }

    // 4) Attach the session id so the webhook can find this order (§60.2).
    await supabase
      .from("orders")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", order.id)
      .eq("status", "pending");

    logger.info("checkout.session_created", {
      orderId: order.id,
      productId: product.id,
    });
    return { ok: true, url: session.url };
  } catch (err) {
    const message = err instanceof StripeError ? err.message : "Stripe-fel.";
    logger.error("checkout.stripe_failed", { message });
    return { ok: false, reason: "stripe_error", message };
  }
}

// ---------------------------------------------------------------------------
// Receipt reader — the success page is webhook-authoritative: it shows a
// pending state until the webhook has marked the order paid, then the receipt
// built ENTIRELY from the immutable order snapshot (§52.4). RLS restricts this
// to the purchaser's own order.
// ---------------------------------------------------------------------------

export interface ReceiptLine {
  name: string;
  amountOre: number;
  accessMonths: number;
}

export type ReceiptView =
  | { status: "pending" }
  | { status: "not_found" }
  | {
      status: "paid";
      orderId: string;
      lines: ReceiptLine[];
      subtotalOre: number;
      vatOre: number;
      totalOre: number;
      paidAt: string | null;
    };

export async function getOrderReceipt(orderId: string): Promise<ReceiptView> {
  if (!z.string().uuid().safeParse(orderId).success) {
    return { status: "not_found" };
  }
  if (!isSupabaseConfigured) return { status: "not_found" };

  const supabase = await createSupabaseServerClient();
  const { data: order } = await supabase
    .from("orders")
    .select("id,status,subtotal_ore,vat_ore,total_ore,paid_at")
    .eq("id", orderId)
    .maybeSingle();
  if (!order) return { status: "not_found" };
  if (order.status !== "paid") return { status: "pending" };

  const { data: items } = await supabase
    .from("order_items")
    .select("product_name_snapshot,unit_amount_ore_inc_vat,quantity,access_months_snapshot")
    .eq("order_id", orderId);

  return {
    status: "paid",
    orderId: order.id,
    lines: (items ?? []).map((i) => ({
      name: i.product_name_snapshot,
      amountOre: i.unit_amount_ore_inc_vat * i.quantity,
      accessMonths: i.access_months_snapshot,
    })),
    subtotalOre: order.subtotal_ore,
    vatOre: order.vat_ore,
    totalOre: order.total_ore,
    paidAt: order.paid_at,
  };
}
