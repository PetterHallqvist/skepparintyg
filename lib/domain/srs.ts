import { createEmptyCard, fsrs, Rating, type Card, type Grade } from "ts-fsrs";

/**
 * Memory scheduling (SPEC §15). Wraps ts-fsrs so its types never leak into
 * the app (§56 table). The learner NEVER self-rates — ratings derive from
 * attempt evidence (§15.1).
 */

export type Confidence = "guessed" | "fairly_sure" | "very_sure";

export type LatencyBaseline = {
  medianMs: number;
  n: number;
};

/** §15.2 fallback order; null → latency must not affect the rating. */
export function resolveLatencyBaseline(candidates: {
  userItemKindDevice?: LatencyBaseline;
  userItemKind?: LatencyBaseline;
  cohortItemKindDifficulty?: LatencyBaseline;
}): LatencyBaseline | null {
  const MIN_OBS = 15;
  if (
    candidates.userItemKindDevice &&
    candidates.userItemKindDevice.n >= MIN_OBS
  ) {
    return candidates.userItemKindDevice;
  }
  if (candidates.userItemKind && candidates.userItemKind.n >= MIN_OBS) {
    return candidates.userItemKind;
  }
  if (candidates.cohortItemKindDifficulty) {
    return candidates.cohortItemKindDifficulty;
  }
  return null;
}

const SLOW_FACTOR = 2.5;
const FAST_FACTOR = 0.6;

export type AttemptEvidence = {
  correct: boolean;
  /** Answer was revealed (hint tier 4). */
  revealed: boolean;
  /** 0 = no hint, 1..4 = tiers per §13.5. */
  hintLevel: number;
  /** Learner submitted wrong, then changed to correct in the same attempt. */
  changedFromWrong: boolean;
  confidence: Confidence | null;
  activeLatencyMs: number | null;
  /** Resolved via resolveLatencyBaseline; null disables latency judgement. */
  latencyBaseline: LatencyBaseline | null;
  /** Prior successful recalls of this template, separated in time. */
  priorSuccessfulRecalls: number;
  /** Whether those recalls span at least two distinct days. */
  priorRecallsSpanDays: boolean;
  newlyIntroduced: boolean;
  safetyCritical: boolean;
  /** Completed FSRS reviews of this template so far. */
  reviewCount: number;
  unresolvedHighRiskMisconception: boolean;
  /** Session excluded from latency judgement (backgrounded/a11y, §15.2). */
  latencyExcluded: boolean;
};

/** SPEC §15.1 — deterministic evidence → FSRS rating. */
export function mapEvidenceToRating(e: AttemptEvidence): Grade {
  // Again
  if (!e.correct || e.revealed || e.hintLevel >= 2 || e.changedFromWrong) {
    return Rating.Again;
  }

  const latencyUsable =
    !e.latencyExcluded &&
    e.activeLatencyMs !== null &&
    e.latencyBaseline !== null;
  const verySlow =
    latencyUsable &&
    e.activeLatencyMs! > e.latencyBaseline!.medianMs * SLOW_FACTOR;
  const fast =
    latencyUsable &&
    e.activeLatencyMs! < e.latencyBaseline!.medianMs * FAST_FACTOR;

  // Hard
  if (
    e.hintLevel === 1 ||
    verySlow ||
    e.confidence === "guessed" ||
    e.unresolvedHighRiskMisconception
  ) {
    return Rating.Hard;
  }

  // Easy — every §15.1 condition must hold
  if (
    e.confidence === "very_sure" &&
    fast &&
    e.priorSuccessfulRecalls >= 2 &&
    e.priorRecallsSpanDays &&
    !e.newlyIntroduced &&
    !(e.safetyCritical && e.reviewCount < 3)
  ) {
    return Rating.Easy;
  }

  return Rating.Good;
}

// ---------------------------------------------------------------------------
// FSRS card wrapper — jsonb-serialisable
// ---------------------------------------------------------------------------

export type SerializedCard = Record<string, unknown>;

const engine = fsrs();

export function newCard(now: Date): SerializedCard {
  return serializeCard(createEmptyCard(now));
}

export function reviewCard(
  serialized: SerializedCard,
  now: Date,
  rating: Grade,
): { card: SerializedCard; dueAt: Date } {
  const card = deserializeCard(serialized);
  const { card: next } = engine.next(card, now, rating);
  return { card: serializeCard(next), dueAt: next.due };
}

function serializeCard(card: Card): SerializedCard {
  return {
    ...card,
    due: card.due.toISOString(),
    last_review: card.last_review ? card.last_review.toISOString() : null,
  };
}

function deserializeCard(s: SerializedCard): Card {
  return {
    ...(s as unknown as Card),
    due: new Date(s.due as string),
    last_review: s.last_review ? new Date(s.last_review as string) : undefined,
  };
}

export { Rating };
