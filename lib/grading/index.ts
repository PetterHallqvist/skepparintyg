import { z } from "zod";
import { compareLightSets, type LightDescriptor } from "@/lib/lights/schema";
import { gradeSoundProduce, type Blast } from "@/lib/audio/horn";
import { gradeWaypoint } from "@/lib/chart/waypoint";

/**
 * Server-authoritative grading (SPEC §58.2). Pure dispatch per item kind.
 * Clients may render provisional feedback, but this module decides.
 * Responses are untrusted input — Zod-validated per kind (§58.4).
 *
 * Phase 4 adds four trainer kinds — rules_scenario (§24), light_build (§25),
 * sound_produce (§25), waypoint_entry (§21.5) — using the same GradeResult
 * contract so SRS, felboken and readiness treat them like any other item.
 */

export type GradeResult = {
  correct: boolean;
  /** 0..1; binary for choice kinds, diagnostic partials live in `detail`. */
  score01: number;
  /** Learner-safe diagnostic detail (no canonical answers beyond feedback rules). */
  detail: Record<string, unknown>;
  /** Which answer keys (option keys etc.) were wrongly chosen — for felboken. */
  wrongKeys: string[];
};

const singleChoiceResponse = z.object({ selected: z.string().min(1) });
const multipleSelectResponse = z.object({
  selected: z.array(z.string()).min(0),
});
const numericResponse = z.object({ value: z.number().finite() });
const orderingResponse = z.object({ order: z.array(z.string()).min(1) });
const matchingResponse = z.object({ pairs: z.record(z.string(), z.string()) });

// Phase 4 trainer response shapes.
const rulesScenarioResponse = z.object({
  answers: z.record(z.string(), z.string()),
});
const lightBuildResponse = z.object({ selected: z.array(z.string()).min(0) });
const soundProduceResponse = z.object({
  taps: z.array(z.number().finite().min(0)).min(0),
});
const waypointResponse = z.object({ lat: z.string(), lon: z.string() });

export function parseResponse(kind: string, raw: unknown): unknown {
  switch (kind) {
    case "single_choice":
      return singleChoiceResponse.parse(raw);
    case "multiple_select":
      return multipleSelectResponse.parse(raw);
    case "numeric":
      return numericResponse.parse(raw);
    case "ordering":
      return orderingResponse.parse(raw);
    case "matching":
      return matchingResponse.parse(raw);
    case "rules_scenario":
      return rulesScenarioResponse.parse(raw);
    case "light_build":
      return lightBuildResponse.parse(raw);
    case "sound_produce":
      return soundProduceResponse.parse(raw);
    case "waypoint_entry":
      return waypointResponse.parse(raw);
    default:
      throw new Error(`unsupported_item_kind: ${kind}`);
  }
}

export function gradeResponse({
  kind,
  answerKey,
  response,
}: {
  kind: string;
  answerKey: Record<string, unknown>;
  response: unknown;
}): GradeResult {
  switch (kind) {
    case "single_choice": {
      const r = singleChoiceResponse.parse(response);
      const correctKey = String(answerKey.correct);
      const correct = r.selected === correctKey;
      return {
        correct,
        score01: correct ? 1 : 0,
        detail: { selected: r.selected },
        wrongKeys: correct ? [] : [r.selected],
      };
    }
    case "multiple_select": {
      const r = multipleSelectResponse.parse(response);
      const correctSet = new Set((answerKey.correct as string[]).map(String));
      const selectedSet = new Set(r.selected);
      const missing = [...correctSet].filter((k) => !selectedSet.has(k));
      const extra = [...selectedSet].filter((k) => !correctSet.has(k));
      const correct = missing.length === 0 && extra.length === 0;
      return {
        correct,
        score01: correct ? 1 : 0,
        detail: {
          correctSelected: [...selectedSet].filter((k) => correctSet.has(k))
            .length,
          totalCorrect: correctSet.size,
          extraSelected: extra.length,
        },
        wrongKeys: extra,
      };
    }
    case "numeric": {
      const r = numericResponse.parse(response);
      const target = Number(answerKey.value);
      const tolerance = Number(answerKey.tolerance ?? 0);
      const delta = Math.abs(r.value - target);
      const correct = delta <= tolerance + 1e-9;
      return {
        correct,
        score01: correct ? 1 : 0,
        detail: { delta: Number(delta.toFixed(6)), tolerance },
        wrongKeys: [],
      };
    }
    case "ordering": {
      const r = orderingResponse.parse(response);
      const target = (answerKey.order as string[]).map(String);
      const correct =
        r.order.length === target.length &&
        r.order.every((k, i) => k === target[i]);
      const correctPositions = r.order.filter((k, i) => k === target[i]).length;
      return {
        correct,
        score01: correct ? 1 : 0,
        detail: { correctPositions, total: target.length },
        wrongKeys: [],
      };
    }
    case "matching": {
      const r = matchingResponse.parse(response);
      const target = answerKey.pairs as Record<string, string>;
      const keys = Object.keys(target);
      const correctPairs = keys.filter((k) => r.pairs[k] === target[k]);
      const correct = correctPairs.length === keys.length;
      return {
        correct,
        score01: correct ? 1 : 0,
        detail: { correctPairs: correctPairs.length, total: keys.length },
        wrongKeys: keys.filter((k) => r.pairs[k] !== target[k]),
      };
    }
    case "rules_scenario": {
      // §24.3 — grade each stage separately so a lucky final action can't
      // mask a conceptual error. Stages are defined by the answer key.
      const r = rulesScenarioResponse.parse(response);
      const stages = answerKey.stages as Record<string, string>;
      const weights = (answerKey.weights ?? {}) as Record<string, number>;
      const stageKeys = Object.keys(stages);
      const stageResults: Record<string, boolean> = {};
      let weightSum = 0;
      let scoreSum = 0;
      const wrongStages: string[] = [];
      for (const stage of stageKeys) {
        const ok = r.answers[stage] === stages[stage];
        stageResults[stage] = ok;
        const w = weights[stage] ?? 1;
        weightSum += w;
        if (ok) scoreSum += w;
        else wrongStages.push(stage);
      }
      const correct = wrongStages.length === 0;
      return {
        correct,
        score01: weightSum > 0 ? scoreSum / weightSum : 0,
        detail: {
          stageResults,
          correctStages: stageKeys.length - wrongStages.length,
          totalStages: stageKeys.length,
          firstWrongStage: wrongStages[0] ?? null,
        },
        // Failed stage names feed felboken (misconception per stage).
        wrongKeys: wrongStages,
      };
    }
    case "light_build": {
      // §25.3 — compare the built arrangement to the target by role + colour.
      const r = lightBuildResponse.parse(response);
      const palette = answerKey.palette as Record<string, LightDescriptor>;
      const correctKeys = (answerKey.correct as string[]).map(String);
      const toDescriptors = (keys: string[]): LightDescriptor[] =>
        keys.map((k) => palette[k]).filter(Boolean);
      const cmp = compareLightSets(
        toDescriptors(correctKeys),
        toDescriptors(r.selected),
      );
      const correctSet = new Set(correctKeys);
      return {
        correct: cmp.correct,
        score01: cmp.correct ? 1 : 0,
        detail: {
          missingRoles: cmp.missing.map((d) => d.role),
          extraRoles: cmp.extra.map((d) => d.role),
          wrongColor: cmp.wrongColor,
        },
        wrongKeys: r.selected.filter((k) => !correctSet.has(k)),
      };
    }
    case "sound_produce": {
      // §25.1 — reproduce a signal; classify held durations into blasts.
      const r = soundProduceResponse.parse(response);
      const expected = (answerKey.pattern as Blast[]).map((b) => b);
      const g = gradeSoundProduce(expected, r.taps);
      return {
        correct: g.correct,
        score01: g.correct ? 1 : 0,
        detail: {
          expected: g.expected,
          produced: g.produced,
          firstMismatch: g.firstMismatch,
          ambiguousCount: g.ambiguousCount,
        },
        wrongKeys: [],
      };
    }
    case "waypoint_entry": {
      // §21.5 #33 — coordinate entry with digit-transposition diagnosis.
      const r = waypointResponse.parse(response);
      const g = gradeWaypoint(
        { lat: String(answerKey.lat), lon: String(answerKey.lon) },
        { lat: r.lat, lon: r.lon },
      );
      return {
        correct: g.correct,
        score01: g.correct ? 1 : 0,
        detail: {
          latOk: g.latOk,
          lonOk: g.lonOk,
          transposedLat: g.transposedLat,
          transposedLon: g.transposedLon,
          malformed: g.malformed,
        },
        wrongKeys: [],
      };
    }
    default:
      throw new Error(`unsupported_item_kind: ${kind}`);
  }
}

// Re-export the blast type used by the sound_produce answer key.
export type { Blast } from "@/lib/audio/horn";
