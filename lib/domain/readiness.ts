/**
 * Beredskap (SPEC §17). Never a pass probability — product guidance with a
 * transparent explanation. Pure and versioned; snapshots store
 * ALGORITHM_VERSION so historical scores stay interpretable.
 */

export const ALGORITHM_VERSION = "beredskap-v1";

/** §17.1 default Förarintyg weights. Stored in config per certification. */
export const DEFAULT_WEIGHTS = {
  coverage: 0.15,
  recall: 0.25,
  procedural: 0.25,
  simulations: 0.25,
  calibration: 0.1,
} as const;

export type ReadinessComponents = {
  /** Each 0..1. */
  coverage: number;
  recall: number;
  procedural: number;
  simulations: number;
  calibration: number;
};

export type ReadinessCapFlags = {
  unseenSafetyCriticalObjective: boolean;
  failedSafetyCriticalLast72h: boolean;
  noValidTimedSimulation: boolean;
  noIndependentChartEvidence: boolean;
  staleSyllabusMapping: boolean;
};

export type AppliedCap = { cap: number; reason_sv: string };

export type ReadinessResult =
  | { hidden: true; reason_sv: string }
  | {
      hidden: false;
      score: number;
      rawScore: number;
      label: string;
      appliedCaps: AppliedCap[];
    };

/** §17.4 labels. */
export function readinessLabel(score: number): string {
  if (score < 40) return "Börja med grunderna";
  if (score < 60) return "På väg";
  if (score < 75) return "Behöver mer träning";
  if (score < 85) return "Nära provberedskap";
  if (score < 95) return "God beredskap";
  return "Mycket god beredskap";
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function computeReadiness(
  components: ReadinessComponents,
  caps: ReadinessCapFlags,
  // Same shape as the components record — per-certification config (§17.1).
  weights: ReadinessComponents = DEFAULT_WEIGHTS,
): ReadinessResult {
  // §17.3: stale mapping hides the score entirely — never mislead.
  if (caps.staleSyllabusMapping) {
    return {
      hidden: true,
      reason_sv:
        "Kursplanens koppling till officiella krav behöver verifieras — beredskap visas inte förrän det är gjort.",
    };
  }

  const raw =
    100 *
    (clamp01(components.coverage) * weights.coverage +
      clamp01(components.recall) * weights.recall +
      clamp01(components.procedural) * weights.procedural +
      clamp01(components.simulations) * weights.simulations +
      clamp01(components.calibration) * weights.calibration);

  const appliedCaps: AppliedCap[] = [];
  let capped = raw;

  const applyCap = (cap: number, reason_sv: string) => {
    if (capped > cap) {
      capped = cap;
      appliedCaps.push({ cap, reason_sv });
    }
  };

  if (caps.unseenSafetyCriticalObjective) {
    applyCap(69, "Minst ett säkerhetskritiskt mål är helt otränat.");
  }
  if (caps.failedSafetyCriticalLast72h) {
    applyCap(
      79,
      "Ett säkerhetskritiskt mål underkändes under de senaste 72 timmarna.",
    );
  }
  if (caps.noIndependentChartEvidence) {
    applyCap(74, "Självständigt sjökortsarbete saknas ännu.");
  }
  if (caps.noValidTimedSimulation) {
    applyCap(
      84,
      "Ingen giltig träningssimulering med tidtagning är genomförd.",
    );
  }

  const score = Math.round(capped);
  return {
    hidden: false,
    score,
    rawScore: Math.round(raw),
    label: readinessLabel(score),
    appliedCaps,
  };
}

// ---------------------------------------------------------------------------
// Objective readiness (§17.2) — all applicable conditions must pass
// ---------------------------------------------------------------------------

export type ObjectiveEvidence = {
  itemVariantCoverage: number;
  minCoverageRequired: number;
  independentSuccesses: number;
  evidenceDates: string[];
  rollingAccuracy01: number;
  accuracyThreshold01: number;
  unresolvedSevereMisconception: boolean;
  overdueCriticalReview: boolean;
  proceduralStageOk: boolean;
  safetyCritical: boolean;
  failedInLastTwoIndependent: boolean;
};

export function isObjectiveReady(e: ObjectiveEvidence): boolean {
  if (e.itemVariantCoverage < e.minCoverageRequired) return false;
  if (e.independentSuccesses < 2) return false;
  if (new Set(e.evidenceDates).size < 2) return false;
  if (e.rollingAccuracy01 < e.accuracyThreshold01) return false;
  if (e.unresolvedSevereMisconception) return false;
  if (e.overdueCriticalReview) return false;
  if (!e.proceduralStageOk) return false;
  if (e.safetyCritical && e.failedInLastTwoIndependent) return false;
  return true;
}
