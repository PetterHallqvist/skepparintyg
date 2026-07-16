"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setPinAction } from "@/lib/guardian/actions";

/**
 * Set/rotate the minor-access PIN (SPEC §43.5). The PIN never leaves the form as
 * plaintext beyond the server action, which slow-hashes it. 4–8 digits.
 */
export function PinForm({
  learnerId,
  hasPin,
}: {
  learnerId: string;
  hasPin: boolean;
}) {
  const [pin, setPin] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDone(false);
    start(async () => {
      const r = await setPinAction({ learnerId, pin });
      if (r.ok) {
        setPin("");
        setDone(true);
      } else {
        setError(r.message);
      }
    });
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor={`pin-${learnerId}`}>
          {hasPin ? "Byt elev-PIN" : "Sätt elev-PIN"}
        </Label>
        <Input
          id={`pin-${learnerId}`}
          inputMode="numeric"
          autoComplete="off"
          pattern="\d{4,8}"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 8))}
          placeholder="4–8 siffror"
          className="max-w-40 font-readout tracking-widest"
        />
        <p className="text-xs text-muted-foreground">
          Eleven använder PIN-koden för att öppna elevläget på en delad enhet.
        </p>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {done && (
        <p className="flex items-center gap-1.5 text-sm text-success">
          <Check aria-hidden="true" className="size-4" /> PIN sparad.
        </p>
      )}

      <Button type="submit" size="sm" disabled={pending || pin.length < 4}>
        {pending ? "Sparar …" : hasPin ? "Byt PIN" : "Sätt PIN"}
      </Button>
    </form>
  );
}
