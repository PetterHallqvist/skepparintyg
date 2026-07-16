import { Check, Minus } from "lucide-react";
import { DisclaimerBlock } from "@/components/design-system/disclaimer-block";
import { SourceStamp } from "@/components/design-system/source-stamp";
import { formatOre, formatVatRate } from "@/lib/commerce/money";
import { getFact } from "@/lib/content/official-facts";
import { BRAND } from "@/lib/brand";

/**
 * TrustBlock (SPEC §10.5) — the honesty panel every certificate page carries:
 * what the course prepares you for, what it does NOT include, the official next
 * steps with source stamps, access duration, price incl. VAT, that official
 * fees are separate, and the independence disclaimer. Facts come from the
 * verified register (getFact), never hard-coded.
 */
export function TrustBlock({
  prepares,
  notIncluded,
  price,
}: {
  prepares: string[];
  notIncluded: string[];
  price?: { oreIncVat: number; vatRateBasisPoints: number; accessMonths: number };
}) {
  const feeFact = getFact("exam_fees_separate");
  const passFact = getFact("pass_threshold_digital");

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="grid gap-px overflow-hidden rounded-t-lg bg-border sm:grid-cols-2">
        <div className="bg-card p-6">
          <h3 className="text-label mb-3 text-sea-700 dark:text-sea-300">
            Detta förbereder dig för
          </h3>
          <ul className="space-y-2">
            {prepares.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm">
                <Check
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-success"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-card p-6">
          <h3 className="text-label mb-3 text-muted-foreground">Ingår inte</h3>
          <ul className="space-y-2">
            {notIncluded.map((item) => (
              <li
                key={item}
                className="flex gap-2.5 text-sm text-muted-foreground"
              >
                <Minus aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <dl className="grid gap-x-6 gap-y-3 border-t border-border p-6 sm:grid-cols-2">
        <div>
          <dt className="text-label text-muted-foreground">Godkäntgräns</dt>
          <dd className="mt-1 font-readout">{passFact.value}</dd>
        </div>
        {price && (
          <>
            <div>
              <dt className="text-label text-muted-foreground">
                Pris (inkl. moms)
              </dt>
              <dd className="mt-1 font-readout">
                {formatOre(price.oreIncVat)}{" "}
                <span className="text-sm text-muted-foreground">
                  inkl. {formatVatRate(price.vatRateBasisPoints)} moms
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-label text-muted-foreground">Tillgång</dt>
              <dd className="mt-1 font-readout">{price.accessMonths} månader</dd>
            </div>
          </>
        )}
        <div>
          <dt className="text-label text-muted-foreground">Officiella avgifter</dt>
          <dd className="mt-1 text-sm">{feeFact.publicCopy}</dd>
        </div>
      </dl>

      <div className="border-t border-border p-6">
        <SourceStamp
          checkedAt={passFact.verifiedAt}
          source={passFact.sourceOrg}
          className="border-0 px-0"
        />
        <DisclaimerBlock className="mt-4">
          {BRAND.independenceDisclaimer}
        </DisclaimerBlock>
      </div>
    </div>
  );
}
