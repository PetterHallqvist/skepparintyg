"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Knot step-frame viewer (SPEC §26). Numbered original placeholder frames with
 * a scrubber and a per-step text transcript. Real photography/illustration is
 * an operator task (docs/HUMAN_VERIFY.md); these schematic two-strand frames
 * stand in. A screen interaction can't prove physical competence, so knot
 * status is capped at "teoretiskt förberedd" (§26.2) — surfaced here and in
 * the readiness dashboard.
 */

export type KnotSpec = {
  name_sv: string;
  steps: { caption_sv: string }[];
};

// Two strands whose control points shift per step to suggest interlocking.
// Placeholder art — the captions carry the actual instruction.
const STRAND_A = [
  "M40 70 C80 70 120 70 160 70",
  "M40 70 C80 70 120 40 160 90",
  "M40 70 C80 40 120 100 160 60",
  "M40 72 C80 30 120 110 160 68",
];
const STRAND_B = [
  "M40 100 C80 100 120 100 160 100",
  "M40 100 C80 100 120 130 160 80",
  "M40 100 C80 130 120 70 160 110",
  "M40 98 C80 140 120 60 160 102",
];

function KnotFrame({ step }: { step: number }) {
  const i = Math.min(step, STRAND_A.length - 1);
  return (
    <svg viewBox="0 0 200 150" role="img" aria-label={`Knopsteg ${step + 1}`} className="h-auto w-full max-w-xs">
      <path d={STRAND_B[i]} fill="none" stroke="#c9a24b" strokeWidth={7} strokeLinecap="round" />
      <path d={STRAND_A[i]} fill="none" stroke="#6ea8dc" strokeWidth={7} strokeLinecap="round" />
    </svg>
  );
}

export function KnotViewer({ spec }: { spec: KnotSpec }) {
  const [step, setStep] = useState(0);
  const total = spec.steps.length;

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-label text-muted-foreground">{spec.name_sv}</p>
        <span className="rounded-full border border-warning/40 px-2 py-0.5 text-[11px] text-warning">
          teoretiskt förberedd
        </span>
      </div>

      <div className="flex justify-center rounded-md border border-border bg-navy-950/30 py-3">
        <KnotFrame step={step} />
      </div>

      <p className="min-h-10 text-sm">
        <span className="font-readout mr-2 text-muted-foreground">
          {step + 1}/{total}
        </span>
        {spec.steps[step].caption_sv}
      </p>

      <div className="flex items-center gap-3">
        <label htmlFor="knot-step" className="text-label text-muted-foreground">
          Steg
        </label>
        <input
          id="knot-step"
          type="range"
          min={0}
          max={total - 1}
          step={1}
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
          className="h-1.5 flex-1 accent-primary"
          aria-label="Bläddra mellan knopstegen"
        />
      </div>

      <div className="flex flex-wrap gap-1">
        {spec.steps.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setStep(i)}
            aria-label={`Gå till steg ${i + 1}`}
            aria-current={i === step ? "step" : undefined}
            className={cn(
              "font-readout size-7 rounded-md border text-xs",
              i === step ? "border-primary bg-accent text-accent-foreground" : "border-border text-muted-foreground",
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <details className="text-sm">
        <summary className="cursor-pointer text-muted-foreground">
          Alla steg som text
        </summary>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted-foreground">
          {spec.steps.map((s, i) => (
            <li key={i}>{s.caption_sv}</li>
          ))}
        </ol>
      </details>
    </div>
  );
}
