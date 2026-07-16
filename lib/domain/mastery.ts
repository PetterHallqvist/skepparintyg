/**
 * Procedural-skill mastery stages (SPEC §16.2). Pure, deterministic.
 * Separate from FSRS memory state — skills require doing.
 */

export type SkillStage =
  | "unseen"
  | "introduced"
  | "supported"
  | "independent"
  | "stable"
  | "needs_refresh";

export type SkillEvidence = {
  workedExampleCompleted: boolean;
  guidedSuccesses: number;
  /** Correct, no-hint task completions. */
  independentSuccesses: number;
  /** Of the independent successes, how many used a novel variant. */
  novelVariantSuccesses: number;
  /** Distinct ISO dates (YYYY-MM-DD) with an independent success. */
  independentSuccessDates: string[];
  /** Success inside a mixed/interleaved set after the initial learning. */
  mixedSetSuccess: boolean;
  /** Most recent failure, if any. */
  lastFailureAt: Date | null;
  lastSuccessAt: Date | null;
  /** Refresh horizon; overdue skills decay to needs_refresh. */
  dueAt: Date | null;
};

export function computeSkillStage(
  evidence: SkillEvidence,
  opts: { safetyCritical: boolean; now: Date },
): SkillStage {
  const requiredDays = opts.safetyCritical ? 3 : 2;
  const distinctDays = new Set(evidence.independentSuccessDates).size;

  const overdue =
    evidence.dueAt !== null && evidence.dueAt.getTime() < opts.now.getTime();
  const recentFailure =
    evidence.lastFailureAt !== null &&
    (evidence.lastSuccessAt === null ||
      evidence.lastFailureAt.getTime() > evidence.lastSuccessAt.getTime());

  const reachedStable =
    distinctDays >= requiredDays &&
    evidence.mixedSetSuccess &&
    evidence.independentSuccesses >= 2;

  const reachedIndependent =
    evidence.independentSuccesses >= 2 && evidence.novelVariantSuccesses >= 1;

  // Decay applies once a skill has been established.
  if ((reachedStable || reachedIndependent) && (overdue || recentFailure)) {
    return "needs_refresh";
  }

  if (reachedStable) return "stable";
  if (reachedIndependent) return "independent";
  if (evidence.guidedSuccesses >= 1) return "supported";
  if (evidence.workedExampleCompleted) return "introduced";
  return "unseen";
}
