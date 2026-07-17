import { describe, expect, it } from "vitest";
import fc from "fast-check";
import {
  assembleExam,
  mulberry32,
  seededShuffle,
  type Blueprint,
  type PoolItem,
} from "@/lib/exam/assembly";

const blueprint: Blueprint = {
  id: "forar-sim-1",
  title: "Träningssimulering",
  durationSeconds: 5400,
  passThresholdBp: 7500,
  sections: [
    { id: "nav", title: "Navigation", objectiveTags: ["nav"], count: 3 },
    { id: "rules", title: "Regler", objectiveTags: ["rules"], count: 2 },
    { id: "diag", title: "Diagnos", objectiveTags: ["safety"], count: 2, isDiagnostic: true },
  ],
};

function pool(n: number): PoolItem[] {
  const tags = ["nav", "rules", "safety"];
  return Array.from({ length: n }, (_, i) => ({
    id: `item-${i}`,
    objectiveTag: tags[i % 3],
  }));
}

describe("assembleExam (§35.3)", () => {
  it("is deterministic: same seed → identical exam", () => {
    const p = pool(60);
    const a = assembleExam(blueprint, p, "seed-A");
    const b = assembleExam(blueprint, p, "seed-A");
    expect(a).toEqual(b);
  });

  it("fills each section to quota with no cross-section duplicates", () => {
    const a = assembleExam(blueprint, pool(60), "seed-B");
    expect(a.sections.map((s) => s.itemIds.length)).toEqual([3, 2, 2]);
    const all = a.itemOrder;
    expect(new Set(all).size).toBe(all.length);
    expect(a.shortfalls).toHaveLength(0);
  });

  it("reports a shortfall when the pool cannot fill a section", () => {
    const thin: PoolItem[] = [{ id: "only-nav", objectiveTag: "nav" }];
    const a = assembleExam(blueprint, thin, "seed-C");
    expect(a.sections[0].itemIds).toEqual(["only-nav"]);
    expect(a.shortfalls).toContainEqual({ sectionId: "nav", needed: 3, got: 1 });
  });

  it("respects exposure limits", () => {
    const p = pool(60);
    const overexposed = new Set(["item-0", "item-3", "item-6"]); // all nav-tagged
    const a = assembleExam(blueprint, p, "seed-D", {
      exposureOf: (id) => (overexposed.has(id) ? 5 : 0),
      maxExposure: 3,
    });
    for (const id of a.itemOrder) expect(overexposed.has(id)).toBe(false);
  });

  it("different seeds can produce different selections (over many seeds)", () => {
    const p = pool(60);
    const first = assembleExam(blueprint, p, "s0").itemOrder.join(",");
    const anyDifferent = Array.from({ length: 20 }, (_, i) =>
      assembleExam(blueprint, p, `s${i + 1}`).itemOrder.join(","),
    ).some((o) => o !== first);
    expect(anyDifferent).toBe(true);
  });

  it("seededShuffle is a permutation (property)", () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.integer(), (arr, seed) => {
        const shuffled = seededShuffle(arr, mulberry32(seed >>> 0));
        expect([...shuffled].sort((a, b) => a - b)).toEqual(
          [...arr].sort((a, b) => a - b),
        );
      }),
    );
  });
});
