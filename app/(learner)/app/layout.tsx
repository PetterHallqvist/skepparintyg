import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/design-system/logo";
import { AppSidebarNav, AppTabBar } from "@/components/learning/app-nav";
import { getActiveCertificationId } from "@/lib/certifications/active";
import { certification } from "@/lib/certifications/registry";
import { isSupabaseConfigured } from "@/lib/env";
import { BRAND } from "@/lib/brand";

// The learner app holds personal study data — never index it (SPEC M7 DoD).
export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Learner shell — "navigation console" (instrument theme). Navigation is
 * tailored to the active certification (chart-lab entry only where §20.2
 * says it applies). Lesson reading surfaces render as light paper sheets.
 */
export default async function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const activeCertId = await getActiveCertificationId();
  const chartLab = activeCertId ? certification(activeCertId).chartLab : true;
  return (
    <div className="theme-instrument flex min-h-svh flex-col bg-background text-foreground">
      {!isSupabaseConfigured ? (
        <p
          role="status"
          className="border-b border-border bg-warning/15 px-4 py-1.5 text-center text-xs text-warning"
        >
          Förhandsvisning — inloggning och lagring är inte konfigurerade ännu.
        </p>
      ) : null}

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden w-60 shrink-0 flex-col border-r border-border md:flex">
          <div className="flex h-16 items-center border-b border-border px-5">
            <Link href="/app/start" aria-label={`${BRAND.name} — start`}>
              <Logo />
            </Link>
          </div>
          <div className="flex-1 p-3">
            <AppSidebarNav chartLab={chartLab} />
          </div>
          <p className="border-t border-border p-4 text-xs leading-relaxed text-muted-foreground">
            {BRAND.navigationDisclaimer}
          </p>
        </aside>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile top bar */}
          <header className="flex h-14 items-center justify-between border-b border-border px-4 md:hidden">
            <Link href="/app/start" aria-label={`${BRAND.name} — start`}>
              <Logo />
            </Link>
          </header>
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
        </div>
      </div>

      <AppTabBar chartLab={chartLab} />
    </div>
  );
}
