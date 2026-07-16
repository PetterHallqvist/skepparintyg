import { describe, expect, it } from "vitest";
import {
  planRemediation,
  type FelbokEntry,
} from "@/lib/domain/session-planner";

const entry = (over: Partial<FelbokEntry>): FelbokEntry => ({
  id: "e",
  objectiveId: "obj",
  misconceptionId: null,
  status: "open",
  occurrences: 1,
  ...over,
});

describe("planRemediation (SPEC §13.6)", () => {
  it("pairs each objective's repair with a fresh independent item", () => {
    const plan = planRemediation([entry({ objectiveId: "a" })]);
    expect(plan).toEqual([
      { objectiveId: "a", misconceptionId: null, mode: "repair" },
      { objectiveId: "a", misconceptionId: null, mode: "fresh" },
    ]);
  });

  it("excludes resolved entries", () => {
    const plan = planRemediation([
      entry({ objectiveId: "a", status: "resolved" }),
    ]);
    expect(plan).toEqual([]);
  });

  it("orders open before improving, then by occurrences", () => {
    const plan = planRemediation([
      entry({ objectiveId: "imp", status: "improving", occurrences: 9 }),
      entry({ objectiveId: "low", status: "open", occurrences: 1 }),
      entry({ objectiveId: "high", status: "open", occurrences: 5 }),
    ]);
    // open (high occ) → open (low occ) → improving
    expect(plan.filter((s) => s.mode === "repair").map((s) => s.objectiveId)).toEqual([
      "high",
      "low",
      "imp",
    ]);
  });

  it("keeps one pair per objective and caps the objective count", () => {
    const entries = Array.from({ length: 8 }, (_, i) =>
      entry({ objectiveId: `o${i}`, occurrences: 8 - i }),
    );
    // duplicate objective should not add a second pair
    entries.push(entry({ objectiveId: "o0", occurrences: 99 }));
    const plan = planRemediation(entries, { maxObjectives: 3 });
    const objectives = new Set(plan.map((s) => s.objectiveId));
    expect(objectives.size).toBe(3);
    expect(plan).toHaveLength(6); // 3 objectives × (repair + fresh)
  });
});
