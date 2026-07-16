import { describe, expect, it } from "vitest";
import { planDueDate } from "@/lib/domain/plan-due-date";
import { computeSkillStage, type SkillEvidence } from "@/lib/domain/mastery";
import {
  computeReadiness,
  isObjectiveReady,
  readinessLabel,
  type ReadinessCapFlags,
} from "@/lib/domain/readiness";
import { planSession, priorityScore } from "@/lib/domain/session-planner";

const d = (s: string) => new Date(`${s}T12:00:00Z`);

describe("planDueDate (SPEC §15.3)", () => {
  const today = d("2026-07-16");
  const exam = d("2026-08-15"); // 30 days runway
  const mastered = { independentSuccesses: 3, stable: true };
  const weak = { independentSuccesses: 0, stable: false };

  it("keeps the FSRS date when no exam is set", () => {
    const fsrsDue = d("2026-09-20");
    expect(
      planDueDate({
        fsrsDue,
        today,
        examDate: null,
        objectiveCriticality: "standard",
        masteryEvidence: weak,
      }),
    ).toEqual(fsrsDue);
  });

  it("keeps the FSRS date when it lands before the exam (no blind capping)", () => {
    const fsrsDue = d("2026-08-01");
    expect(
      planDueDate({
        fsrsDue,
        today,
        examDate: exam,
        objectiveCriticality: "safety_critical",
        masteryEvidence: weak,
      }),
    ).toEqual(fsrsDue);
  });

  it("leaves mastered material alone even when due after the exam", () => {
    const fsrsDue = d("2026-09-20");
    expect(
      planDueDate({
        fsrsDue,
        today,
        examDate: exam,
        objectiveCriticality: "standard",
        masteryEvidence: mastered,
      }),
    ).toEqual(fsrsDue);
  });

  it("shortens weak material due after the exam, spread by criticality", () => {
    const fsrsDue = d("2026-09-20");
    const std = planDueDate({
      fsrsDue,
      today,
      examDate: exam,
      objectiveCriticality: "standard",
      masteryEvidence: weak,
    });
    const crit = planDueDate({
      fsrsDue,
      today,
      examDate: exam,
      objectiveCriticality: "safety_critical",
      masteryEvidence: weak,
    });
    expect(std.getTime()).toBeLessThan(exam.getTime());
    expect(crit.getTime()).toBeLessThan(std.getTime()); // critical reviews earlier
    expect(std.getTime()).toBeGreaterThan(today.getTime());
  });

  it("never schedules on/after the exam when shortening", () => {
    const soonExam = d("2026-07-18");
    const out = planDueDate({
      fsrsDue: d("2026-09-20"),
      today,
      examDate: soonExam,
      objectiveCriticality: "important",
      masteryEvidence: weak,
    });
    expect(out.getTime()).toBeLessThanOrEqual(soonExam.getTime());
    expect(out.getTime()).toBeGreaterThan(today.getTime());
  });
});

describe("computeSkillStage (SPEC §16.2)", () => {
  const now = d("2026-07-16");
  const none: SkillEvidence = {
    workedExampleCompleted: false,
    guidedSuccesses: 0,
    independentSuccesses: 0,
    novelVariantSuccesses: 0,
    independentSuccessDates: [],
    mixedSetSuccess: false,
    lastFailureAt: null,
    lastSuccessAt: null,
    dueAt: null,
  };

  it("progresses unseen → introduced → supported → independent → stable", () => {
    expect(computeSkillStage(none, { safetyCritical: false, now })).toBe(
      "unseen",
    );
    expect(
      computeSkillStage(
        { ...none, workedExampleCompleted: true },
        { safetyCritical: false, now },
      ),
    ).toBe("introduced");
    expect(
      computeSkillStage(
        { ...none, workedExampleCompleted: true, guidedSuccesses: 1 },
        { safetyCritical: false, now },
      ),
    ).toBe("supported");
    expect(
      computeSkillStage(
        {
          ...none,
          workedExampleCompleted: true,
          guidedSuccesses: 1,
          independentSuccesses: 2,
          novelVariantSuccesses: 1,
          independentSuccessDates: ["2026-07-15"],
        },
        { safetyCritical: false, now },
      ),
    ).toBe("independent");
    expect(
      computeSkillStage(
        {
          ...none,
          workedExampleCompleted: true,
          guidedSuccesses: 1,
          independentSuccesses: 3,
          novelVariantSuccesses: 1,
          independentSuccessDates: ["2026-07-10", "2026-07-14"],
          mixedSetSuccess: true,
        },
        { safetyCritical: false, now },
      ),
    ).toBe("stable");
  });

  it("independent requires a novel variant", () => {
    expect(
      computeSkillStage(
        {
          ...none,
          independentSuccesses: 4,
          novelVariantSuccesses: 0,
          independentSuccessDates: ["2026-07-10"],
        },
        { safetyCritical: false, now },
      ),
    ).toBe("unseen");
  });

  it("safety-critical stable requires three separate days", () => {
    const evidence: SkillEvidence = {
      ...none,
      independentSuccesses: 3,
      novelVariantSuccesses: 1,
      independentSuccessDates: ["2026-07-10", "2026-07-14"],
      mixedSetSuccess: true,
    };
    expect(computeSkillStage(evidence, { safetyCritical: true, now })).toBe(
      "independent",
    );
    expect(
      computeSkillStage(
        {
          ...evidence,
          independentSuccessDates: ["2026-07-08", "2026-07-10", "2026-07-14"],
        },
        { safetyCritical: true, now },
      ),
    ).toBe("stable");
  });

  it("decays established skills to needs_refresh when overdue or failed", () => {
    const established: SkillEvidence = {
      ...none,
      independentSuccesses: 3,
      novelVariantSuccesses: 1,
      independentSuccessDates: ["2026-07-01", "2026-07-05"],
      mixedSetSuccess: true,
    };
    expect(
      computeSkillStage(
        { ...established, dueAt: d("2026-07-10") },
        { safetyCritical: false, now },
      ),
    ).toBe("needs_refresh");
    expect(
      computeSkillStage(
        {
          ...established,
          lastFailureAt: d("2026-07-15"),
          lastSuccessAt: d("2026-07-05"),
        },
        { safetyCritical: false, now },
      ),
    ).toBe("needs_refresh");
  });
});

describe("computeReadiness caps (SPEC §17.3)", () => {
  const strong = {
    coverage: 1,
    recall: 1,
    procedural: 1,
    simulations: 1,
    calibration: 1,
  };
  const noCaps: ReadinessCapFlags = {
    unseenSafetyCriticalObjective: false,
    failedSafetyCriticalLast72h: false,
    noValidTimedSimulation: false,
    noIndependentChartEvidence: false,
    staleSyllabusMapping: false,
  };

  it("perfect components → 100, Mycket god beredskap", () => {
    const r = computeReadiness(strong, noCaps);
    if (r.hidden) throw new Error("unexpected hidden");
    expect(r.score).toBe(100);
    expect(r.label).toBe("Mycket god beredskap");
  });

  it.each([
    ["unseenSafetyCriticalObjective", 69],
    ["failedSafetyCriticalLast72h", 79],
    ["noIndependentChartEvidence", 74],
    ["noValidTimedSimulation", 84],
  ] as const)("cap %s → max %i", (flag, cap) => {
    const r = computeReadiness(strong, { ...noCaps, [flag]: true });
    if (r.hidden) throw new Error("unexpected hidden");
    expect(r.score).toBe(cap);
    expect(r.appliedCaps).toHaveLength(1);
  });

  it("stacked caps apply the lowest and record each binding cap", () => {
    const r = computeReadiness(strong, {
      ...noCaps,
      unseenSafetyCriticalObjective: true,
      noValidTimedSimulation: true,
    });
    if (r.hidden) throw new Error("unexpected hidden");
    expect(r.score).toBe(69);
  });

  it("stale syllabus mapping hides the score entirely", () => {
    const r = computeReadiness(strong, {
      ...noCaps,
      staleSyllabusMapping: true,
    });
    expect(r.hidden).toBe(true);
  });

  it("caps do not raise low scores", () => {
    const r = computeReadiness(
      {
        coverage: 0.2,
        recall: 0.2,
        procedural: 0.2,
        simulations: 0,
        calibration: 0.5,
      },
      { ...noCaps, noValidTimedSimulation: true },
    );
    if (r.hidden) throw new Error("unexpected hidden");
    expect(r.score).toBeLessThan(84);
    expect(r.appliedCaps).toHaveLength(0);
  });

  it("label boundaries match §17.4", () => {
    expect(readinessLabel(74)).toBe("Behöver mer träning");
    expect(readinessLabel(75)).toBe("Nära provberedskap");
  });
});

describe("isObjectiveReady (SPEC §17.2)", () => {
  const good = {
    itemVariantCoverage: 4,
    minCoverageRequired: 3,
    independentSuccesses: 3,
    evidenceDates: ["2026-07-10", "2026-07-14"],
    rollingAccuracy01: 0.9,
    accuracyThreshold01: 0.8,
    unresolvedSevereMisconception: false,
    overdueCriticalReview: false,
    proceduralStageOk: true,
    safetyCritical: false,
    failedInLastTwoIndependent: false,
  };
  it("passes when every condition holds", () => {
    expect(isObjectiveReady(good)).toBe(true);
  });
  it("fails on single-day evidence (repetition on one easy day proves nothing)", () => {
    expect(
      isObjectiveReady({
        ...good,
        evidenceDates: ["2026-07-14", "2026-07-14"],
      }),
    ).toBe(false);
  });
  it("fails safety-critical after recent independent failure", () => {
    expect(
      isObjectiveReady({
        ...good,
        safetyCritical: true,
        failedInLastTwoIndependent: true,
      }),
    ).toBe(false);
  });
});

describe("planSession (SPEC §18.3)", () => {
  const mk = (
    id: string,
    over: Partial<Parameters<typeof priorityScore>[0]> = {},
  ) => ({
    id,
    type: "review" as const,
    objectiveId: `obj-${id}`,
    criticality: "standard" as const,
    overdueDays: 0,
    weakness: 0.3,
    prerequisiteOfWeak: false,
    daysToExam: null,
    recentSameKindCount: 0,
    recentlyServed: false,
    ...over,
  });

  it("is deterministic", () => {
    const candidates = [
      mk("a", { overdueDays: 3, criticality: "safety_critical" }),
      mk("b", { type: "guided_task", weakness: 0.8 }),
      mk("c", { type: "independent_task" }),
      mk("d"),
    ];
    expect(planSession(candidates)).toEqual(planSession(candidates));
  });

  it("orders warmup → overdue critical → main skill → mixed → reflection", () => {
    const session = planSession([
      mk("warm", { weakness: 0.1 }),
      mk("over", { overdueDays: 5, criticality: "important", weakness: 0.7 }),
      mk("skill", { type: "guided_task", weakness: 0.9 }),
      mk("mix1", { type: "independent_task" }),
    ]);
    const sections = session.map((a) => a.section);
    expect(sections[0]).toBe("warmup");
    expect(sections).toContain("overdue_review");
    expect(sections).toContain("main_skill");
    expect(sections[sections.length - 1]).toBe("reflection");
  });

  it("recently served items are heavily deprioritised", () => {
    expect(priorityScore(mk("x", { recentlyServed: true }))).toBeLessThan(
      priorityScore(mk("x")),
    );
  });
});
