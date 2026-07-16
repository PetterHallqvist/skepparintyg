import { describe, expect, it } from "vitest";
import {
  evaluateGuarantee,
  GUARANTEE_VERSION,
  type GuaranteeSnapshot,
} from "@/lib/commerce/guarantee";

const eligible: GuaranteeSnapshot = {
  planCompletion01: 1,
  readinessScore: 85,
  readinessThreshold: 80,
  examPassed: false,
  examDate: "2026-07-10",
  entitlementActiveOnExamDate: true,
};

describe("studiegaranti eligibility (SPEC §9.5)", () => {
  it("is eligible when plan done + readiness reached + exam failed + active", () => {
    const e = evaluateGuarantee(eligible);
    expect(e.eligible).toBe(true);
    expect(e.failedConditions).toEqual([]);
    expect(e.version).toBe(GUARANTEE_VERSION);
  });

  it("NEVER grants automatically — manual review is always required", () => {
    expect(evaluateGuarantee(eligible).requiresManualReview).toBe(true);
    expect(
      evaluateGuarantee({ ...eligible, examPassed: true }).requiresManualReview,
    ).toBe(true);
  });

  it("the only v1 benefit is an access extension (no refund path)", () => {
    expect(evaluateGuarantee(eligible).requestedBenefit).toBe(
      "access_extension",
    );
  });

  it("names every failed condition", () => {
    const e = evaluateGuarantee({
      planCompletion01: 0.5,
      readinessScore: 40,
      readinessThreshold: 80,
      examPassed: true,
      examDate: "2026-07-10",
      entitlementActiveOnExamDate: false,
    });
    expect(e.eligible).toBe(false);
    expect(e.failedConditions).toEqual([
      "plan_not_completed",
      "readiness_not_reached",
      "exam_passed",
      "entitlement_inactive_on_exam_date",
    ]);
  });

  it("tolerates rounding noise in plan completion (≥ 0.98 counts as full)", () => {
    expect(
      evaluateGuarantee({ ...eligible, planCompletion01: 0.985 }).eligible,
    ).toBe(true);
    expect(
      evaluateGuarantee({ ...eligible, planCompletion01: 0.9 }).eligible,
    ).toBe(false);
  });

  it("a passed exam is a failed condition — the guarantee is for failures", () => {
    const e = evaluateGuarantee({ ...eligible, examPassed: true });
    expect(e.eligible).toBe(false);
    expect(e.failedConditions).toEqual(["exam_passed"]);
  });
});
