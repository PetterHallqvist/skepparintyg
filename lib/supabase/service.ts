import "server-only";
import { createClient } from "@supabase/supabase-js";
import { clientEnv, serverEnv } from "@/lib/env";

/**
 * Service-role client — TRUSTED SERVER CODE ONLY (SPEC §55.2). Bypasses RLS.
 * Every call site must have verified the caller's learner access first using
 * the caller's own (RLS-checked) client. Never import from client components
 * ("server-only" enforces this at build time).
 */
export function createSupabaseServiceClient() {
  if (!clientEnv.NEXT_PUBLIC_SUPABASE_URL || !serverEnv.SUPABASE_SECRET_KEY) {
    throw new Error(
      "Service-klienten kräver NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SECRET_KEY.",
    );
  }
  return createClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SECRET_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
