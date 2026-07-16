import { describe, expect, it } from "vitest";
import fc from "fast-check";
import {
  applySetAndDrift,
  bearingRayIntersection,
  distanceNm,
  lineIntersection,
  normalizeDeg,
  pointFromCourseDistance,
  pointToSegmentDistanceNm,
  polygonContains,
  polylineLengthNm,
  routeIntersectsHazard,
  shortestAngularDeltaDeg,
  speedFromDistanceTime,
  timeMinutes,
  trueCourseDeg,
  underKeelClearance,
} from "@/lib/chart/geometry";
import {
  compassFromTrue,
  interpolateDeviation,
  trueFromCompass,
  type DeviationPoint,
} from "@/lib/chart/compass";

/** The SPEC §20.4 example table (fictional). */
const TABLE: DeviationPoint[] = [
  { compassDeg: 0, deviationDeg: -3 },
  { compassDeg: 45, deviationDeg: -1 },
  { compassDeg: 90, deviationDeg: 2 },
  { compassDeg: 135, deviationDeg: 4 },
  { compassDeg: 180, deviationDeg: 3 },
  { compassDeg: 225, deviationDeg: 0 },
  { compassDeg: 270, deviationDeg: -2 },
  { compassDeg: 315, deviationDeg: -4 },
  { compassDeg: 360, deviationDeg: -3 },
];

describe("angles (SPEC §20.7 wrap cases)", () => {
  it("normalizes the 0/360 wrap", () => {
    expect(normalizeDeg(360)).toBe(0);
    expect(normalizeDeg(-1)).toBe(359);
    expect(normalizeDeg(725)).toBe(5);
    expect(normalizeDeg(0)).toBe(0);
  });

  it("359° vs 1° differ by 2°, not 358°", () => {
    expect(shortestAngularDeltaDeg(359, 1)).toBe(2);
    expect(shortestAngularDeltaDeg(1, 359)).toBe(-2);
  });

  it("property: delta is always in (-180, 180] and consistent", () => {
    fc.assert(
      fc.property(
        fc.double({ min: -720, max: 720, noNaN: true }),
        fc.double({ min: -720, max: 720, noNaN: true }),
        (a, b) => {
          const d = shortestAngularDeltaDeg(a, b);
          expect(d).toBeGreaterThan(-180 - 1e-9);
          expect(d).toBeLessThanOrEqual(180 + 1e-9);
          expect(normalizeDeg(a + d)).toBeCloseTo(normalizeDeg(b), 6);
        },
      ),
    );
  });
});

describe("courses and distances", () => {
  it("cardinal directions in screen space (+y = south)", () => {
    const o = { x: 100, y: 100 };
    expect(trueCourseDeg(o, { x: 100, y: 0 })).toBeCloseTo(0);
    expect(trueCourseDeg(o, { x: 200, y: 100 })).toBeCloseTo(90);
    expect(trueCourseDeg(o, { x: 100, y: 200 })).toBeCloseTo(180);
    expect(trueCourseDeg(o, { x: 0, y: 100 })).toBeCloseTo(270);
  });

  it("zero distance throws instead of returning garbage", () => {
    expect(() => trueCourseDeg({ x: 1, y: 1 }, { x: 1, y: 1 })).toThrow(
      /zero_distance/,
    );
  });

  it("property: course + distance roundtrip recovers the target point", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 359.99, noNaN: true }),
        fc.double({ min: 0.05, max: 50, noNaN: true }),
        (course, dist) => {
          const from = { x: 500, y: 500 };
          const to = pointFromCourseDistance(from, course, dist, 50);
          expect(distanceNm(from, to, 50)).toBeCloseTo(dist, 6);
          expect(
            Math.abs(shortestAngularDeltaDeg(trueCourseDeg(from, to), course)),
          ).toBeLessThan(1e-6);
        },
      ),
    );
  });
});

describe("speed–time–distance", () => {
  it("6.0 M at 5.0 kn = 72 minutes", () => {
    expect(timeMinutes(6, 5)).toBeCloseTo(72);
  });
  it("rejects invalid speed/time (§20.7)", () => {
    expect(() => timeMinutes(6, 0)).toThrow(/invalid_speed/);
    expect(() => speedFromDistanceTime(6, 0)).toThrow(/invalid_time/);
  });
});

describe("intersections", () => {
  it("perpendicular lines intersect where expected", () => {
    const p = lineIntersection(
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 5, y: -5 },
      { x: 5, y: 5 },
    );
    expect(p).toEqual({ x: 5, y: 0 });
  });

  it("parallel and coincident bearings return null (§20.7)", () => {
    expect(
      lineIntersection(
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 0, y: 5 },
        { x: 10, y: 5 },
      ),
    ).toBeNull();
    expect(
      bearingRayIntersection(
        { origin: { x: 0, y: 0 }, bearingDeg: 90 },
        { origin: { x: 0, y: 10 }, bearingDeg: 90 },
      ),
    ).toBeNull();
  });

  it("cross bearings fix a position; behind-origin intersections rejected", () => {
    const fix = bearingRayIntersection(
      { origin: { x: 0, y: 100 }, bearingDeg: 90 },
      { origin: { x: 100, y: 200 }, bearingDeg: 0 },
    );
    expect(fix?.x).toBeCloseTo(100);
    expect(fix?.y).toBeCloseTo(100);

    expect(
      bearingRayIntersection(
        { origin: { x: 0, y: 100 }, bearingDeg: 270 },
        { origin: { x: 100, y: 200 }, bearingDeg: 0 },
      ),
    ).toBeNull();
  });
});

describe("polygons and routes (§20.7 touch vs cross)", () => {
  const hazard = [
    { x: 100, y: 100 },
    { x: 200, y: 100 },
    { x: 200, y: 200 },
    { x: 100, y: 200 },
  ];

  it("points on the edge count as inside", () => {
    expect(polygonContains({ x: 150, y: 100 }, hazard)).toBe(true);
    expect(polygonContains({ x: 150, y: 150 }, hazard)).toBe(true);
    expect(polygonContains({ x: 99, y: 150 }, hazard)).toBe(false);
  });

  it("route crossing the hazard is flagged; clear route is not", () => {
    expect(
      routeIntersectsHazard(
        [
          { x: 50, y: 150 },
          { x: 250, y: 150 },
        ],
        hazard,
      ),
    ).toBe(true);
    expect(
      routeIntersectsHazard(
        [
          { x: 50, y: 50 },
          { x: 250, y: 50 },
        ],
        hazard,
      ),
    ).toBe(false);
  });

  it("route TOUCHING the hazard edge is flagged (touch = unsafe)", () => {
    expect(
      routeIntersectsHazard(
        [
          { x: 50, y: 100 },
          { x: 250, y: 100 },
        ],
        hazard,
      ),
    ).toBe(true);
  });

  it("polyline length sums legs", () => {
    expect(
      polylineLengthNm(
        [
          { x: 0, y: 0 },
          { x: 50, y: 0 },
          { x: 50, y: 100 },
        ],
        50,
      ),
    ).toBeCloseTo(3);
  });

  it("point-to-segment distance handles degenerate segments", () => {
    expect(
      pointToSegmentDistanceNm(
        { x: 3, y: 4 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        1,
      ),
    ).toBeCloseTo(5);
  });
});

describe("deviation interpolation (§20.7: 315–360–0–45 wrap)", () => {
  it("matches table nodes exactly", () => {
    expect(interpolateDeviation(TABLE, 90)).toBeCloseTo(2);
    expect(interpolateDeviation(TABLE, 315)).toBeCloseTo(-4);
  });
  it("interpolates linearly between nodes", () => {
    expect(interpolateDeviation(TABLE, 22.5)).toBeCloseTo(-2);
    expect(interpolateDeviation(TABLE, 337.5)).toBeCloseTo(-3.5);
  });
  it("wraps 360→0 continuously", () => {
    expect(interpolateDeviation(TABLE, 359.9)).toBeCloseTo(
      interpolateDeviation(TABLE, 0.1),
      1,
    );
  });
});

describe("compass chain (§20.6)", () => {
  it("compass → true with west deviation and east variation", () => {
    // K 0° har deviation −3 → M 357; variation +6 → T 3.
    expect(trueFromCompass(0, 6, TABLE)).toBeCloseTo(3);
  });

  it("property: compassFromTrue inverts trueFromCompass within 0.2°", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 359.99, noNaN: true }),
        fc.double({ min: -10, max: 10, noNaN: true }),
        (compass, variation) => {
          const t = trueFromCompass(compass, variation, TABLE);
          const back = compassFromTrue(t, variation, TABLE);
          expect(back.ok).toBe(true);
          if (back.ok) {
            expect(
              Math.abs(shortestAngularDeltaDeg(back.compassDeg, compass)),
            ).toBeLessThan(0.2);
          }
        },
      ),
      { numRuns: 300 },
    );
  });

  it("returns an error result (never throws) on a pathological table", () => {
    const evil: DeviationPoint[] = [
      { compassDeg: 0, deviationDeg: 15 },
      { compassDeg: 180, deviationDeg: -15 },
      { compassDeg: 360, deviationDeg: 15 },
    ];
    const result = compassFromTrue(90, 0, evil);
    expect(typeof result.ok).toBe("boolean");
  });
});

describe("set/drift and clearance", () => {
  it("beam current from starboard pushes course over ground east of heading", () => {
    const r = applySetAndDrift({
      courseDeg: 0,
      speedKn: 5,
      setDeg: 90,
      driftKn: 2,
    });
    expect(r.courseOverGroundDeg).toBeGreaterThan(0);
    expect(r.courseOverGroundDeg).toBeLessThan(90);
    expect(r.speedOverGroundKn).toBeCloseTo(Math.hypot(5, 2), 5);
  });

  it("set/drift works in all quadrants (§20.7)", () => {
    for (const set of [45, 135, 225, 315]) {
      const r = applySetAndDrift({
        courseDeg: 0,
        speedKn: 5,
        setDeg: set,
        driftKn: 1,
      });
      expect(r.speedOverGroundKn).toBeGreaterThan(0);
      expect(r.courseOverGroundDeg).toBeGreaterThanOrEqual(0);
      expect(r.courseOverGroundDeg).toBeLessThan(360);
    }
  });

  it("under-keel clearance", () => {
    expect(
      underKeelClearance({ chartedDepthM: 3, draughtM: 1.2, safetyMarginM: 1 }),
    ).toEqual({ clearanceM: 1.8, safe: true });
    expect(
      underKeelClearance({ chartedDepthM: 2, draughtM: 1.2, safetyMarginM: 1 })
        .safe,
    ).toBe(false);
  });
});
