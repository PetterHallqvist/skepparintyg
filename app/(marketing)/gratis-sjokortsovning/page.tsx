import type { Metadata } from "next";
import { ChartLab } from "@/components/chart/chart-lab";
import { PageShell } from "@/components/design-system/page-shell";
import { SectionHeading } from "@/components/design-system/section-heading";
import { LeadCaptureForm } from "@/components/marketing/lead-capture-form";
import { getChartTask, getChartTaskList } from "@/lib/chart/actions";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Gratis sjökortsövning",
  description:
    "Prova det interaktiva sjökortslabbet gratis. Mät, sätt ut och räkna på ett fiktivt övningskort — din lösning rättas på servern.",
};

/**
 * Free chart demo (SPEC §9.3). Lifts the DB/auth-free chart lab to a public
 * route with one Grundviken task. Wrapped in the instrument theme so the chart
 * renders on the dark console surface even inside the paper marketing layout.
 */
export default async function GratisSjokortsovningPage() {
  const tasks = await getChartTaskList();
  const initialTask = await getChartTask(tasks[0].id);

  return (
    <section>
      <PageShell className="py-12 sm:py-16">
        <SectionHeading
          as="h1"
          kicker="Gratis"
          title="Prova sjökortsövningen"
          lead="Så här känns det att öva sjökortsarbete hos oss: du mäter, sätter ut och räknar — och får exakt återkoppling. Ingen inloggning krävs."
        />

        <div className="theme-instrument mt-8 overflow-hidden rounded-lg border border-border bg-background p-4 text-foreground sm:p-6">
          <ChartLab initialTask={initialTask} />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {BRAND.navigationDisclaimer}
        </p>

        <div className="mx-auto mt-12 max-w-xl rounded-lg border border-border bg-paper-sunken/60 p-6">
          <h2 className="font-semibold">Vill du träna mer?</h2>
          <p className="mb-4 mt-1 text-sm text-muted-foreground">
            Lämna din e-post så berättar vi när du kan komma igång. Frivilligt.
          </p>
          <LeadCaptureForm
            source="gratis-sjokortsovning"
            ctaLabel="Håll mig uppdaterad"
          />
        </div>
      </PageShell>
    </section>
  );
}
