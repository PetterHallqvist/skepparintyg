"use server";

import { z } from "zod";
import { gradeResponse } from "@/lib/grading";
import { sanitizeDemoItem, type DemoChallenge } from "@/lib/learning/demo";
import { getTrackItems } from "@/lib/learning/tracks";
import { logger } from "@/lib/observability/logger";

/**
 * Learning-loop server actions (SPEC §60.1). Ships the demo/track path
 * (no database) with the same contract as the DB path: the client NEVER
 * receives an answer key before grading (§58.3), and grading is always
 * server-side (§58.2). Phase 4 generalises the demo path into named practice
 * *tracks* so every trainer route reuses this one loop.
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
  track: z.string().default("demo"),
  index: z.number().int().min(0),
  response: z.unknown(),
  confidence: z.enum(["guessed", "fairly_sure", "very_sure"]).nullable(),
  hintLevel: z.number().int().min(0).max(4),
  activeLatencyMs: z.number().int().min(0).nullable(),
});

export async function getTrackChallenge(
  track: string,
  index: number,
): Promise<DemoChallenge> {
  const items = getTrackItems(track);
  const item = items[index];
  if (!item) throw new Error("track_slut");
  return sanitizeDemoItem(item, items.length);
}

export async function submitTrackAttempt(
  input: z.input<typeof submitSchema>,
): Promise<AttemptFeedback> {
  const parsed = submitSchema.parse(input);
  const items = getTrackItems(parsed.track);
  const item = items[parsed.index];
  if (!item) throw new Error("track_slut");

  const grade = gradeResponse({
    kind: item.kind,
    answerKey: item.answerKey,
    response: parsed.response,
  });

  // §13.6 misconception lookup: option-keyed (choice) or stage-keyed (rules).
  let misconception: string | null = null;
  if (!grade.correct) {
    if (item.misconceptionByKey) {
      for (const key of grade.wrongKeys) {
        if (item.misconceptionByKey[key]) {
          misconception = item.misconceptionByKey[key];
          break;
        }
      }
    }
    if (!misconception && item.stageMisconceptionBySt) {
      const stage = grade.detail.firstWrongStage as string | null;
      if (stage && item.stageMisconceptionBySt[stage]) {
        misconception = item.stageMisconceptionBySt[stage];
      }
    }
  }

  logger.info("track.attempt", {
    track: parsed.track,
    index: parsed.index,
    kind: item.kind,
    correct: grade.correct,
    hintLevel: parsed.hintLevel,
  });

  return {
    correct: grade.correct,
    oneLiner: grade.correct ? "Rätt." : diagnosisOneLiner(item.kind, grade.detail),
    method: item.method ?? null,
    explanation: item.explanation,
    sourceRef: item.sourceRef,
    misconception,
    detail: grade.detail,
  };
}

export async function getTrackHint(
  track: string,
  index: number,
  tier: number,
): Promise<{ tier: number; text: string }> {
  const item = getTrackItems(track)[index];
  if (!item) throw new Error("track_slut");
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

// --- backward-compatible demo wrappers -------------------------------------

export async function getDemoChallenge(index: number): Promise<DemoChallenge> {
  return getTrackChallenge("demo", index);
}

export async function submitDemoAttempt(
  input: Omit<z.input<typeof submitSchema>, "track">,
): Promise<AttemptFeedback> {
  return submitTrackAttempt({ ...input, track: "demo" });
}

export async function getDemoHint(
  index: number,
  tier: number,
): Promise<{ tier: number; text: string }> {
  return getTrackHint("demo", index, tier);
}

// --- diagnosis copy ---------------------------------------------------------

const STAGE_SV: Record<string, string> = {
  perception: "vad du ser/hör",
  classification: "typ av möte",
  rule: "vilken regel som gäller",
  action: "vilken åtgärd",
  explanation: "motiveringen",
};

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
    case "rules_scenario": {
      const ok = (detail.correctStages as number) ?? 0;
      const total = (detail.totalStages as number) ?? 0;
      const stage = detail.firstWrongStage as string | null;
      const label = stage ? (STAGE_SV[stage] ?? stage) : "";
      return `Fel — ${ok} av ${total} steg rätt${label ? ` (fel på ${label})` : ""}.`;
    }
    case "light_build": {
      const missing = (detail.missingRoles as string[] | undefined)?.length ?? 0;
      const extra = (detail.extraRoles as string[] | undefined)?.length ?? 0;
      const wrongColor =
        (detail.wrongColor as unknown[] | undefined)?.length ?? 0;
      if (wrongColor > 0) return "Fel — minst en lykta har fel färg.";
      if (missing > 0 && extra > 0)
        return `Fel — ${missing} lykta(or) saknas och ${extra} ska inte vara med.`;
      if (missing > 0) return `Fel — ${missing} lykta(or) saknas i ljusbilden.`;
      return `Fel — ${extra} lykta(or) ska inte vara med.`;
    }
    case "sound_produce": {
      const ambiguous = (detail.ambiguousCount as number) ?? 0;
      if (ambiguous > 0)
        return "Fel — någon stöt var varken tydligt kort eller lång.";
      const at = detail.firstMismatch as number | null;
      return at !== null
        ? `Fel — signalen avviker vid stöt ${at + 1}.`
        : "Fel — signalen stämmer inte.";
    }
    case "waypoint_entry": {
      if (detail.transposedLat || detail.transposedLon)
        return "Fel — det ser ut som att du kastat om siffror (transponering).";
      if (detail.malformed) return "Fel — koordinaten kunde inte tolkas.";
      return "Fel — fel position.";
    }
    default:
      return "Fel svar.";
  }
}
