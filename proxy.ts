import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { CERT_COOKIE, CERTIFICATION_IDS } from "@/lib/certifications/registry";
import { clientEnv, isSupabaseConfigured } from "@/lib/env";

/**
 * Session refresh + route protection (SPEC §61.2) + the first-run
 * certification gate (§12.2).
 *
 * Protected prefixes: /app (learner), /admin. When Supabase is not yet
 * configured (pre-cloud dev shell, Phase 0) the shell renders openly —
 * there is no user data behind it. The learner layout shows a preview
 * banner in that mode. The certification gate applies in BOTH modes: /app
 * surfaces are tailored to a chosen certification, so without a valid
 * choice the learner is sent to the picker.
 */
const PROTECTED_PREFIXES = ["/app", "/admin"];

/** Routes reachable without a chosen certification (picker + account/guardian). */
const CERT_EXEMPT = ["/app/valj-intyg", "/app/konto", "/app/guardian"];

function certGateResponse(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  const inApp = pathname === "/app" || pathname.startsWith("/app/");
  if (!inApp) return null;
  const exempt = CERT_EXEMPT.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (exempt) return null;
  const raw = request.cookies.get(CERT_COOKIE)?.value;
  const valid =
    raw !== undefined && (CERTIFICATION_IDS as readonly string[]).includes(raw);
  if (valid) return null;
  const url = request.nextUrl.clone();
  url.pathname = "/app/valj-intyg";
  url.search = "";
  // Internal path only — never a full URL (open-redirect guard, §61.2).
  url.searchParams.set("nasta", pathname);
  return NextResponse.redirect(url);
}

export default async function proxy(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return certGateResponse(request) ?? NextResponse.next();
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

  const certRedirect = certGateResponse(request);
  if (certRedirect) return certRedirect;

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/health|charts|media|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
