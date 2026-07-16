"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { captureLead } from "@/lib/marketing/leads";

/**
 * Email capture with a SEPARATE, unticked marketing-consent checkbox (SPEC
 * §9.3). Works with no email; used for both waitlist and "save my result".
 */
export function LeadCaptureForm({
  source,
  ctaLabel = "Spara",
  intro,
  diagnosticResult,
}: {
  source: string;
  ctaLabel?: string;
  intro?: string;
  diagnosticResult?: Record<string, unknown>;
}) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [done, setDone] = useState(false);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      await captureLead({
        email,
        source,
        marketingConsent: consent,
        diagnosticResult,
      });
      setDone(true);
    });
  }

  if (done) {
    return (
      <p className="flex items-center gap-2 text-sm text-success">
        <Check aria-hidden="true" className="size-4" />
        Tack! Vi hör av oss.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      {intro && <p className="text-sm text-muted-foreground">{intro}</p>}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1 space-y-1">
          <Label htmlFor={`lead-${source}`} className="sr-only">
            E-post
          </Label>
          <Input
            id={`lead-${source}`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="din@epost.se"
            required
          />
        </div>
        <Button type="submit" disabled={pending || email.length === 0}>
          {pending ? "Skickar …" : ctaLabel}
        </Button>
      </div>
      <label className="flex cursor-pointer items-start gap-2.5 text-sm text-muted-foreground">
        <Checkbox
          checked={consent}
          onCheckedChange={(v) => setConsent(v === true)}
          className="mt-0.5"
        />
        <span>
          Ja, skicka mig tips och nyheter via e-post. (Frivilligt — du kan när
          som helst avregistrera dig.)
        </span>
      </label>
    </form>
  );
}
