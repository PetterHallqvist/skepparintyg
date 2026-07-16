"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ResponseWidgetProps } from "./types";

/**
 * rules_scenario response widget (SPEC §24.3). The learner answers each stage
 * — classification → rule → action (and perception where present) — one at a
 * time; a later stage unlocks only once the earlier one is answered, so the
 * chain of reasoning is recorded and a lucky action can't be back-filled. The
 * server grades every stage separately.
 */

type Stage = {
  key: string;
  prompt_sv: string;
  options: { key: string; text_sv: string }[];
};

export function RulesScenario({ interaction, disabled, onChange }: ResponseWidgetProps) {
  const stages = (interaction.stages as Stage[]) ?? [];
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const select = (stageKey: string, optionKey: string) => {
    const next = { ...answers, [stageKey]: optionKey };
    setAnswers(next);
    const complete = stages.every((s) => next[s.key]);
    onChange(complete ? { answers: next } : null);
  };

  return (
    <ol className="space-y-4">
      {stages.map((stage, i) => {
        const unlocked = i === 0 || answers[stages[i - 1].key] !== undefined;
        return (
          <li
            key={stage.key}
            className={cn(
              "rounded-lg border p-4 transition-opacity",
              unlocked ? "border-border bg-card/60" : "border-dashed border-border opacity-45",
            )}
          >
            <p className="mb-2 flex items-center gap-2 text-sm font-medium">
              <span className="font-readout flex size-5 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
                {i + 1}
              </span>
              {stage.prompt_sv}
            </p>
            {unlocked ? (
              <div role="radiogroup" aria-label={stage.prompt_sv} className="grid gap-2">
                {stage.options.map((o) => (
                  <button
                    key={o.key}
                    type="button"
                    role="radio"
                    aria-checked={answers[stage.key] === o.key}
                    disabled={disabled}
                    onClick={() => select(stage.key, o.key)}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-md border px-4 py-2 text-left text-sm transition-colors",
                      answers[stage.key] === o.key
                        ? "border-primary bg-accent text-accent-foreground"
                        : "border-border bg-card hover:border-muted-foreground/40",
                      disabled && "opacity-70",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-full border",
                        answers[stage.key] === o.key ? "border-primary" : "border-muted-foreground/50",
                      )}
                    >
                      {answers[stage.key] === o.key ? (
                        <span className="size-2 rounded-full bg-primary" />
                      ) : null}
                    </span>
                    {o.text_sv}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Svara på föregående steg först.
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
