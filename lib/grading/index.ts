import { z } from "zod";

/**
 * Server-authoritative grading (SPEC §58.2). Pure dispatch per item kind.
 * Clients may render provisional feedback, but this module decides.
 * Responses are untrusted input — Zod-validated per kind (§58.4).
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
    default:
      throw new Error(`unsupported_item_kind: ${kind}`);
  }
}
