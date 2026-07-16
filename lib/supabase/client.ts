"use client";

import { createBrowserClient } from "@supabase/ssr";
import { clientEnv, isSupabaseConfigured } from "@/lib/env";

/** Browser Supabase client — interactive auth flows only. */
export function createSupabaseBrowserClient() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase är inte konfigurerat (NEXT_PUBLIC_SUPABASE_URL/ANON_KEY saknas).",
    );
  }
  return createBrowserClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL!,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
