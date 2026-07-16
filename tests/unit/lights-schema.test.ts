import { describe, expect, it } from "vitest";
import {
  compareLightSets,
  VESSEL_LIGHTS,
  type LightDescriptor,
} from "@/lib/lights/schema";

const desc = (set: { role: string; color: string }[]): LightDescriptor[] =>
  set as LightDescriptor[];

describe("compareLightSets (SPEC §25.3 light_build grading)", () => {
  const powerTarget = desc([
    { role: "masthead", color: "white" },
    { role: "sidelight_port", color: "red" },
    { role: "sidelight_starboard", color: "green" },
    { role: "sternlight", color: "white" },
  ]);

  it("accepts the exact set regardless of order", () => {
    const built = [...powerTarget].reverse();
    expect(compareLightSets(powerTarget, built).correct).toBe(true);
  });

  it("reports a missing role", () => {
    const built = powerTarget.slice(0, 3); // drop the sternlight
    const cmp = compareLightSets(powerTarget, built);
    expect(cmp.correct).toBe(false);
    expect(cmp.missing.map((d) => d.role)).toEqual(["sternlight"]);
  });

  it("reports an extra role", () => {
    const built = [
      ...powerTarget,
      { role: "allround_white", color: "white" } as LightDescriptor,
    ];
    const cmp = compareLightSets(powerTarget, built);
    expect(cmp.correct).toBe(false);
    expect(cmp.extra.map((d) => d.role)).toEqual(["allround_white"]);
  });

  it("reports a wrong colour (swapped sidelights)", () => {
    const built = desc([
      { role: "masthead", color: "white" },
      { role: "sidelight_port", color: "green" }, // should be red
      { role: "sidelight_starboard", color: "green" },
      { role: "sternlight", color: "white" },
    ]);
    const cmp = compareLightSets(powerTarget, built);
    expect(cmp.correct).toBe(false);
    expect(cmp.wrongColor).toEqual([
      { role: "sidelight_port", expected: "red", got: "green" },
    ]);
  });

  it("the standard vessel configs are internally consistent", () => {
    const power = VESSEL_LIGHTS.power_underway.map((l) => ({
      role: l.role,
      color: l.color,
    }));
    expect(compareLightSets(power, power).correct).toBe(true);
    // A sailing vessel is a power-driven vessel minus the masthead light.
    const sailing = VESSEL_LIGHTS.sailing_underway.map((l) => l.role);
    expect(sailing).not.toContain("masthead");
  });
});
