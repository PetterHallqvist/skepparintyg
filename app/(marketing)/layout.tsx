import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/design-system/logo";
import { PageShell } from "@/components/design-system/page-shell";
import { SourceStamp } from "@/components/design-system/source-stamp";
import { BRAND } from "@/lib/brand";

const NAV = [
  { href: "/forarintyg", label: "Förarintyg" },
  { href: "/priser", label: "Priser" },
  { href: "/sa-fungerar-provet", label: "Så fungerar provet" },
] as const;

const FOOTER_GROUPS = [
  {
    heading: "Utbildning",
    links: [
      { href: "/forarintyg", label: "Förarintyg" },
      { href: "/kustskepparintyg", label: "Kustskepparintyg" },
      { href: "/src", label: "SRC (VHF)" },
      { href: "/batpraktik", label: "Båtpraktik — förberedelse" },
    ],
  },
  {
    heading: "Gratis",
    links: [
      { href: "/gratis-kunskapstest", label: "Kunskapstest" },
      { href: "/gratis-sjokortsovning", label: "Sjökortsövning" },
      { href: "/sa-fungerar-provet", label: "Så fungerar provet" },
    ],
  },
  {
    heading: "Om",
    links: [
      { href: "/om-oss", label: "Om oss" },
      { href: "/experter-och-kallor", label: "Experter och källor" },
      { href: "/kundtjanst", label: "Kundtjänst" },
    ],
  },
  {
    heading: "Villkor",
    links: [
      { href: "/kopvillkor", label: "Köpvillkor" },
      { href: "/integritet", label: "Integritet" },
      { href: "/cookies", label: "Cookies" },
      { href: "/tillganglighet", label: "Tillgänglighet" },
    ],
  },
] as const;

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#innehall"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Hoppa till innehåll
      </a>

      <header className="sticky top-0 z-40 border-b border-border bg-paper/90 backdrop-blur-sm">
        <PageShell className="flex h-16 items-center justify-between gap-6">
          <Link
            href="/"
            aria-label={`${BRAND.name} — startsida`}
            className="shrink-0"
          >
            <Logo />
          </Link>
          <nav
            aria-label="Huvudmeny"
            className="hidden items-center gap-6 md:flex"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              render={<Link href="/logga-in" />}
            >
              Logga in
            </Button>
            <Button size="sm" render={<Link href="/gratis-kunskapstest" />}>
              Gör gratis test
            </Button>
          </div>
        </PageShell>
      </header>

      <main id="innehall" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border bg-paper-sunken">
        <PageShell className="py-12">
          <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
            <div className="space-y-4">
              <Logo />
              <p className="max-w-xs text-sm text-muted-foreground">
                {BRAND.description}
              </p>
              <SourceStamp
                checkedAt="2026-07-16"
                source="officiella uppgifter"
              />
            </div>
            {FOOTER_GROUPS.map((group) => (
              <nav key={group.heading} aria-label={group.heading}>
                <h2 className="text-label mb-3 text-muted-foreground">
                  {group.heading}
                </h2>
                <ul className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-foreground/80 hover:text-foreground hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
          <div className="mt-10 border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">
              {BRAND.independenceDisclaimer} Allt övningsmaterial är fiktivt:{" "}
              {BRAND.navigationDisclaimer.toLowerCase()}
            </p>
          </div>
        </PageShell>
      </footer>
    </div>
  );
}
