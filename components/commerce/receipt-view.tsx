import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatOre } from "@/lib/commerce/money";
import { WITHDRAWAL_CONFIRMATION } from "@/lib/commerce/legal-copy";
import { BRAND } from "@/lib/brand";
import type { ReceiptView as PaidReceipt } from "@/lib/commerce/actions";

/**
 * Presentational receipt (SPEC §52.4). Pure — no client hooks, no server-only
 * imports — so both the success page (server) and the poller (client) render it
 * from the same immutable order snapshot. Every figure is server-authoritative.
 */
export function ReceiptView({
  receipt,
}: {
  receipt: Extract<PaidReceipt, { status: "paid" }>;
}) {
  return (
    <div className="bezel rounded-lg border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <CheckCircle2 aria-hidden="true" className="size-7 text-success" />
        <h1 className="font-serif text-2xl font-medium">Betalningen är klar</h1>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Tack för ditt köp! Din tillgång är aktiverad direkt.
      </p>

      <table className="mt-6 w-full border-collapse text-sm">
        <tbody>
          {receipt.lines.map((line) => (
            <tr key={line.name}>
              <td className="py-1.5">
                {line.name}
                <span className="text-muted-foreground">
                  {" "}
                  · {line.accessMonths} mån
                </span>
              </td>
              <td className="py-1.5 text-right font-readout">
                {formatOre(line.amountOre)}
              </td>
            </tr>
          ))}
          <tr className="text-muted-foreground">
            <td className="pt-3">Delsumma (exkl. moms)</td>
            <td className="pt-3 text-right font-readout">
              {formatOre(receipt.subtotalOre)}
            </td>
          </tr>
          <tr className="text-muted-foreground">
            <td>Moms</td>
            <td className="text-right font-readout">
              {formatOre(receipt.vatOre)}
            </td>
          </tr>
          <tr className="border-t border-border font-medium">
            <td className="pt-2">Totalt</td>
            <td className="pt-2 text-right font-readout text-base">
              {formatOre(receipt.totalOre)}
            </td>
          </tr>
        </tbody>
      </table>

      <p className="mt-6 rounded-md bg-paper-sunken/60 p-3 text-xs leading-relaxed text-muted-foreground">
        {WITHDRAWAL_CONFIRMATION}
      </p>

      <Button size="lg" className="mt-6 w-full" render={<Link href="/app/start" />}>
        Till min kurs
      </Button>

      <p className="mt-4 text-xs text-muted-foreground">
        Ordernummer: <span className="font-readout">{receipt.orderId}</span>
        <br />
        {BRAND.independenceDisclaimer}
      </p>
    </div>
  );
}
