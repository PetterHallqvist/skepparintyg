import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/design-system/page-shell";
import { ReceiptView } from "@/components/commerce/receipt-view";
import { OrderStatusPoller } from "@/components/commerce/order-status-poller";
import { getOrderReceipt } from "@/lib/commerce/actions";

export const metadata: Metadata = {
  title: "Tack för ditt köp",
  robots: { index: false, follow: false },
};

export default async function CheckoutDonePage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  const orderId = order ?? null;

  const initial = orderId ? await getOrderReceipt(orderId) : null;

  return (
    <section>
      <PageShell width="narrow" className="py-16 sm:py-20">
        {!orderId || initial?.status === "not_found" ? (
          <div className="bezel rounded-lg border border-border bg-card p-8 text-center">
            <h1 className="font-serif text-2xl font-medium">Tack!</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Vi kunde inte hitta någon order att visa här. Är du inloggad hittar
              du dina köp och kvitton under ditt konto.
            </p>
            <Button className="mt-6" render={<Link href="/app/konto" />}>
              Till mitt konto
            </Button>
          </div>
        ) : initial?.status === "paid" ? (
          <ReceiptView receipt={initial} />
        ) : (
          // Pending: poll until the webhook provisions (orderId is present here).
          <OrderStatusPoller orderId={orderId} />
        )}
      </PageShell>
    </section>
  );
}
