import { describe, expect, it } from "vitest";
import {
  mapEvidenceToRating,
  newCard,
  resolveLatencyBaseline,
  reviewCard,
  Rating,
  type AttemptEvidence,
} from "@/lib/domain/srs";

const base: AttemptEvidence = {
  correct: true,
  revealed: false,
  hintLevel: 0,
  changedFromWrong: false,
  confidence: "fairly_sure",
  activeLatencyMs: 8000,
  latencyBaseline: { medianMs: 8000, n: 30 },
  priorSuccessfulRecalls: 1,
  priorRecallsSpanDays: false,
  newlyIntroduced: false,
  safetyCritical: false,
  reviewCount: 2,
  unresolvedHighRiskMisconception: false,
  latencyExcluded: false,
};

describe("mapEvidenceToRating (SPEC §15.1)", () => {
  it("Again on incorrect", () => {
    expect(mapEvidenceToRating({ ...base, correct: false })).toBe(Rating.Again);
  });
  it("Again on revealed answer even when final field is correct", () => {
    expect(mapEvidenceToRating({ ...base, revealed: true })).toBe(Rating.Again);
  });
  it("Again on tier-2+ hint", () => {
    expect(mapEvidenceToRating({ ...base, hintLevel: 2 })).toBe(Rating.Again);
  });
  it("Again when changed from a submitted wrong answer", () => {
    expect(mapEvidenceToRating({ ...base, changedFromWrong: true })).toBe(
      Rating.Again,
    );
  });
  it("Hard on tier-1 hint", () => {
    expect(mapEvidenceToRating({ ...base, hintLevel: 1 })).toBe(Rating.Hard);
  });
  it("Hard when very slow vs baseline", () => {
    expect(mapEvidenceToRating({ ...base, activeLatencyMs: 25000 })).toBe(
      Rating.Hard,
    );
  });
  it("Hard when marked guessed", () => {
    expect(mapEvidenceToRating({ ...base, confidence: "guessed" })).toBe(
      Rating.Hard,
    );
  });
  it("Hard on unresolved high-risk misconception", () => {
    expect(
      mapEvidenceToRating({ ...base, unresolvedHighRiskMisconception: true }),
    ).toBe(Rating.Hard);
  });
  it("Good on clean independent correct", () => {
    expect(mapEvidenceToRating(base)).toBe(Rating.Good);
  });
  it("latency has no effect when baseline is missing (§15.2)", () => {
    expect(
      mapEvidenceToRating({
        ...base,
        activeLatencyMs: 60000,
        latencyBaseline: null,
      }),
    ).toBe(Rating.Good);
  });
  it("latency has no effect when the session is excluded (§15.2)", () => {
    expect(
      mapEvidenceToRating({
        ...base,
        activeLatencyMs: 60000,
        latencyExcluded: true,
      }),
    ).toBe(Rating.Good);
  });

  const easyEvidence: AttemptEvidence = {
    ...base,
    confidence: "very_sure",
    activeLatencyMs: 3000,
    priorSuccessfulRecalls: 3,
    priorRecallsSpanDays: true,
  };
  it("Easy only when ALL §15.1 conditions hold", () => {
    expect(mapEvidenceToRating(easyEvidence)).toBe(Rating.Easy);
  });
  it("no Easy when newly introduced", () => {
    expect(
      mapEvidenceToRating({ ...easyEvidence, newlyIntroduced: true }),
    ).toBe(Rating.Good);
  });
  it("no Easy for safety-critical on its first reviews", () => {
    expect(
      mapEvidenceToRating({
        ...easyEvidence,
        safetyCritical: true,
        reviewCount: 1,
      }),
    ).toBe(Rating.Good);
  });
  it("no Easy without separated prior recalls", () => {
    expect(
      mapEvidenceToRating({ ...easyEvidence, priorRecallsSpanDays: false }),
    ).toBe(Rating.Good);
  });
});

describe("resolveLatencyBaseline (SPEC §15.2)", () => {
  it("prefers user+kind+device with ≥15 observations", () => {
    expect(
      resolveLatencyBaseline({
        userItemKindDevice: { medianMs: 5000, n: 15 },
        userItemKind: { medianMs: 7000, n: 40 },
      })?.medianMs,
    ).toBe(5000);
  });
  it("falls back past sparse levels", () => {
    expect(
      resolveLatencyBaseline({
        userItemKindDevice: { medianMs: 5000, n: 3 },
        userItemKind: { medianMs: 7000, n: 14 },
        cohortItemKindDifficulty: { medianMs: 9000, n: 500 },
      })?.medianMs,
    ).toBe(9000);
  });
  it("returns null when nothing qualifies — latency unused", () => {
    expect(
      resolveLatencyBaseline({ userItemKind: { medianMs: 7000, n: 2 } }),
    ).toBeNull();
  });
});

describe("FSRS card wrapper", () => {
  it("round-trips through jsonb-safe serialisation and schedules forward", () => {
    const t0 = new Date("2026-07-16T08:00:00Z");
    const card = newCard(t0);
    const first = reviewCard(card, t0, Rating.Good);
    expect(first.dueAt.getTime()).toBeGreaterThan(t0.getTime());
    const t1 = first.dueAt;
    const second = reviewCard(first.card, t1, Rating.Good);
    expect(second.dueAt.getTime()).toBeGreaterThan(t1.getTime());
  });
});
