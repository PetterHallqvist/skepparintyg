"use client";

import { useState, useTransition } from "react";
import { Loader2, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DisclaimerBlock } from "@/components/design-system/disclaimer-block";
import { ExamRunner } from "@/components/exam/exam-runner";
import { startDemoExam, type ExamState } from "@/lib/exam/actions";

/**
 * Simulation entry point. Resumes an in-progress session (passed from the
 * server) or shows the intro. "Gör en ny simulering" starts a fresh session.
 */
export function ExamClient({ resumed }: { resumed: ExamState | null }) {
  const [state, setState] = useState<ExamState | null>(resumed);
  const [starting, start] = useTransition();

  function begin() {
    start(async () => setState(await startDemoExam()));
  }

  if (!state) {
    const minutes = 20;
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="font-serif text-3xl font-medium tracking-tight">
          Träningssimulering
        </h1>
        <p className="mt-3 text-muted-foreground">
          Öva under provlika förhållanden: tid, blandade uppgifter och rättning
          först när du lämnar in.
        </p>
        <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <Timer aria-hidden="true" className="size-4" /> Cirka {minutes} minuter
            (demo)
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
