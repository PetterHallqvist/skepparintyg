import type { Metadata } from "next";
import { TrainerPage } from "@/components/learning/trainer-page";
import { PageShell } from "@/components/design-system/page-shell";
import { SectionHeading } from "@/components/design-system/section-heading";
import { LeadCaptureForm } from "@/components/marketing/lead-capture-form";

export const metadata: Metadata = {
  title: "Gratis kunskapstest",
  description:
    "Testa dina kunskaper inför Förarintyget gratis. Direkt resultat på skärmen — ingen e-post krävs.",
};

/**
 * Free knowledge test (SPEC §9.3). Lifts the DB-free, server-graded demo track
 * to a public route: the result shows on screen immediately, no email required.
 * Answer keys never reach the client (sanitizeDemoItem in the track actions).
 */
export default function GratisKunskapstestPage() {
  return (
    <section>
      <PageShell className="py-12 sm:py-16">
        <SectionHeading
          as="h1"
          kicker="Gratis"
          title="Testa dina kunskaper"
          lead="Ett blandat kunskapstest inför Förarintyget. Du får resultatet direkt på skärmen — ingen e-post krävs, inga hinder."
        />
        <div className="mt-8">
          <TrainerPage track="demo" />
        </div>

        <div className="mx-auto mt-12 max-w-xl rounded-lg border border-border bg-paper-sunken/60 p-6">
          <h2 className="font-semibold">Vill du ha en plan fram till provet?</h2>
          <p className="mb-4 mt-1 text-sm text-muted-foreground">
            Lämna din e-post så skickar vi en kom-igång-guide. Frivilligt — ditt
            resultat visas oavsett.
          </p>
          <LeadCaptureForm
            source="gratis-kunskapstest"
            ctaLabel="Skicka guiden"
          />
        </div>
      </PageShell>
    </section>
  );
}
