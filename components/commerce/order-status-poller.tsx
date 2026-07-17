"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrderReceipt, type ReceiptView as RV } from "@/lib/commerce/actions";
import { ReceiptView } from "@/components/commerce/receipt-view";

/**
 * The success page is webhook-authoritative (SPEC §60.2): the browser redirect
 * grants nothing, so we poll the order until the signature-verified webhook has
 * marked it paid, then swap in the receipt. Gives up gracefully after ~40s with
 * a manual refresh — the entitlement still lands regardless of this page.
 */
export function OrderStatusPoller({ orderId }: { orderId: string }) {
  const [view, setView] = useState<RV>({ status: "pending" });
  const [gaveUp, setGaveUp] = useState(false);

  useEffect(() => {
    let active = true;
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout>;

    const tick = async () => {
      const next = await getOrderReceipt(orderId);
      if (!active) return;
      if (next.status === "paid") {
        setView(next);
        return;
      }
      attempts += 1;
      if (attempts >= 16) {
        setGaveUp(true);
        return;
      }
      timer = setTimeout(tick, 2500);
    };

    timer = setTimeout(tick, 1500);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [orderId]);

  if (view.status === "paid") return <ReceiptView receipt={view} />;

  return (
    <div className="bezel rounded-lg border border-border bg-card p-8 text-center">
      {!gaveUp ? (
        <>
          <Loader2
            aria-hidden="true"
            className="mx-auto size-7 animate-spin text-sea-700"
          />
          <h1 className="mt-4 font-serif text-xl font-medium">
            Vi bekräftar din betalning …
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Det tar oftast bara några sekunder. Din tillgång aktiveras så snart
            betalningen bekräftats.
          </p>
        </>
      ) : (
        <>
          <h1 className="font-serif text-xl font-medium">
            Det tar längre tid än vanligt
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Din betalning kan fortfarande gå igenom. Ladda om sidan om en stund,
            eller kontakta kundtjänst om det inte löser sig.
          </p>
          <Button
            className="mt-6"
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Ladda om
          </Button>
        </>
      )}
    </div>
  );
}
