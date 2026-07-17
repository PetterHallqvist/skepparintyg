import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/design-system/page-shell";
import { SectionHeading } from "@/components/design-system/section-heading";
import { SourceStamp } from "@/components/design-system/source-stamp";
import { StatusChip } from "@/components/design-system/status-chip";
import { TrustBlock } from "@/components/marketing/trust-block";
import { getCatalogProduct } from "@/lib/commerce/catalog";
import { getFact } from "@/lib/content/official-facts";

export const metadata: Metadata = {
  title: "Förarintyg",
  description:
    "Förbered dig för Förarintyget: sjökortsarbete, väjningsregler, sjömanskap och säkerhet — med interaktiv övning och tydlig återkoppling.",
};

const MODULES = [
  "Sjökortskunskap och positionsbestämning",
  "Kurs, distans och fart — uträkning och plottning",
  "Kompass, missvisning och deviation",
  "Sjövägsregler och väjning",
  "Fyrar, sjömärken och ljudsignaler",
  "Sjömanskap, säkerhet och sjövett",
] as const;

export default async function ForarintygPage() {
  const product = await getCatalogProduct("forarintyg-digital");
  const timeFact = getFact("forar_exam_time");
  const ageFact = getFact("forar_min_age");

  return (
    <>
      <section className="border-b border-border bg-contours">
        <PageShell width="narrow" className="py-16 sm:py-20">
          <StatusChip tone="info">Byggs nu</StatusChip>
          <h1 className="mt-4 font-serif text-4xl font-medium leading-tight tracking-tight text-balance sm:text-5xl">
            Förarintyg
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Grundintyget för fritidsbåt. Vi förbereder dig på de kunskaper
            provet kräver — och låter dig öva sjökortsarbetet på riktigt, inte
            bara läsa om det.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" render={<Link href="/gratis-kunskapstest" />}>
              Gör gratis kunskapstest
              <ArrowRight aria-hidden="true" />
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/priser" />}>
              Se priser
            </Button>
          </div>
        </PageShell>
      </section>

      <section className="border-b border-border">
        <PageShell width="narrow" className="py-16">
          <SectionHeading kicker="Innehåll" title="Det här tränar du på" />
          <ul className="mt-8 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
            {MODULES.map((m, i) => (
              <li key={m} className="bg-card p-5">
                <span className="font-readout text-sm text-sea-700 dark:text-sea-300">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 text-sm">{m}</p>
              </li>
            ))}
          </ul>
        </PageShell>
      </section>

      <section className="border-b border-border bg-paper-sunken/60">
        <PageShell width="narrow" className="py-16">
          <SectionHeading kicker="Ärligt" title="Vad du får — och vad du inte får" />
          <div className="mt-8">
            <TrustBlock
              prepares={[
                "Kunskaperna som Förarintygets teoriprov kräver",
                "Praktiskt sjökortsarbete med exakt återkoppling",
                "En personlig plan och öppen beredskapsmätning",
              ]}
              notIncluded={[
                "Det officiella provet och intyget (bokas hos NFB)",
                "Provlicens och bokningsavgift",
                "Fysisk båtpraktik",
              ]}
              price={
                product
                  ? {
                      oreIncVat: product.priceOreIncVat,
                      vatRateBasisPoints: product.vatRateBasisPoints,
                      accessMonths: product.accessMonths,
                    }
                  : undefined
              }
            />
          </div>
        </PageShell>
      </section>

      <section>
        <PageShell width="narrow" className="py-16">
          <SectionHeading
            kicker="Den officiella processen"
            title="Provet bokas separat hos NFB"
          />
          <dl className="mt-8 divide-y divide-border border-y border-border">
            {[timeFact, ageFact].map((fact) => (
              <div
                key={fact.id}
                className="grid gap-2 py-4 sm:grid-cols-[220px_1fr] sm:gap-6"
              >
                <dt className="text-label pt-1 text-muted-foreground">
                  {fact.label}
                </dt>
                <dd>
                  <p className="font-readout">{fact.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {fact.publicCopy}
                  </p>
                  <SourceStamp
                    checkedAt={fact.verifiedAt}
                    source={fact.sourceOrg}
                    className="mt-2 border-0 px-0"
                  />
                </dd>
              </div>
            ))}
          </dl>
        </PageShell>
      </section>
    </>
  );
}
