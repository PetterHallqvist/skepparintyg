import { describe, expect, it } from "vitest";
import { readinessLabel } from "@/components/design-system/readiness-gauge";

/** SPEC §17.4 label boundaries. */
describe("readinessLabel", () => {
  it.each([
    [0, "Börja med grunderna"],
    [39, "Börja med grunderna"],
    [40, "På väg"],
    [59, "På väg"],
    [60, "Behöver mer träning"],
    [74, "Behöver mer träning"],
    [75, "Nära provberedskap"],
    [84, "Nära provberedskap"],
    [85, "God beredskap"],
    [94, "God beredskap"],
    [95, "Mycket god beredskap"],
    [100, "Mycket god beredskap"],
  ])("maps %i to %s", (score, label) => {
    expect(readinessLabel(score)).toBe(label);
  });
});
