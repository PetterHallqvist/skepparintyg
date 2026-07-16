"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteMyAccount } from "@/lib/account/actions";

const PHRASE = "RADERA MITT KONTO";

/**
 * Irreversible-action control (SPEC §71.4). The delete button stays disabled
 * until the user types the exact confirmation phrase — deletion never fires on
 * a stray click.
 */
export function DeleteAccountForm({ enabled }: { enabled: boolean }) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    start(async () => {
      const r = await deleteMyAccount({
        confirmation: PHRASE as "RADERA MITT KONTO",
      });
      if (r.ok) {
        window.location.href = "/";
      } else {
        setError(r.message);
      }
    });
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="delete-confirm">
          Skriv <span className="font-readout">{PHRASE}</span> för att bekräfta
        </Label>
        <Input
          id="delete-confirm"
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoComplete="off"
          placeholder={PHRASE}
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button
        type="submit"
        variant="destructive"
        disabled={!enabled || text !== PHRASE || pending}
      >
        {pending ? "Raderar …" : "Radera mitt konto"}
      </Button>
    </form>
  );
}
