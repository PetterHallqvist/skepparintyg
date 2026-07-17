"use client";

import { useState, useTransition } from "react";
import { Loader2, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DisclaimerBlock } from "@/components/design-system/disclaimer-block";
import { StatusChip } from "@/components/design-system/status-chip";
import { ExamRunner } from "@/components/exam/exam-runner";
import { startDemoExam, type ExamState } from "@/lib/exam/actions";

/**
 * Simulation entry point. Resumes an in-progress session (passed from the
 * server) or shows the certification-specific intro. "Starta simuleringen"
 * starts a fresh session for the active certification (decided server-side).
 */
export function ExamClient({
  resumed,
  intro,
}: {
  resumed: ExamState | null;
  intro: { titleSv: string; minutes: number; preview: boolean };
}) {
  const [state, setState] = useState<ExamState | null>(resumed);
  const [starting, start] = useTransition();

  function begin() {
    start(async () => setState(await startDemoExam()));
  }

  if (!state) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-3xl font-medium tracking-tight">
            {intro.titleSv}
          </h1>
          {intro.preview ? (
            <StatusChip tone="warning">Förhandsversion</StatusChip>
          ) : null}
        </div>
        <p className="mt-3 text-muted-foreground">
          Öva under provlika förhållanden: tid, blandade uppgifter och rättning
          först när du lämnar in.
        </p>
        <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <Timer aria-hidden="true" className="size-4" /> Cirka {intro.minutes}{" "}
            minuter (demo)
          </li>
          <li>· Du får ingen återkoppling förrän du lämnar in.</li>
          <li>· Godkäntgränsen är 75 % av de rättade frågorna.</li>
          <li>· Diagnosdelen redovisas separat och räknas inte mot gränsen.</li>
        </ul>

        <DisclaimerBlock className="mt-6">
          Detta är en träningssimulering och följer inte det officiella provets
          exakta format. Resultatet är vägledande, inte ett provresultat.
        </DisclaimerBlock>

        <Button size="lg" className="mt-8" disabled={starting} onClick={begin}>
          {starting ? (
            <Loader2 aria-hidden="true" className="animate-spin" />
          ) : null}
          Starta simuleringen
        </Button>
      </div>
    );
  }

  return (
    <ExamRunner key={state.startedAt} initial={state} onExit={begin} />
  );
}
