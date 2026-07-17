import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GuaranteeClaimForm } from "@/components/account/guarantee-claim-form";
import { DisclaimerBlock } from "@/components/design-system/disclaimer-block";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Studiegaranti" };

export default function StudiegarantiPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link
        href="/app/konto"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> Konto
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Studiegaranti</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Om du följt hela din personliga studieplan och nått godkänd beredskap men
        ändå inte blev godkänd på provet, kan du ansöka om förlängd tillgång och
        en gemensam genomgång av din studieplan.
      </p>

      <DisclaimerBlock className="mt-4">
        Studiegarantin är ingen automatisk utbetalning. En person granskar alltid
        varje anspråk och fattar beslutet. Den enda förmånen i nuläget är förlängd
        tillgång.
      </DisclaimerBlock>

      <div className="mt-6 rounded-lg border border-border bg-card p-5">
        <GuaranteeClaimForm enabled={isSupabaseConfigured} />
      </div>
    </div>
  );
}
