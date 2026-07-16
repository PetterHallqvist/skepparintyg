import { describe, expect, it } from "vitest";
import fc from "fast-check";
import {
  compileRhythm,
  formatLightCharacter,
  minPeriodMs,
  parseLightCharacter,
  periodMsOf,
} from "@/lib/lights/rhythm";

describe("light-character parsing (SPEC §25.3)", () => {
  it("parses group flashing with colours and period", () => {
    const c = parseLightCharacter("Fl(2) WRG 10s");
    expect(c.rhythm.cls).toBe("Fl");
    expect(c.rhythm.groups).toEqual([2]);
    expect(c.rhythm.periodS).toBe(10);
    expect(c.colors).toEqual(["W", "R", "G"]);
  });

  it("defaults colour to white and disambiguates LFl before Fl, VQ before Q", () => {
    expect(parseLightCharacter("Iso 4s").colors).toEqual(["W"]);
    expect(parseLightCharacter("LFl 10s").rhythm.cls).toBe("LFl");
    expect(parseLightCharacter("VQ").rhythm.cls).toBe("VQ");
    expect(parseLightCharacter("Q").rhythm.cls).toBe("Q");
  });

  it("parses composite groups and an optional range", () => {
    const c = parseLightCharacter("Oc(2+1) R 15s 8M");
    expect(c.rhythm.groups).toEqual([2, 1]);
    expect(c.rangeNm).toBe(8);
  });

  it("rejects unparsable input", () => {
    expect(() => parseLightCharacter("banana")).toThrow(
      /unparsable_light_character/,
    );
  });

  it("round-trips format ∘ parse for canonical characters", () => {
    for (const s of ["Fl(2) WRG 10s", "Iso W 4s", "Oc(2+1) R 15s", "LFl W 8s"]) {
      const first = parseLightCharacter(s);
      const round = parseLightCharacter(formatLightCharacter(first));
      expect(round.rhythm).toEqual(first.rhythm);
      expect(round.colors).toEqual(first.colors);
    }
  });
});

describe("rhythm compilation to a timeline", () => {
  it("Iso splits the period into equal light and dark", () => {
    const phases = compileRhythm({ cls: "Iso", groups: [], periodS: 4 });
    expect(phases).toHaveLength(2);
    expect(phases[0].on).toBe(true);
    expect(phases[0].ms).toBe(phases[1].ms);
    expect(periodMsOf(phases)).toBe(4000);
  });

  it("Fl(n) produces exactly n flashes", () => {
    const two = compileRhythm({ cls: "Fl", groups: [2], periodS: 6 });
    expect(two.filter((p) => p.on)).toHaveLength(2);
    const single = compileRhythm({ cls: "Fl", groups: [], periodS: 4 });
    expect(single.filter((p) => p.on)).toHaveLength(1);
  });

  it("Oc(n) produces exactly n eclipses and stays mostly lit", () => {
    const oc = compileRhythm({ cls: "Oc", groups: [2], periodS: 8 });
    const litMs = oc.filter((p) => p.on).reduce((a, p) => a + p.ms, 0);
    const darkMs = oc.filter((p) => !p.on).reduce((a, p) => a + p.ms, 0);
    expect(oc.filter((p) => !p.on)).toHaveLength(2); // 2 eclipses
    expect(litMs).toBeGreaterThan(darkMs);
  });

  it("F is continuous (single lit phase)", () => {
    const f = compileRhythm({ cls: "F", groups: [], periodS: null });
    expect(f).toEqual([{ on: true, ms: 3000 }]);
  });

  it("property: any feasible periodic character's phases sum to its period", () => {
    fc.assert(
      fc.property(
        fc.constantFrom("Fl", "LFl", "Oc", "Iso", "Q", "VQ" as const),
        fc.integer({ min: 1, max: 3 }),
        fc.integer({ min: 1, max: 16 }),
        (cls, group, extraS) => {
          const groups =
            cls === "Iso" || cls === "Q" || cls === "VQ" ? [] : [group];
          const rhythm = { cls: cls as "Fl", groups, periodS: 0 };
          // Choose a period at least as long as the rhythm needs (§25.3).
          const periodS = Math.ceil(minPeriodMs(rhythm) / 1000) + extraS;
          const phases = compileRhythm({ ...rhythm, periodS });
          expect(periodMsOf(phases)).toBe(periodS * 1000);
          expect(phases.every((p) => p.ms > 0)).toBe(true);
        },
      ),
    );
  });
});
