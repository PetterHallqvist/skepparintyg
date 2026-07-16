import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { clientEnv, isSupabaseConfigured } from "@/lib/env";

/**
 * Session refresh + route protection (SPEC §61.2).
 *
 * Protected prefixes: /app (learner), /admin. When Supabase is not yet
 * configured (pre-cloud dev shell, Phase 0) the shell renders openly —
 * there is no user data behind it. The learner layout shows a preview
 * banner in that mode.
 */
const PROTECTED_PREFIXES = ["/app", "/admin"];

export default async function proxy(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL!,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and getUser() — token refresh.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/logga-in";
    // Internal path only — never a full URL (open-redirect guard, SPEC §61.2).
    url.searchParams.set("nasta", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/health|charts|media|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
