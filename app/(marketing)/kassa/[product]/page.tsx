import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/design-system/page-shell";
import { DisclaimerBlock } from "@/components/design-system/disclaimer-block";
import { CheckoutForm } from "@/components/commerce/checkout-form";
import { getCatalogProduct } from "@/lib/commerce/catalog";
import { formatOre, formatVatRate, splitVat } from "@/lib/commerce/money";
import { PRE_PURCHASE_DISCLOSURE } from "@/lib/commerce/legal-copy";
import {
  isCommerceConfigured,
  isSupabaseConfigured,
} from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BRAND } from "@/lib/brand";

// Checkout must never be indexed (SPEC M7 DoD; robots.ts also disallows /kassa).
export const metadata: Metadata = {
  title: "Kassa",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ product: string }>;
}) {
  const { product: productId } = await params;
  const product = await getCatalogProduct(productId);
  if (!product) notFound();

  let isLoggedIn = false;
  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isLoggedIn = user !== null;
  }

  const priceLabel = formatOre(product.priceOreIncVat);
  const vat = formatVatRate(product.vatRateBasisPoints);
  const { vatOre } = splitVat(product.priceOreIncVat, product.vatRateBasisPoints);

  return (
    <section>
      <PageShell width="narrow" className="py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          {/* Left: the §69.1 pre-purchase disclosure. */}
          <div>
            <h1 className="font-serif text-3xl font-medium tracking-tight">
              Kassa
            </h1>
            <p className="mt-2 text-muted-foreground">{product.nameSv}</p>

            <div className="mt-8">
              <h2 className="text-label mb-3 text-muted-foreground">
                Innan du köper
              </h2>
              <dl className="divide-y divide-border border-y border-border">
                {PRE_PURCHASE_DISCLOSURE.map((item) => (
                  <div key={item.heading} className="py-3">
                    <dt className="text-sm font-semibold">{item.heading}</dt>
                    <dd className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                      {item.body}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Right: summary + consent + pay (sticky on desktop). */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bezel rounded-lg border border-border bg-card p-6">
              <div className="flex items-baseline justify-between border-b border-border pb-4">
                <span className="text-sm text-muted-foreground">Totalt</span>
                <span className="font-readout text-2xl font-medium">
                  {priceLabel}
                </span>
              </div>
              <dl className="space-y-1.5 py-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">varav moms ({vat})</dt>
                  <dd>{formatOre(vatOre)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Tillgång</dt>
                  <dd>{product.accessMonths} månader</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Förnyelse</dt>
                  <dd>Ingen</dd>
                </div>
              </dl>

              <div className="border-t border-border pt-4">
                <CheckoutForm
                  productId={product.id}
                  priceLabel={priceLabel}
                  commerceEnabled={isCommerceConfigured}
                  isLoggedIn={isLoggedIn}
                  loginHref={`/logga-in?nasta=/kassa/${product.id}`}
                />
              </div>
            </div>

            <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
              <ShieldCheck aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
              Officiella provavgifter tillkommer och betalas separat till NFB.
            </p>
          </div>
        </div>

        <DisclaimerBlock className="mt-10">
          {BRAND.independenceDisclaimer}
        </DisclaimerBlock>
      </PageShell>
    </section>
  );
}
