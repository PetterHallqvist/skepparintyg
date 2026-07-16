import { describe, expect, it } from "vitest";
import { gradeResponse, parseResponse } from "@/lib/grading";

describe("rules_scenario grading (SPEC §24.3 staged)", () => {
  const answerKey = {
    stages: {
      perception: "motor",
      classification: "crossing",
      rule: "give_way",
      action: "starboard",
    },
  };

  it("is correct only when every stage is right", () => {
    const r = gradeResponse({
      kind: "rules_scenario",
      answerKey,
      response: {
        answers: {
          perception: "motor",
          classification: "crossing",
          rule: "give_way",
          action: "starboard",
        },
      },
    });
    expect(r.correct).toBe(true);
    expect(r.score01).toBe(1);
  });

  it("a lucky correct action does not hide a wrong rule", () => {
    const r = gradeResponse({
      kind: "rules_scenario",
      answerKey,
      response: {
        answers: {
          perception: "motor",
          classification: "crossing",
          rule: "stand_on", // wrong
          action: "starboard", // right by luck
        },
      },
    });
    expect(r.correct).toBe(false);
    expect(r.wrongKeys).toEqual(["rule"]);
    expect(r.detail.firstWrongStage).toBe("rule");
    expect(r.score01).toBeCloseTo(0.75, 5);
  });
});

describe("light_build grading (SPEC §25.3)", () => {
  const answerKey = {
    correct: ["mast", "port", "stbd", "stern"],
    palette: {
      mast: { role: "masthead", color: "white" },
      port: { role: "sidelight_port", color: "red" },
      stbd: { role: "sidelight_starboard", color: "green" },
      stern: { role: "sternlight", color: "white" },
      anchor: { role: "allround_white", color: "white" },
    },
  };

  it("accepts the exact selection", () => {
    const r = gradeResponse({
      kind: "light_build",
      answerKey,
      response: { selected: ["stern", "mast", "port", "stbd"] },
    });
    expect(r.correct).toBe(true);
  });

  it("diagnoses a missing role and an extra role", () => {
    const r = gradeResponse({
      kind: "light_build",
      answerKey,
      response: { selected: ["mast", "port", "stbd", "anchor"] },
    });
    expect(r.correct).toBe(false);
    expect(r.detail.missingRoles).toEqual(["sternlight"]);
    expect(r.detail.extraRoles).toEqual(["allround_white"]);
    expect(r.wrongKeys).toEqual(["anchor"]);
  });
});

describe("sound_produce grading (SPEC §25.1)", () => {
  it("accepts a correctly held signal", () => {
    const r = gradeResponse({
      kind: "sound_produce",
      answerKey: { pattern: ["short", "short"] },
      response: { taps: [1000, 1050] },
    });
    expect(r.correct).toBe(true);
  });

  it("rejects the wrong rhythm", () => {
    const r = gradeResponse({
      kind: "sound_produce",
      answerKey: { pattern: ["long"] },
      response: { taps: [1000] },
    });
    expect(r.correct).toBe(false);
    expect(r.detail.firstMismatch).toBe(0);
  });
});

describe("waypoint_entry grading (SPEC §21.5)", () => {
  it("flags a transposition in the diagnostic detail", () => {
    const r = gradeResponse({
      kind: "waypoint_entry",
      answerKey: { lat: "59°20,5'N", lon: "018°03,2'E" },
      response: { lat: "59°25,0'N", lon: "018°03,2'E" },
    });
    expect(r.correct).toBe(false);
    expect(r.detail.transposedLat).toBe(true);
  });
});

describe("parseResponse routes the new kinds", () => {
  it("accepts well-formed trainer responses", () => {
    expect(parseResponse("waypoint_entry", { lat: "1", lon: "2" })).toEqual({
      lat: "1",
      lon: "2",
    });
    expect(parseResponse("sound_produce", { taps: [1] })).toEqual({
      taps: [1],
    });
  });

  it("rejects malformed trainer responses (§58.4)", () => {
    expect(() => parseResponse("sound_produce", { taps: ["x"] })).toThrow();
    expect(() => parseResponse("waypoint_entry", { lat: 1 })).toThrow();
  });
});
