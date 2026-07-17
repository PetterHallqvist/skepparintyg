"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { setLearnerPin } from "@/lib/guardian/access";
import { PinError } from "@/lib/guardian/access";
import { PRIVACY_POLICY_VERSION } from "@/lib/commerce/constants";
import { logger } from "@/lib/observability/logger";

/**
 * Guardian server actions (SPEC §43, §70). Data minimisation is enforced by the
 * schemas here: a learner is only ever created with a display name + age band —
 * never a legal name, personnummer, or contact details ([LEGAL GATE] on any
 * future legal-name field). Writes go through the caller's RLS client / the
 * SECURITY DEFINER RPCs, so a guardian can only ever act on their own learners.
 */

type ActionResult<T = undefined> =
  | ({ ok: true } & (T extends undefined ? object : { data: T }))
  | { ok: false; message: string };

async function requireUser() {
  if (!isSupabaseConfigured) return null;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? { supabase, user } : null;
}

/** Confirm the caller can access this learner using their OWN RLS client. */
async function assertLearnerAccess(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  learnerId: string,
): Promise<boolean> {
  const { data } = await supabase
    .from("learners")
    .select("id")
    .eq("id", learnerId)
    .maybeSingle();
  return data !== null;
}

const createLearnerSchema = z.object({
  displayName: z.string().trim().min(1).max(100),
  // Minors only in guardian mode; a self 18+ profile uses is_self.
  ageBand: z.enum(["under_13", "13_15", "16_17", "18_plus"]),
  isSelf: z.boolean().default(false),
});

export async function createLearnerAction(
  input: z.input<typeof createLearnerSchema>,
): Promise<ActionResult<{ learnerId: string }>> {
  const parsed = createLearnerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Ogiltiga uppgifter." };
  const ctx = await requireUser();
  if (!ctx) return { ok: false, message: "Du måste vara inloggad." };

  const { data, error } = await ctx.supabase.rpc("create_learner", {
    p_display_name: parsed.data.displayName,
    p_age_band: parsed.data.ageBand,
    p_is_self: parsed.data.isSelf,
  });
  if (error) {
    logger.error("guardian.create_learner_failed", { message: error.message });
    return { ok: false, message: "Kunde inte skapa elevprofilen." };
  }
  revalidatePath("/app/guardian/learners");
  return { ok: true, data: { learnerId: data as string } };
}

const seatSchema = z.object({
  entitlementId: z.string().uuid(),
  learnerId: z.string().uuid(),
});

const SEAT_ERROR_SV: Record<string, string> = {
  no_seats_left: "Alla elevplatser är upptagna.",
  already_assigned: "Eleven har redan en plats på det här köpet.",
  entitlement_inactive: "Köpet är inte aktivt.",
  learner_not_accessible: "Du har inte åtkomst till den eleven.",
  entitlement_not_found: "Köpet hittades inte.",
};

export async function assignSeatAction(
  input: z.input<typeof seatSchema>,
): Promise<ActionResult> {
  const parsed = seatSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Ogiltiga uppgifter." };
  const ctx = await requireUser();
  if (!ctx) return { ok: false, message: "Du måste vara inloggad." };

  const { error } = await ctx.supabase.rpc("assign_entitlement_seat", {
    p_entitlement_id: parsed.data.entitlementId,
    p_learner_id: parsed.data.learnerId,
  });
  if (error) {
    const key = Object.keys(SEAT_ERROR_SV).find((k) => error.message.includes(k));
    return { ok: false, message: key ? SEAT_ERROR_SV[key] : "Kunde inte tilldela plats." };
  }
  revalidatePath("/app/guardian/purchases");
  return { ok: true };
}

export async function removeSeatAction(
  input: z.input<typeof seatSchema>,
): Promise<ActionResult> {
  const parsed = seatSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Ogiltiga uppgifter." };
  const ctx = await requireUser();
  if (!ctx) return { ok: false, message: "Du måste vara inloggad." };

  const { error } = await ctx.supabase.rpc("remove_entitlement_seat", {
    p_entitlement_id: parsed.data.entitlementId,
    p_learner_id: parsed.data.learnerId,
  });
  if (error) return { ok: false, message: "Kunde inte ta bort platsen." };
  revalidatePath("/app/guardian/purchases");
  return { ok: true };
}

const pinSchema = z.object({
  learnerId: z.string().uuid(),
  pin: z.string().regex(/^\d{4,8}$/, "PIN måste vara 4–8 siffror."),
});

export async function setPinAction(
  input: z.input<typeof pinSchema>,
): Promise<ActionResult> {
  const parsed = pinSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Ogiltig PIN." };
  }
  const ctx = await requireUser();
  if (!ctx) return { ok: false, message: "Du måste vara inloggad." };

  // Guardian access is checked with the caller's OWN RLS client before the
  // service-role write in setLearnerPin (which bypasses RLS by design).
  if (!(await assertLearnerAccess(ctx.supabase, parsed.data.learnerId))) {
    return { ok: false, message: "Du har inte åtkomst till den eleven." };
  }
  try {
    await setLearnerPin(parsed.data.learnerId, parsed.data.pin);
  } catch (err) {
    if (err instanceof PinError) return { ok: false, message: err.message };
    return { ok: false, message: "Kunde inte spara PIN." };
  }
  revalidatePath(`/app/guardian/learners/${parsed.data.learnerId}`);
  return { ok: true };
}

const consentSchema = z.object({
  learnerId: z.string().uuid(),
  consentType: z.enum(["essential", "product_analytics", "study_reminders"]),
  granted: z.boolean(),
});

export async function recordConsentAction(
  input: z.input<typeof consentSchema>,
): Promise<ActionResult> {
  const parsed = consentSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Ogiltiga uppgifter." };
  const ctx = await requireUser();
  if (!ctx) return { ok: false, message: "Du måste vara inloggad." };

  // Purpose-specific, immutable evidence row (§43.4). Never bundle purposes.
  const { error } = await ctx.supabase.from("guardian_consents").insert({
    learner_id: parsed.data.learnerId,
    guardian_user_id: ctx.user.id,
    consent_type: parsed.data.consentType,
    policy_version: PRIVACY_POLICY_VERSION,
    granted: parsed.data.granted,
    evidence: { source: "guardian_settings", ts: new Date().toISOString() },
  });
  if (error) {
    logger.error("guardian.consent_failed", { message: error.message });
    return { ok: false, message: "Kunde inte spara samtycket." };
  }
  revalidatePath("/app/guardian/consents");
  return { ok: true };
}
