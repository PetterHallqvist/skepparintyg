import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { clientEnv, isSupabaseConfigured } from "@/lib/env";

/**
 * Server Component / Server Action Supabase client (cookie-based session).
 * Throws when Supabase is unconfigured — call sites that can run in the
 * pre-cloud dev shell must check `isSupabaseConfigured` first.
 */
export async function createSupabaseServerClient() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase är inte konfigurerat (NEXT_PUBLIC_SUPABASE_URL/ANON_KEY saknas).",
    );
  }
  const cookieStore = await cookies();

  return createServerClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL!,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — session refresh is handled by proxy.ts.
          }
        },
      },
    },
  );
}
