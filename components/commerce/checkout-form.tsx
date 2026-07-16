"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { createCheckoutSession } from "@/lib/commerce/actions";
import { WITHDRAWAL_CONSENT_LABEL } from "@/lib/commerce/legal-copy";
import { useAnalytics } from "@/components/consent/consent-provider";

/**
 * Checkout form (SPEC §69.2). The withdrawal-right consent is an explicit,
 * unchecked-by-default control; the pay button stays disabled until the buyer
 * actively checks it. In the preview shell (`commerceEnabled === false`) or when
 * signed out, the pay path is replaced rather than half-enabled.
 */
export function CheckoutForm({
  productId,
  priceLabel,
  commerceEnabled,
  isLoggedIn,
  loginHref,
}: {
  productId: string;
  priceLabel: string;
  commerceEnabled: boolean;
  isLoggedIn: boolean;
  loginHref: string;
}) {
  const [consented, setConsented] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const { track } = useAnalytics();

  function submit() {
    setError(null);
    track({ name: "checkout_started", productId });
    startTransition(async () => {
      const result = await createCheckoutSession({
        productId,
        withdrawalConsent: consented,
      });
      if (result.ok) {
        window.location.href = result.url;
      } else {
        setError(result.message);
      }
    });
  }

  return (
    <div className="space-y-5">
      <label className="group/field flex cursor-pointer gap-3 rounded-md border border-border bg-paper-sunken/50 p-4">
        <Checkbox
          checked={consented}
          onCheckedChange={(value) => setConsented(value === true)}
          disabled={!commerceEnabled || pending}
          aria-describedby="withdrawal-consent-text"
          className="mt-0.5"
        />
        <span
          id="withdrawal-consent-text"
          className="text-sm leading-relaxed text-foreground"
        >
          {WITHDRAWAL_CONSENT_LABEL}
        </span>
      </label>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      {!commerceEnabled ? (
        <Button size="lg" className="w-full" disabled>
          <Lock aria-hidden="true" />
          Betalning ej aktiverad i förhandsvisning
        </Button>
      ) : !isLoggedIn ? (
        <Button size="lg" className="w-full" render={<Link href={loginHref} />}>
          Logga in för att fortsätta
        </Button>
      ) : (
        <Button
          size="lg"
          className="w-full"
          disabled={!consented || pending}
          onClick={submit}
        >
          {pending ? (
            <Loader2 aria-hidden="true" className="animate-spin" />
          ) : (
            <Lock aria-hidden="true" />
          )}
          Betala {priceLabel}
        </Button>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Du skickas till Stripes säkra betalsida. Vi lagrar aldrig dina
        kortuppgifter.
      </p>
    </div>
  );
}
