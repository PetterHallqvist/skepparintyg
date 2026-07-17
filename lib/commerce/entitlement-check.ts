import "server-only";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Server-side paid-content gate (SPEC §52.3). Delegates to the SECURITY DEFINER
 * `has_active_entitlement` so the SAME predicate that RLS enforces on content
 * rows also gates route handlers and server components — one source of truth.
 *
 * Fail-closed: with no database (demo shell) NO paid content is accessible, and
 * any RPC error resolves to `false`. Free content never calls this.
 */
export async function hasActiveEntitlement(
  certificationId: string,
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("has_active_entitlement", {
    p_certification_id: certificationId,
  });
  if (error) return false;
  return data === true;
}
