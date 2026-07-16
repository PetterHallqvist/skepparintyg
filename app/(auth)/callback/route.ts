import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { logger } from "@/lib/observability/logger";

/**
 * Magic-link callback. Exchanges the auth code for a session, then redirects
 * to a SAFE internal path only (open-redirect guard, SPEC §61.2).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  if (!isSupabaseConfigured) {
    return NextResponse.redirect(`${origin}/logga-in`);
  }

  const code = searchParams.get("code");
  const nasta = searchParams.get("nasta") ?? "/app/start";
  // Internal absolute path only: must start with exactly one "/".
  const safePath = /^\/(?!\/)/.test(nasta) ? nasta : "/app/start";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${safePath}`);
    }
    logger.warn("auth.callback_exchange_failed", { code: error.code });
  }

  return NextResponse.redirect(`${origin}/logga-in?fel=lanken-har-gatt-ut`);
}
