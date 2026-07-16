/**
 * Exam-aware due-date planning (SPEC §15.3). Deterministic pure function.
 *
 * Principles: let FSRS produce its interval; only shorten when the FSRS due
 * date falls AFTER the target exam and the item lacks mastery evidence.
 * Spread shortened reviews by criticality instead of piling everything on
 * the final day. Never blanket-cap intervals.
 */

export type Criticality =
  "informational" | "standard" | "important" | "safety_critical";

export type MasteryEvidence = {
  independentSuccesses: number;
  stable: boolean;
};

const MS_PER_DAY = 86_400_000;

/** Fraction of the remaining runway where the shortened review lands. */
const RUNWAY_FRACTION: Record<Criticality, number> = {
  informational: 0.7,
  standard: 0.6,
  important: 0.5,
  safety_critical: 0.4,
};

export function planDueDate({
  fsrsDue,
  today,
  examDate,
  objectiveCriticality,
  masteryEvidence,
}: {
  fsrsDue: Date;
  today: Date;
  examDate: Date | null;
  objectiveCriticality: Criticality;
  masteryEvidence: MasteryEvidence;
}): Date {
  // No exam, or exam already passed: FSRS rules.
  if (!examDate || examDate.getTime() <= today.getTime()) {
    return fsrsDue;
  }

  // Due before the exam anyway: FSRS rules (§15.3.1 — no blind capping).
  if (fsrsDue.getTime() <= examDate.getTime()) {
    return fsrsDue;
  }

  // Due after the exam but mastered: leave it — no forced massed repetition.
  if (masteryEvidence.stable && masteryEvidence.independentSuccesses >= 2) {
    return fsrsDue;
  }

  // Shorten: place the retrieval a criticality-dependent fraction into the
  // remaining runway, at least one day out, always strictly before the exam.
  const runwayDays = Math.floor(
    (examDate.getTime() - today.getTime()) / MS_PER_DAY,
  );
  if (runwayDays <= 1) {
    return new Date(
      today.getTime() + 1 * MS_PER_DAY > examDate.getTime()
        ? examDate.getTime()
        : today.getTime() + MS_PER_DAY,
    );
  }

  const offsetDays = Math.max(
    1,
    Math.min(
      runwayDays - 1,
      Math.floor(runwayDays * RUNWAY_FRACTION[objectiveCriticality]),
    ),
  );
  return new Date(today.getTime() + offsetDays * MS_PER_DAY);
}
