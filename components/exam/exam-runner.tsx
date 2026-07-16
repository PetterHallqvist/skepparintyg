"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Flag, Loader2, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/design-system/status-chip";
import { ItemRenderer, StimulusView } from "@/components/learning/item-renderers";
import type { ItemResponse } from "@/components/learning/renderers/types";
import { remainingMs, formatRemaining } from "@/lib/exam/timer";
import {
  submitDemoExam,
  type ExamState,
  type ExamSubmitResult,
} from "@/lib/exam/actions";
import { ExamResultView } from "@/components/exam/exam-result-view";
import { cn } from "@/lib/utils";

/**
 * Simulation runner (SPEC §35). All questions on one scrollable page so each
 * uncontrolled response widget keeps its state across scrolling (no data loss on
 * navigation). No feedback is shown until submit. The timer is derived from the
 * server-set start time; at expiry the runner auto-submits. Submitting is final.
 */
export function ExamRunner({
  initial,
  onExit,
}: {
  initial: ExamState;
  onExit: () => void;
}) {
  const [answers, setAnswers] = useState<Record<string, ItemResponse | null>>({});
  const [flags, setFlags] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<ExamSubmitResult | null>(null);
  const [submitting, startSubmit] = useTransition();
  const submittedRef = useRef(false);

  // Server-derived "now" for the first paint (matches SSR → no hydration drift),
  // then the interval switches to the real client clock.
  const serverNow =
    Date.parse(initial.startedAt) +
    initial.durationSeconds * 1000 -
    initial.remainingMs;
  const [now, setNow] = useState<number>(serverNow);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = remainingMs(
    initial.startedAt,
    initial.durationSeconds,
    new Date(now),
  );

  const submit = useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    startSubmit(async () => {
      const r = await submitDemoExam(answers);
      if (!("error" in r)) setResult(r);
    });
  }, [answers]);

  // Auto-submit when the clock runs out.
  useEffect(() => {
    if (remaining <= 0 && !submittedRef.current && !result) submit();
  }, [remaining, result, submit]);

  if (result) return <ExamResultView data={result} onRetry={onExit} />;

  const answeredCount = Object.values(answers).filter((a) => a !== null).length;
  const low = remaining <= 60_000;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      {/* Sticky header: title, timer, progress, submit. */}
      <header className="sticky top-0 z-20 -mx-4 mb-6 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              {initial.title}
            </h1>
            <p className="text-xs text-muted-foreground">
              {answeredCount} av {initial.challenges.length} besvarade
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex items-center gap-1.5 font-readout text-lg tabular-nums",
                low ? "text-destructive" : "text-foreground",
              )}
              aria-live="polite"
              aria-label="Återstående tid"
            >
              <Timer aria-hidden="true" className="size-4" />
              {formatRemaining(remaining)}
            </span>
            <Button size="sm" disabled={submitting} onClick={submit}>
              {submitting ? (
                <Loader2 aria-hidden="true" className="animate-spin" />
              ) : null}
              Lämna in
            </Button>
          </div>
        </div>
      </header>

      <p className="mb-6 text-sm text-muted-foreground">
        Träningssimulering — du får ingen återkoppling förrän du lämnar in.
      </p>

      <ol className="space-y-8">
        {initial.challenges.map((c) => (
          <li
            key={c.itemId}
            id={`q-${c.position + 1}`}
            className="rounded-lg border border-border bg-card p-5"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-label text-muted-foreground">
                Fråga {c.position + 1}
                {c.isDiagnostic && (
                  <StatusChip tone="neutral" className="ml-2">
                    Diagnos
                  </StatusChip>
                )}
              </span>
              <button
                type="button"
                onClick={() =>
                  setFlags((prev) => {
                    const next = new Set(prev);
                    if (next.has(c.itemId)) next.delete(c.itemId);
                    else next.add(c.itemId);
                    return next;
                  })
                }
                aria-pressed={flags.has(c.itemId)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors",
                  flags.has(c.itemId)
                    ? "border-warning bg-warning/10 text-warning"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                <Flag aria-hidden="true" className="size-3.5" />
                {flags.has(c.itemId) ? "Flaggad" : "Flagga"}
              </button>
            </div>

            <p className="font-medium">{c.stemSv}</p>
            <div className="mt-4">
              <StimulusView interaction={c.interaction} />
              <ItemRenderer
                kind={c.kind}
                interaction={c.interaction}
                disabled={submitting}
                onChange={(r) =>
                  setAnswers((prev) => ({ ...prev, [c.itemId]: r }))
                }
              />
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex justify-center">
        <Button size="lg" disabled={submitting} onClick={submit}>
          {submitting ? (
            <Loader2 aria-hidden="true" className="animate-spin" />
          ) : null}
          Lämna in simuleringen
        </Button>
      </div>
    </div>
  );
}
