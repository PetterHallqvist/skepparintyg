import { describe, expect, it } from "vitest";
import { scoreExam, formatScore, type ScoredItem } from "@/lib/exam/scoring";

const titles = { a: "Del A", b: "Del B", diag: "Diagnos" };

function items(spec: [string, string, boolean, boolean][]): ScoredItem[] {
  return spec.map(([itemId, sectionId, isDiagnostic, correct]) => ({
    itemId,
    sectionId,
    isDiagnostic,
    correct,
  }));
}

describe("scoreExam (§35.7)", () => {
  it("scores over non-diagnostic items only", () => {
    const result = scoreExam(
      items([
        ["1", "a", false, true],
        ["2", "a", false, true],
        ["3", "a", false, true],
        ["4", "a", false, false],
        // diagnostic items must not move the score:
        ["5", "diag", true, false],
        ["6", "diag", true, false],
      ]),
      titles,
      7500,
    );
    expect(result.totalGraded).toBe(4);
    expect(result.totalCorrect).toBe(3);
    expect(result.scoreBp).toBe(7500); // 3/4 = 75.00 %
    expect(result.passed).toBe(true);
  });

  it("treats exactly the threshold as a pass, just under as a fail", () => {
    const pass = scoreExam(
      items([
        ["1", "a", false, true],
        ["2", "a", false, true],
        ["3", "a", false, true],
        ["4", "a", false, false],
      ]),
      titles,
      7500,
    );
    expect(pass.passed).toBe(true);

    const fail = scoreExam(
      items([
        ["1", "a", false, true],
        ["2", "a", false, false],
        ["3", "a", false, false],
        ["4", "a", false, false],
      ]),
      titles,
      7500,
    );
    expect(fail.scoreBp).toBe(2500);
    expect(fail.passed).toBe(false);
  });

  it("reports a per-section breakdown including diagnostic sections", () => {
    const result = scoreExam(
      items([
        ["1", "a", false, true],
        ["2", "b", false, false],
        ["3", "diag", true, true],
      ]),
      titles,
      7500,
    );
    const diag = result.sectionScores.find((s) => s.sectionId === "diag");
    expect(diag).toMatchObject({ isDiagnostic: true, correct: 1, total: 1 });
  });

  it("is safe with zero graded items", () => {
    const result = scoreExam(
      items([["1", "diag", true, true]]),
      titles,
      7500,
    );
    expect(result.scoreBp).toBe(0);
    expect(result.passed).toBe(false);
  });

  it("formats basis points (NBSP before %)", () => {
    expect(formatScore(7500).replace(/\s/g,"")).toBe("75%");
    expect(formatScore(7250).replace(/\s/g,"")).toBe("72,5%");
  });
});
