import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type StaffRole = "admin" | "reviewer" | "editor" | "support";

export type StaffContext =
  | { preview: true; userId: null; role: null }
  | { preview: false; userId: string; role: StaffRole };

/**
 * Server-side staff gate (SPEC §55.2: middleware alone is insufficient — the
 * role check runs here AND RLS enforces row access regardless).
 *
 * Pre-cloud dev shell (Supabase unconfigured): renders the admin UI in
 * preview mode with empty data so the studio can be developed and reviewed.
 */
export async function requireStaff(): Promise<StaffContext> {
  if (!isSupabaseConfigured) {
    return { preview: true, userId: null, role: null };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/logga-in?nasta=/admin");

  const { data: staffRow } = await supabase
    .from("admin_users")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!staffRow) redirect("/app/start");

  return { preview: false, userId: user.id, role: staffRow.role as StaffRole };
}
