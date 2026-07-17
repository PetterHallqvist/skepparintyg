import type { Metadata } from "next";
import Link from "next/link";
import { TrainerPage } from "@/components/learning/trainer-page";
import { PageShell } from "@/components/design-system/page-shell";
import { SectionHeading } from "@/components/design-system/section-heading";
import { StatusChip } from "@/components/design-system/status-chip";
import { LeadCaptureForm } from "@/components/marketing/lead-capture-form";
import {
  ALL_CERTIFICATIONS,
  certIdSchema,
  certification,
} from "@/lib/certifications/registry";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Gratis kunskapstest",
  description:
    "Testa dina kunskaper inför ditt båtlivsintyg gratis. Välj intyg och få resultatet direkt på skärmen — ingen e-post krävs.",
};

/**
 * Free knowledge test (SPEC §9.3), certification-aware: ?intyg=<id> selects
 * which test's free pool is played (default Förarintyg). Server-graded, the
 * result shows on screen immediately, no email required, answer keys never
 * reach the client. The client hint can at most select among these free
 * public pools — in-app content stays behind the cookie + entitlements.
 */
export default async function GratisKunskapstestPage({
  searchParams,
}: {
  searchParams: Promise<{ intyg?: string }>;
}) {
  const { intyg } = await searchParams;
  const parsed = certIdSchema.safeParse(intyg);
  const certId = parsed.success ? parsed.data : "forarintyg";
  const def = certification(certId);

  return (
    <section>
      <PageShell className="py-12 sm:py-16">
        <SectionHeading
          as="h1"
          kicker="Gratis"
          title="Testa dina kunskaper"
          lead={`Ett blandat kunskapstest inför ${def.nameSv}. Du får resultatet direkt på skärmen — ingen e-post krävs, inga hinder.`}
        />

        <nav
          aria-label="Välj intyg"
          className="mt-6 flex flex-wrap items-center gap-2"
        >
          {ALL_CERTIFICATIONS.map((c) => (
            <Link
              key={c.id}
              href={`/gratis-kunskapstest?intyg=${c.id}`}
              aria-current={c.id === certId ? "page" : undefined}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                c.id === certId
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
              )}
            >
              {c.shortLabel}
            </Link>
          ))}
        </nav>
        {def.status === "preview" ? (
          <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <StatusChip tone="warning">Förhandsversion</StatusChip>
            Frågorna för {def.nameSv} är utkast under granskning.
          </p>
        ) : null}

        <div className="mt-8">
          <TrainerPage cert={certId} track="pass" backHref={null} />
        </div>

        <div className="mx-auto mt-12 max-w-xl rounded-lg border border-border bg-paper-sunken/60 p-6">
          <h2 className="font-semibold">Vill du ha en plan fram till provet?</h2>
          <p className="mb-4 mt-1 text-sm text-muted-foreground">
            Lämna din e-post så skickar vi en kom-igång-guide. Frivilligt — ditt
            resultat visas oavsett.
          </p>
          <LeadCaptureForm
            source={`gratis-kunskapstest:${certId}`}
            ctaLabel="Skicka guiden"
          />
        </div>
      </PageShell>
    </section>
  );
}
