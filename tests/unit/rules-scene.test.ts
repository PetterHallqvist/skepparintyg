import { describe, expect, it } from "vitest";
import {
  describeSceneSv,
  lightConfigFor,
  projectScene,
  sceneSchema,
  type Scene,
} from "@/lib/trainers/rules-schema";

const scene: Scene = {
  environment: "day",
  vessels: [
    { id: "own", kind: "power", label_sv: "Du", x: 100, y: 160, headingDeg: 0, speed: 10, isOwn: true, status: "underway" },
    { id: "a", kind: "sailing", label_sv: "S/Y", x: 20, y: 100, headingDeg: 90, speed: 10, status: "underway" },
    { id: "anch", kind: "power", label_sv: "Ankar", x: 100, y: 60, headingDeg: 0, speed: 0, status: "anchored" },
  ],
};

describe("projectScene (SPEC §24.1)", () => {
  it("leaves positions unchanged at t = 0", () => {
    const p = projectScene(scene, 0);
    expect(p[0]).toMatchObject({ x: 100, y: 160 });
  });

  it("moves a north-heading vessel up (−y)", () => {
    const p = projectScene(scene, 2);
    expect(p[0].y).toBeCloseTo(160 - 20, 5);
    expect(p[0].x).toBeCloseTo(100, 5);
  });

  it("moves an east-heading vessel right (+x)", () => {
    const p = projectScene(scene, 2);
    expect(p[1].x).toBeCloseTo(20 + 20, 5);
    expect(p[1].y).toBeCloseTo(100, 5);
  });

  it("does not move an anchored vessel", () => {
    const p = projectScene(scene, 5);
    expect(p[2]).toMatchObject({ x: 100, y: 60 });
  });
});

describe("scene helpers", () => {
  it("describes the scene as text (§24.4 alternative)", () => {
    const lines = describeSceneSv(scene);
    expect(lines[0]).toMatch(/Dager/);
    expect(lines.some((l) => /Ditt fartyg/.test(l))).toBe(true);
  });

  it("maps status to the right §25.3 light configuration", () => {
    expect(lightConfigFor(scene.vessels[1])).toBe("sailing_underway");
    expect(lightConfigFor(scene.vessels[2])).toBe("anchor");
  });

  it("validates a well-formed scene", () => {
    expect(() => sceneSchema.parse(scene)).not.toThrow();
  });
});
