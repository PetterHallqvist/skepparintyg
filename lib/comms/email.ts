import "server-only";
import { serverEnv, isCommsConfigured } from "@/lib/env";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { logger } from "@/lib/observability/logger";

/**
 * Transactional email (SPEC §53). Dependency-free Resend over `fetch` (same
 * rationale as the Stripe client, ADR-0004). No-ops with a preview log when
 * `isCommsConfigured` is false, so every flow that sends mail works in dev.
 *
 * Purpose separation is a hard rule: `messageType` is required and marketing is
 * NEVER sent to a minor learner address (§70.3). The caller picks the type;
 * this layer records it on communication_log so the separation is auditable.
 */

export type MessageType =
  | "receipt"
  | "guardian_welcome"
  | "welcome"
  | "study_reminder";

/** Types that may never be sent to a minor learner's own address (§70.3). */
const MARKETING_TYPES: ReadonlySet<MessageType> = new Set(["study_reminder"]);

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
  messageType: MessageType;
  userId?: string | null;
  learnerId?: string | null;
  /** Set when `to` belongs to a minor learner — blocks marketing types. */
  recipientIsMinor?: boolean;
  metadata?: Record<string, unknown>;
}

export interface SendEmailResult {
  ok: boolean;
  providerMessageId?: string;
  status: "sent" | "failed" | "suppressed";
}

async function logCommunication(
  input: SendEmailInput,
  status: SendEmailResult["status"],
  providerMessageId?: string,
): Promise<void> {
  try {
    const svc = createSupabaseServiceClient();
    await svc.from("communication_log").insert({
      user_id: input.userId ?? null,
      learner_id: input.learnerId ?? null,
      message_type: input.messageType,
      provider_message_id: providerMessageId ?? null,
      status,
      sent_at: status === "sent" ? new Date().toISOString() : null,
      metadata: input.metadata ?? {},
    });
  } catch {
    // Service client unavailable (no secret key) — the send still stands.
  }
}

export async function sendEmail(
  input: SendEmailInput,
): Promise<SendEmailResult> {
  // §70.3 guard: never deliver a marketing-class message to a minor.
  if (input.recipientIsMinor && MARKETING_TYPES.has(input.messageType)) {
    logger.warn("email.suppressed_minor_marketing", {
      messageType: input.messageType,
    });
    await logCommunication(input, "suppressed");
    return { ok: false, status: "suppressed" };
  }

  if (!isCommsConfigured) {
    // Preview mode: log that we WOULD send (no PII beyond the type/subject).
    logger.info("email.preview", {
      messageType: input.messageType,
      subject: input.subject,
    });
    await logCommunication(input, "suppressed");
    return { ok: false, status: "suppressed" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serverEnv.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: serverEnv.EMAIL_FROM,
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text,
      }),
    });
    const json = (await res.json().catch(() => ({}))) as { id?: string };
    if (!res.ok) {
      logger.error("email.send_failed", { messageType: input.messageType });
      await logCommunication(input, "failed");
      return { ok: false, status: "failed" };
    }
    await logCommunication(input, "sent", json.id);
    return { ok: true, status: "sent", providerMessageId: json.id };
  } catch {
    logger.error("email.send_error", { messageType: input.messageType });
    await logCommunication(input, "failed");
    return { ok: false, status: "failed" };
  }
}
