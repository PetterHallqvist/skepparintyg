"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createLearnerAction } from "@/lib/guardian/actions";

type AgeBand = "under_13" | "13_15" | "16_17" | "18_plus";

const AGE_BANDS: { value: AgeBand; label: string }[] = [
  { value: "under_13", label: "Under 13 år" },
  { value: "13_15", label: "13–15 år" },
  { value: "16_17", label: "16–17 år" },
  { value: "18_plus", label: "18 år eller äldre" },
];

/** Create a minor learner. Only a display name + age band are collected (§70.2). */
export function CreateLearnerForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [ageBand, setAgeBand] = useState<AgeBand>("13_15");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    start(async () => {
      const r = await createLearnerAction({
        displayName: name,
        ageBand,
        isSelf: false,
      });
      if (r.ok) {
        setName("");
        router.refresh();
      } else {
        setError(r.message);
      }
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="learner-name">Visningsnamn</Label>
        <Input
          id="learner-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          required
          placeholder="T.ex. förnamn eller smeknamn"
        />
        <p className="text-xs text-muted-foreground">
          Använd inte fullständigt namn eller personnummer.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="learner-age">Åldersspann</Label>
        <select
          id="learner-age"
          value={ageBand}
          onChange={(e) => setAgeBand(e.target.value as AgeBand)}
          className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {AGE_BANDS.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" disabled={pending || name.trim().length === 0}>
        {pending ? "Skapar …" : "Lägg till elevprofil"}
      </Button>
    </form>
  );
}
