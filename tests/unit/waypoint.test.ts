import { describe, expect, it } from "vitest";
import {
  coordsEqual,
  gradeWaypoint,
  isTransposition,
  parseCoord,
} from "@/lib/chart/waypoint";

describe("coordinate parsing + equality (SPEC §21.5)", () => {
  it("parses several notations", () => {
    expect(parseCoord("59°20,5'N")).toEqual({ deg: 59, min: 20.5, hemi: "N" });
    expect(parseCoord("018 03.2 E")).toEqual({ deg: 18, min: 3.2, hemi: "E" });
    expect(parseCoord("bad")).toBeNull();
    expect(parseCoord("10°75'N")).toBeNull(); // minutes ≥ 60
  });

  it("matches within a 0.05′ tolerance and same hemisphere", () => {
    const a = parseCoord("59°20,5'N")!;
    expect(coordsEqual(a, parseCoord("59°20,53'N")!)).toBe(true);
    expect(coordsEqual(a, parseCoord("59°20,5'S")!)).toBe(false);
    expect(coordsEqual(a, parseCoord("59°21,0'N")!)).toBe(false);
  });
});

describe("isTransposition (§21.5 #33)", () => {
  it("detects swapped digits", () => {
    expect(isTransposition("59°20,5'N", "59°25,0'N")).toBe(true);
    expect(isTransposition("59°20,5'N", "95°20,5'N")).toBe(true);
  });

  it("is not triggered by identical or genuinely different digits", () => {
    expect(isTransposition("59°20,5'N", "59°20,5'N")).toBe(false);
    expect(isTransposition("59°20,5'N", "60°11,1'N")).toBe(false);
  });
});

describe("gradeWaypoint", () => {
  const target = { lat: "59°20,5'N", lon: "018°03,2'E" };

  it("accepts an exact entry", () => {
    expect(gradeWaypoint(target, { ...target }).correct).toBe(true);
  });

  it("flags a transposed latitude", () => {
    const g = gradeWaypoint(target, { lat: "59°25,0'N", lon: "018°03,2'E" });
    expect(g.correct).toBe(false);
    expect(g.transposedLat).toBe(true);
    expect(g.lonOk).toBe(true);
  });

  it("flags malformed input", () => {
    const g = gradeWaypoint(target, { lat: "??", lon: "018°03,2'E" });
    expect(g.malformed).toBe(true);
    expect(g.correct).toBe(false);
  });
});
