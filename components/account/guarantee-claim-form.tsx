"use client";

import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitGuaranteeClaim } from "@/lib/account/actions";
import type { GuaranteeEvaluation } from "@/lib/commerce/guarantee";

const CONDITION_SV: Record<string, string> = {
  plan_not_completed: "Hela studieplanen är inte genomförd.",
  readiness_not_reached: "Godkänd beredskap är inte uppnådd.",
  exam_passed: "Provet är redan godkänt.",
  entitlement_inactive_on_exam_date: "Köpet var inte aktivt på provdatumet.",
};

export function GuaranteeClaimForm({ enabled }: { enabled: boolean }) {
  const [examDate, setExamDate] = useState("");
  const [passed, setPassed] = useState(false);
  const [result, setResult] = useState<GuaranteeEvaluation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    start(async () => {
      const r = await submitGuaranteeClaim({ examDate, examPassed: passed });
      if (r.ok) setResult(r.evaluation);
      else setError(r.message);
    });
  }

  if (result) {
    return (
      <div className="rounded-md border border-success/40 bg-success/10 p-4">
        <p className="flex items-center gap-2 font-medium">
          <CheckCircle2 aria-hidden="true" className="size-5 text-success" />
          Ditt anspråk är inskickat
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          En person granskar alltid anspråket manuellt — inget beslut fattas
          automatiskt. Vi hör av oss.
        </p>
        {result.failedConditions.length > 0 && (
          <div className="mt-3 text-sm">
            <p className="text-muted-foreground">
              Automatisk förhandsbedömning noterade:
            </p>
            <ul className="mt-1 list-inside list-disc text-muted-foreground">
              {result.failedConditions.map((c) => (
                <li key={c}>{CONDITION_SV[c] ?? c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="exam-date">Provdatum</Label>
        <Input
          id="exam-date"
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          className="max-w-48"
          required
        />
      </div>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Provresultat</legend>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="passed"
            checked={!passed}
            onChange={() => setPassed(false)}
          />
          Jag blev inte godkänd
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="passed"
            checked={passed}
            onChange={() => setPassed(true)}
          />
          Jag blev godkänd
        </label>
      </fieldset>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" disabled={!enabled || pending || examDate === ""}>
        {pending ? "Skickar …" : "Skicka anspråk"}
      </Button>
      {!enabled && (
        <p className="text-sm text-muted-foreground">
          Studiegarantin gäller aktiva konton med ett köp.
        </p>
      )}
    </form>
  );
}
