/**
 * Exam scoring (SPEC §35.7). Pure: the pass calc uses only the graded
 * (non-diagnostic) sections; diagnostic sections are reported separately and
 * never affect pass/fail. Score is basis points so it compares exactly against
 * the configured official threshold with no float drift.
 */

export interface ScoredItem {
  itemId: string;
  sectionId: string;
  isDiagnostic: boolean;
  correct: boolean;
}

export interface SectionScore {
  sectionId: string;
  title: string;
  isDiagnostic: boolean;
  correct: number;
  total: number;
}

export interface ExamResult {
  totalCorrect: number;
  totalGraded: number;
  /** 0–10000 (basis points), over the non-diagnostic items only. */
  scoreBp: number;
  passed: boolean;
  passThresholdBp: number;
  sectionScores: SectionScore[];
}

export function scoreExam(
  items: readonly ScoredItem[],
  sectionTitles: Record<string, string>,
  passThresholdBp: number,
): ExamResult {
  const graded = items.filter((i) => !i.isDiagnostic);
  const totalGraded = graded.length;
  const totalCorrect = graded.filter((i) => i.correct).length;
  const scoreBp =
    totalGraded === 0 ? 0 : Math.round((totalCorrect / totalGraded) * 10000);

  const bySection = new Map<
    string,
    { correct: number; total: number; isDiagnostic: boolean }
  >();
  for (const it of items) {
    const s =
      bySection.get(it.sectionId) ??
      { correct: 0, total: 0, isDiagnostic: it.isDiagnostic };
    s.total += 1;
    if (it.correct) s.correct += 1;
    bySection.set(it.sectionId, s);
  }

  const sectionScores: SectionScore[] = [...bySection.entries()].map(
    ([sectionId, v]) => ({
      sectionId,
      title: sectionTitles[sectionId] ?? sectionId,
      isDiagnostic: v.isDiagnostic,
      correct: v.correct,
      total: v.total,
    }),
  );

  return {
    totalCorrect,
    totalGraded,
    scoreBp,
    passed: scoreBp >= passThresholdBp,
    passThresholdBp,
    sectionScores,
  };
}

/** Format basis points as "75 %" / "72,5 %" for display. */
export function formatScore(bp: number): string {
  const pct = bp / 100;
  const text = Number.isInteger(pct)
    ? String(pct)
    : String(Math.round(pct * 10) / 10).replace(".", ",");
  return `${text} %`;
}
