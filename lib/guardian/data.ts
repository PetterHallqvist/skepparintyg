import "server-only";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Guardian read helpers (SPEC §11.3, §43). Everything goes through the caller's
 * RLS client, so a guardian only ever sees learners they can access and orders
 * they purchased — the query can't over-return. Demo shell returns empty sets.
 */

export interface GuardianLearner {
  id: string;
  displayName: string;
  ageBand: string;
  relationship: string;
  isSelf: boolean;
}

export interface GuardianEntitlement {
  id: string;
  productId: string;
  status: string;
  startsAt: string;
  expiresAt: string | null;
  seatCount: number;
  assignedLearners: { learnerId: string; displayName: string }[];
}

export async function getGuardianLearners(): Promise<GuardianLearner[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createSupabaseServerClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return [];

  const { data } = await supabase
    .from("learners")
    .select(
      "id,display_name,age_band,is_self_profile,learner_guardians!inner(relationship,guardian_user_id,status)",
    )
    .eq("learner_guardians.guardian_user_id", user.user.id)
    .eq("learner_guardians.status", "active")
    .is("deleted_at", null);

  return (data ?? []).map((row) => {
    const link = (
      row.learner_guardians as { relationship: string }[] | undefined
    )?.[0];
    return {
      id: row.id as string,
      displayName: row.display_name as string,
      ageBand: row.age_band as string,
      relationship: link?.relationship ?? "guardian",
      isSelf: row.is_self_profile as boolean,
    };
  });
}

/**
 * Latest consent state per purpose for a learner (SPEC §43.4). guardian_consents
 * is append-only, so "current" = the most recent row per consent_type. Defaults
 * to false (fail-closed) when there is no row.
 */
export async function getLatestConsents(
  learnerId: string,
): Promise<Record<"product_analytics" | "study_reminders", boolean>> {
  const result = { product_analytics: false, study_reminders: false };
  if (!isSupabaseConfigured) return result;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("guardian_consents")
    .select("consent_type,granted,created_at,withdrawn_at")
    .eq("learner_id", learnerId)
    .order("created_at", { ascending: false });

  const seen = new Set<string>();
  for (const row of data ?? []) {
    const type = row.consent_type as string;
    if (seen.has(type)) continue; // first (latest) wins
    seen.add(type);
    if (type in result) {
      result[type as keyof typeof result] =
        row.granted === true && row.withdrawn_at === null;
    }
  }
  return result;
}

export async function getGuardianEntitlements(): Promise<GuardianEntitlement[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("entitlements")
    .select(
      "id,product_id,status,starts_at,expires_at,seat_count,entitlement_learners(learner_id,removed_at,learners(display_name))",
    )
    .eq("status", "active");

  return (data ?? []).map((e) => ({
    id: e.id as string,
    productId: e.product_id as string,
    status: e.status as string,
    startsAt: e.starts_at as string,
    expiresAt: (e.expires_at as string | null) ?? null,
    seatCount: e.seat_count as number,
    assignedLearners: (
      (e.entitlement_learners as
        | {
            learner_id: string;
            removed_at: string | null;
            // Supabase infers embedded relations as arrays.
            learners: { display_name: string }[] | { display_name: string } | null;
          }[]
        | undefined) ?? []
    )
      .filter((el) => el.removed_at === null)
      .map((el) => {
        const learner = Array.isArray(el.learners) ? el.learners[0] : el.learners;
        return {
          learnerId: el.learner_id,
          displayName: learner?.display_name ?? "Elev",
        };
      }),
  }));
}
