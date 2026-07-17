import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { PageShell } from "@/components/design-system/page-shell";
import { SectionHeading } from "@/components/design-system/section-heading";
import { StatusChip } from "@/components/design-system/status-chip";
import { DisclaimerBlock } from "@/components/design-system/disclaimer-block";
import { LeadCaptureForm } from "@/components/marketing/lead-capture-form";
import { BRAND } from "@/lib/brand";
import type { CertificationId } from "@/lib/certifications/registry";

/**
 * Waitlist page for a not-yet-available certificate (SPEC §11.1). Copy must NOT
 * imply the content exists — "Planerad" chip + explicit "inte tillgänglig ännu".
 * When a preview question pool exists, the free test is linked with honest
 * förhandsversion framing.
 */
export function WaitlistPage({
  certId,
  title,
  tagline,
  covers,
  prerequisite,
  freeTestCertId,
}: {
  certId: string;
  title: string;
  tagline: string;
  covers: string[];
  prerequisite?: string;
  /** Links "prova gratisfrågor" to this certification's free preview pool. */
  freeTestCertId?: CertificationId;
}) {
  return (
    <section>
      <PageShell width="narrow" className="py-16 sm:py-20">
        <StatusChip tone="neutral">Planerad</StatusChip>
        <h1 className="mt-4 font-serif text-4xl font-medium leading-tight tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
          {tagline}
        </p>

        <DisclaimerBlock className="mt-6">
          Den här kursen är inte tillgänglig ännu. Vi bygger våra intyg ett i
          taget, med samma krav på källor och granskning som för Förarintyg.
        </DisclaimerBlock>

        <div className="mt-10">
          <SectionHeading
            as="h2"
            kicker="Planerat innehåll"
            title="Det vi planerar att täcka"
          />
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {covers.map((c) => (
              <li
                key={c}
                className="flex gap-2.5 rounded-md border border-border bg-card p-3 text-sm"
              >
                <Compass
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-sea-700 dark:text-sea-300"
                />
                <span>{c}</span>
              </li>
            ))}
          </ul>
          {prerequisite && (
            <p className="mt-4 text-sm text-muted-foreground">
              Förkunskaper: {prerequisite}
            </p>
          )}
        </div>

        {freeTestCertId ? (
          <p className="mt-8">
            <Link
              href={`/gratis-kunskapstest?intyg=${freeTestCertId}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-sea-700 hover:underline dark:text-sea-300"
            >
              Prova gratisfrågor för {title} redan nu (förhandsversion)
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          </p>
        ) : null}

        <div className="mt-10 rounded-lg border border-border bg-paper-sunken/60 p-6">
          <h2 className="font-semibold">Få besked när kursen öppnar</h2>
          <p className="mb-4 mt-1 text-sm text-muted-foreground">
            Lämna din e-post så hör vi av oss när {title} finns tillgänglig.
          </p>
          <LeadCaptureForm
            source={`waitlist:${certId}`}
            ctaLabel="Ställ mig i kö"
          />
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          {BRAND.independenceDisclaimer}
        </p>
      </PageShell>
    </section>
  );
}
