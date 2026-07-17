/**
 * Studiegaranti eligibility (SPEC §9.5). Pure and versioned: the function
 * evaluates a snapshot of the learner's study record and reports whether the
 * *conditions* of the guarantee are met. It NEVER grants a benefit — every
 * claim goes to manual review ("a human makes the final decision", §52.5).
 * The promise itself: follow the full personal study plan + reach approved
 * readiness + still fail the exam → free access extension + a joint review of
 * the study plan. Wording is draft pending legal review (docs/LEGAL_COPY.md).
 */

export const GUARANTEE_VERSION = "studiegaranti-v1";

export interface GuaranteeSnapshot {
  /** Share of the personal study plan completed, 0–1. */
  planCompletion01: number;
  /** Readiness score at the reported exam date, 0–100. */
  readinessScore: number;
  /** Readiness label threshold for "godkänd beredskap" (from config). */
  readinessThreshold: number;
  /** Self-reported official exam outcome. */
  examPassed: boolean;
  /** ISO date of the reported exam. */
  examDate: string;
  /** Entitlement was active on the exam date. */
  entitlementActiveOnExamDate: boolean;
}

export type GuaranteeCondition =
  | "plan_not_completed"
  | "readiness_not_reached"
  | "exam_passed"
  | "entitlement_inactive_on_exam_date";

export interface GuaranteeEvaluation {
  version: typeof GUARANTEE_VERSION;
  /** All conditions met — the claim is eligible FOR MANUAL REVIEW. */
  eligible: boolean;
  /** Which conditions failed (empty when eligible). */
  failedConditions: GuaranteeCondition[];
  /** Always true: no automatic financial benefit in v1 (§52.5). */
  requiresManualReview: true;
  /** The only benefit the guarantee promises in v1. */
  requestedBenefit: "access_extension";
}

/** Full plan completion tolerates rounding noise in the snapshot. */
const PLAN_COMPLETION_MIN = 0.98;

export function evaluateGuarantee(
  snapshot: GuaranteeSnapshot,
): GuaranteeEvaluation {
  const failed: GuaranteeCondition[] = [];
  if (snapshot.planCompletion01 < PLAN_COMPLETION_MIN) {
    failed.push("plan_not_completed");
  }
  if (snapshot.readinessScore < snapshot.readinessThreshold) {
    failed.push("readiness_not_reached");
  }
  if (snapshot.examPassed) {
    failed.push("exam_passed");
  }
  if (!snapshot.entitlementActiveOnExamDate) {
    failed.push("entitlement_inactive_on_exam_date");
  }
  return {
    version: GUARANTEE_VERSION,
    eligible: failed.length === 0,
    failedConditions: failed,
    requiresManualReview: true,
    requestedBenefit: "access_extension",
  };
}
