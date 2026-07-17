"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { buildAccountExport, type AccountExport } from "@/lib/account/export";
import {
  evaluateGuarantee,
  GUARANTEE_VERSION,
  type GuaranteeEvaluation,
} from "@/lib/commerce/guarantee";
import { logger } from "@/lib/observability/logger";

/**
 * Account self-service (SPEC §71). Export and deletion always act on the caller
 * derived from the session — never a client-supplied id. Deletion is
 * conservative by design: it revokes access and scrubs personal data but retains
 * the minimal financial records the law requires (§71.4), and it never hard-
 * deletes the auth user here (full erasure after the retention window is an
 * operator/cron task, documented in HUMAN_VERIFY).
 */

/** Sign out and return to the marketing home. Used by the account page form. */
export async function signOutAction(): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}

export type ExportResult =
  | { ok: true; data: AccountExport }
  | { ok: false; message: string };

export async function requestAccountExport(): Promise<ExportResult> {
  if (!isSupabaseConfigured) {
    return { ok: false, message: "Export är tillgänglig när kontot är aktivt." };
  }
  const data = await buildAccountExport(new Date().toISOString());
  if (!data) return { ok: false, message: "Du måste vara inloggad." };
  return { ok: true, data };
}

const deleteSchema = z.object({
  // Typed confirmation — deletion never fires on a stray click.
  confirmation: z.literal("RADERA MITT KONTO"),
});

export type DeleteResult =
  | { ok: true }
  | { ok: false; message: string };

export async function deleteMyAccount(
  input: z.input<typeof deleteSchema>,
): Promise<DeleteResult> {
  if (!deleteSchema.safeParse(input).success) {
    return { ok: false, message: "Skriv bekräftelsetexten exakt för att radera." };
  }
  if (!isSupabaseConfigured) {
    return { ok: false, message: "Radering är tillgänglig när kontot är aktivt." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Du måste vara inloggad." };

  try {
    const svc = createSupabaseServiceClient();

    // Learners this user is the SOLE active guardian of → soft-delete their
    // study data. Co-guarded learners are left for the other guardian.
    const { data: myLinks } = await svc
      .from("learner_guardians")
      .select("learner_id")
      .eq("guardian_user_id", user.id)
      .eq("status", "active");
    const learnerIds = (myLinks ?? []).map((l) => l.learner_id as string);

    for (const learnerId of learnerIds) {
      const { count } = await svc
        .from("learner_guardians")
        .select("guardian_user_id", { count: "exact", head: true })
        .eq("learner_id", learnerId)
        .eq("status", "active");
      if ((count ?? 0) <= 1) {
        await svc
          .from("learners")
          .update({ deleted_at: new Date().toISOString() })
          .eq("id", learnerId);
      }
    }

    // Revoke every guardian link and scrub personal profile fields.
    await svc
      .from("learner_guardians")
      .update({ status: "revoked" })
      .eq("guardian_user_id", user.id);
    await svc
      .from("profiles")
      .update({
        display_name: null,
        marketing_email_allowed: false,
        product_analytics_allowed: false,
      })
      .eq("id", user.id);

    logger.info("account.deletion_processed", { note: "personal data scrubbed" });
    await supabase.auth.signOut();
    return { ok: true };
  } catch (err) {
    logger.error("account.deletion_failed", {
      message: err instanceof Error ? err.message : "okänt fel",
    });
    return { ok: false, message: "Kunde inte radera kontot. Kontakta support." };
  }
}

const guaranteeSchema = z.object({
  examDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ange datum som ÅÅÅÅ-MM-DD."),
  examPassed: z.boolean(),
});

export type GuaranteeResult =
  | { ok: true; evaluation: GuaranteeEvaluation }
  | { ok: false; message: string };

export async function submitGuaranteeClaim(
  input: z.input<typeof guaranteeSchema>,
): Promise<GuaranteeResult> {
  const parsed = guaranteeSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Ogiltiga uppgifter." };
  }
  if (!isSupabaseConfigured) {
    return { ok: false, message: "Studiegarantin gäller aktiva konton." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Du måste vara inloggad." };

  const { data: ent } = await supabase
    .from("entitlements")
    .select("id,starts_at,expires_at,status")
    .eq("status", "active")
    .order("starts_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!ent) {
    return { ok: false, message: "Du har inget aktivt köp att koppla anspråket till." };
  }

  const examMs = Date.parse(parsed.data.examDate);
  const activeOnExam =
    Date.parse(ent.starts_at) <= examMs &&
    (ent.expires_at === null || Date.parse(ent.expires_at) >= examMs);

  // Study metrics wire in with the readiness model; the human reviewer sees the
  // full record regardless. The snapshot records what was known at claim time.
  const snapshot = {
    planCompletion01: 0,
    readinessScore: 0,
    readinessThreshold: 75,
    examPassed: parsed.data.examPassed,
    examDate: parsed.data.examDate,
    entitlementActiveOnExamDate: activeOnExam,
  };
  const evaluation = evaluateGuarantee(snapshot);

  const { error } = await supabase.from("guarantee_claims").insert({
    purchaser_user_id: user.id,
    entitlement_id: ent.id,
    guarantee_version: GUARANTEE_VERSION,
    eligibility_snapshot: { snapshot, evaluation, metricsComplete: false },
    requested_benefit: "access_extension",
    status: "submitted",
  });
  if (error) {
    logger.error("guarantee.submit_failed", { message: error.message });
    return { ok: false, message: "Kunde inte skicka anspråket." };
  }
  return { ok: true, evaluation };
}
