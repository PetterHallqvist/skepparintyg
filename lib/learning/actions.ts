"use server";

import { z } from "zod";
import { gradeResponse } from "@/lib/grading";
import {
  DEMO_ITEMS,
  sanitizeDemoItem,
  type DemoChallenge,
} from "@/lib/learning/demo";
import { logger } from "@/lib/observability/logger";

/**
 * Learning-loop server actions (SPEC §60.1). Phase 2 ships the demo path
 * (no database) with the same contract as the DB path: the client NEVER
 * receives an answer key before grading (§58.3), and grading is always
 * server-side (§58.2). The DB-backed path lands when the Supabase
 * environment is configured (apply_attempt RPC + get_challenge are already
 * migrated and tested).
 */

export type AttemptFeedback = {
  correct: boolean;
  /** §13.3 progressive disclosure: one-line diagnosis first. */
  oneLiner: string;
  /** Correct method, step list where applicable. */
  method: string | null;
  explanation: string;
  sourceRef: string;
  misconception: string | null;
  detail: Record<string, unknown>;
};

const submitSchema = z.object({
  index: z.number().int().min(0),
  response: z.unknown(),
  confidence: z.enum(["guessed", "fairly_sure", "very_sure"]).nullable(),
  hintLevel: z.number().int().min(0).max(4),
  activeLatencyMs: z.number().int().min(0).nullable(),
});

export async function getDemoChallenge(index: number): Promise<DemoChallenge> {
  const item = DEMO_ITEMS[index];
  if (!item) throw new Error("demo_slut");
  return sanitizeDemoItem(item);
}

export async function submitDemoAttempt(
  input: z.input<typeof submitSchema>,
): Promise<AttemptFeedback> {
  const parsed = submitSchema.parse(input);
  const item = DEMO_ITEMS[parsed.index];
  if (!item) throw new Error("demo_slut");

  const grade = gradeResponse({
    kind: item.kind,
    answerKey: item.answerKey,
    response: parsed.response,
  });

  // §13.6-style misconception lookup for choice kinds.
  let misconception: string | null = null;
  if (!grade.correct && item.misconceptionByKey) {
    for (const key of grade.wrongKeys) {
      if (item.misconceptionByKey[key]) {
        misconception = item.misconceptionByKey[key];
        break;
      }
    }
  }

  logger.info("demo.attempt", {
    index: parsed.index,
    kind: item.kind,
    correct: grade.correct,
    hintLevel: parsed.hintLevel,
  });

  return {
    correct: grade.correct,
    oneLiner: grade.correct
      ? "Rätt."
      : diagnosisOneLiner(item.kind, grade.detail),
    method: item.method ?? null,
    explanation: item.explanation,
    sourceRef: item.sourceRef,
    misconception,
    detail: grade.detail,
  };
}

/** §13.3: exact one-sentence diagnosis, never a wall of text. */
function diagnosisOneLiner(
  kind: string,
  detail: Record<string, unknown>,
): string {
  switch (kind) {
    case "numeric": {
      const delta = detail.delta as number | undefined;
      return delta !== undefined
        ? `Fel — ditt svar avviker med ${String(delta).replace(".", ",")} från rätt värde.`
        : "Fel svar.";
    }
    case "multiple_select": {
      const extra = (detail.extraSelected as number) ?? 0;
      const hit = (detail.correctSelected as number) ?? 0;
      const total = (detail.totalCorrect as number) ?? 0;
      if (extra > 0) return "Fel — minst ett valt alternativ hör inte hit.";
      return `Fel — du hittade ${hit} av ${total} korrekta alternativ.`;
    }
    case "ordering": {
      const ok = (detail.correctPositions as number) ?? 0;
      const total = (detail.total as number) ?? 0;
      return `Fel ordning — ${ok} av ${total} steg står på rätt plats.`;
    }
    case "matching": {
      const ok = (detail.correctPairs as number) ?? 0;
      const total = (detail.total as number) ?? 0;
      return `Fel — ${ok} av ${total} par är rätt ihopparade.`;
    }
    default:
      return "Fel svar.";
  }
}

/** §13.5 tiered hints; tier ≥2 disqualifies independent mastery (recorded client-side and in evidence). */
export async function getDemoHint(
  index: number,
  tier: number,
): Promise<{ tier: number; text: string }> {
  const item = DEMO_ITEMS[index];
  if (!item) throw new Error("demo_slut");
  if (tier <= 1) {
    return {
      tier: 1,
      text: `Ledtråd: tänk på området ”${item.objectiveTitle}”.`,
    };
  }
  if (tier === 2 && item.method) {
    return { tier: 2, text: `Nästa steg: ${item.method.split("\n")[0]}` };
  }
  return {
    tier: Math.min(tier, 3),
    text: "Ledtråd: gå tillbaka till lektionen och jämför alternativen noggrant.",
  };
}
