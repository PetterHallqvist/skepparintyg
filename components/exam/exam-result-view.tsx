"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/design-system/status-chip";
import { DisclaimerBlock } from "@/components/design-system/disclaimer-block";
import { formatScore } from "@/lib/exam/scoring";
import type { ExamSubmitResult } from "@/lib/exam/actions";

/**
 * Simulation result (SPEC §35.7). Pass/fail is over the graded sections only;
 * diagnostic sections are shown separately and never affect the verdict. The
 * "Träningssimulering" framing is explicit — this is not the official format.
 */
export function ExamResultView({
  data,
  onRetry,
}: {
  data: ExamSubmitResult;
  onRetry: () => void;
}) {
  const { result, expired, wrongItems } = data;
  const graded = result.sectionScores.filter((s) => !s.isDiagnostic);
  const diagnostic = result.sectionScores.filter((s) => s.isDiagnostic);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="rounded-lg border border-border bg-card p-6 text-center sm:p-8">
        {result.passed ? (
          <CheckCircle2 aria-hidden="true" className="mx-auto size-8 text-success" />
        ) : (
          <XCircle aria-hidden="true" className="mx-auto size-8 text-muted-foreground" />
        )}
        <p className="mt-4 font-readout text-5xl font-medium tracking-tight">
          {formatScore(result.scoreBp)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {result.totalCorrect} av {result.totalGraded} rätt · gräns{" "}
          {formatScore(result.passThresholdBp)}
        </p>
        <div className="mt-4">
          {result.passed ? (
            <StatusChip tone="success">Över gränsen</StatusChip>
          ) : (
            <StatusChip tone="warning">Under gränsen</StatusChip>
          )}
        </div>
        {expired && (
          <p className="mt-3 text-xs text-muted-foreground">
            Tiden tog slut — provet rättades med de svar du hunnit lämna.
          </p>
        )}
      </div>

      <DisclaimerBlock className="mt-4">
        Detta är en träningssimulering och följer inte det officiella provets
        exakta format. Resultatet är vägledande, inte ett provresultat.
      </DisclaimerBlock>

      <section className="mt-8">
        <h2 className="text-label text-muted-foreground">Resultat per del</h2>
        <ul className="mt-3 divide-y divide-border border-y border-border">
          {graded.map((s) => (
            <li key={s.sectionId} className="flex justify-between py-2.5 text-sm">
              <span>{s.title}</span>
              <span className="font-readout">
                {s.correct}/{s.total}
              </span>
            </li>
          ))}
        </ul>
        {diagnostic.length > 0 && (
          <>
            <h3 className="mt-4 text-label text-muted-foreground">
              Diagnos (räknas ej mot gränsen)
            </h3>
            <ul className="mt-2 divide-y divide-border border-y border-border">
              {diagnostic.map((s) => (
                <li
                  key={s.sectionId}
                  className="flex justify-between py-2.5 text-sm text-muted-foreground"
                >
                  <span>{s.title}</span>
                  <span className="font-readout">
                    {s.correct}/{s.total}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {wrongItems.length > 0 && (
        <section className="mt-8">
          <h2 className="text-label text-muted-foreground">Att repetera</h2>
          <ul className="mt-3 space-y-3">
            {wrongItems.map((w, i) => (
              <li key={i} className="rounded-md border border-border bg-card p-4">
                <p className="text-sm font-medium">{w.objectiveTitle}</p>
                <p className="mt-1 text-sm text-muted-foreground">{w.stemSv}</p>
                <p className="mt-2 text-sm">{w.explanation}</p>
                <p className="mt-1 text-xs text-muted-foreground">{w.sourceRef}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-8 flex justify-center">
        <Button onClick={onRetry}>Gör en ny simulering</Button>
      </div>
    </div>
  );
}
