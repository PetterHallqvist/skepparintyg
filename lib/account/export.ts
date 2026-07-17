import "server-only";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Account data export (SPEC §71.3). Assembles the caller's own personal data
 * into a readable object. Everything reads through the caller's RLS client, so
 * it is structurally impossible to over-return another user's data.
 *
 * Deliberately EXCLUDED (§71.3): item answer keys, other users' data, security
 * logs (external_events / audit_log), and copyrighted source documents. We only
 * select personal + commercial + consent data — never item content.
 */

export interface AccountExport {
  exportedAt: string;
  format: "sjoklart-account-export-v1";
  profile: Record<string, unknown> | null;
  learners: Record<string, unknown>[];
  guardianLinks: Record<string, unknown>[];
  guardianConsents: Record<string, unknown>[];
  consentEvents: Record<string, unknown>[];
  orders: Record<string, unknown>[];
  orderItems: Record<string, unknown>[];
  entitlements: Record<string, unknown>[];
  note: string;
}

export async function buildAccountExport(
  nowIso: string,
): Promise<AccountExport | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [
    profile,
    learners,
    guardianLinks,
    guardianConsents,
    consentEvents,
    orders,
    orderItems,
    entitlements,
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("learners").select("*"),
    supabase.from("learner_guardians").select("*"),
    supabase.from("guardian_consents").select("*"),
    supabase.from("consent_events").select("*"),
    supabase
      .from("orders")
      .select(
        "id,status,currency,subtotal_ore,vat_ore,total_ore,terms_version,withdrawal_consent_snapshot,paid_at,created_at",
      ),
    supabase
      .from("order_items")
      .select(
        "id,order_id,product_name_snapshot,unit_amount_ore_inc_vat,vat_rate_basis_points,access_months_snapshot,quantity",
      ),
    supabase
      .from("entitlements")
      .select("id,product_id,status,starts_at,expires_at,seat_count,refunded_at"),
  ]);

  return {
    exportedAt: nowIso,
    format: "sjoklart-account-export-v1",
    profile: profile.data ?? null,
    learners: learners.data ?? [],
    guardianLinks: guardianLinks.data ?? [],
    guardianConsents: guardianConsents.data ?? [],
    consentEvents: consentEvents.data ?? [],
    orders: orders.data ?? [],
    orderItems: orderItems.data ?? [],
    entitlements: entitlements.data ?? [],
    note: "Innehåller dina personuppgifter, samtycken och köp. Detaljerade studieloggar och svarsnycklar ingår inte (svarsnycklar exporteras aldrig).",
  };
}
