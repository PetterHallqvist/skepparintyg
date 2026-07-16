import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DisclaimerBlock } from "@/components/design-system/disclaimer-block";
import { PageShell } from "@/components/design-system/page-shell";
import { SectionHeading } from "@/components/design-system/section-heading";
import { getCatalog } from "@/lib/commerce/catalog";
import { formatOre, formatVatRate } from "@/lib/commerce/money";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Priser",
  description:
    "Ett pris, inkl. moms, utan prenumeration. Officiella provavgifter tillkommer och betalas separat.",
};

const INCLUDED = [
  "Alla lektioner med källhänvisningar",
  "Interaktivt sjökortslabb med exakt återkoppling",
  "Väjnings-, ljus- och ljudsignalsträning",
  "Felbok som tränar bort dina missuppfattningar",
  "Kortlekar för Anki och Quizlet",
  "Öppen beredskapsmätning fram till provdagen",
] as const;

export default async function PricingPage() {
  const catalog = await getCatalog();

  return (
    <section>
      <PageShell width="narrow" className="py-16 sm:py-20">
        <SectionHeading
          kicker="Priser"
          title="Ett pris. Ingen prenumeration."
          lead="Du betalar en gång och har tillgång under hela perioden. Ingen automatisk förnyelse — vi drar aldrig ett nytt belopp utan att du aktivt köper igen."
        />

        <div className="mt-10 grid gap-6">
          {catalog.map((product) => {
            const vat = formatVatRate(product.vatRateBasisPoints);
            return (
              <div
                key={product.id}
                className="bezel overflow-hidden rounded-lg border border-border bg-card"
              >
                <div className="grid gap-6 p-6 sm:grid-cols-[1.3fr_1fr] sm:p-8">
                  <div>
                    <h2 className="font-serif text-2xl font-medium">
                      {product.nameSv}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {product.descriptionSv}
                    </p>
                    <ul className="mt-6 space-y-2.5">
                      {INCLUDED.map((feature) => (
                        <li key={feature} className="flex gap-2.5 text-sm">
                          <Check
                            aria-hidden="true"
                            className="mt-0.5 size-4 shrink-0 text-sea-700"
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col justify-between rounded-md border border-border bg-paper-sunken/60 p-6">
                    <div>
                      <p className="font-readout text-4xl font-medium tracking-tight">
                        {formatOre(product.priceOreIncVat)}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        inkl. {vat} moms · {product.accessMonths} månaders tillgång
                      </p>
                      {product.seatCount > 1 && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          Upp till {product.seatCount} elevplatser.
                        </p>
                      )}
                    </div>
                    <Button
                      size="lg"
                      className="mt-6 w-full"
                      render={<Link href={`/kassa/${product.id}`} />}
                    >
                      Till kassan
                      <ArrowRight aria-hidden="true" />
                    </Button>
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      Betalning med kort eller Klarna via Stripe.
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <DisclaimerBlock className="mt-8">
          {BRAND.independenceDisclaimer} Officiella avgifter för provlicens och
          bokning betalas separat till NFB och ingår inte i priset.
        </DisclaimerBlock>
      </PageShell>
    </section>
  );
}
