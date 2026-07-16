/**
 * Pure chart mathematics (SPEC §20.6). Screen coordinates: +x east, +y south;
 * north vector (0,-1); bearings clockwise from north in [0, 360); distances
 * via uniform pxPerNm (§20.5). No React, no IO — property-tested (§20.7).
 */

export type Point = { x: number; y: number };
export type BearingRay = { origin: Point; bearingDeg: number };

const EPS = 1e-9;

export function normalizeDeg(value: number): number {
  let v = value % 360;
  if (v < 0) v += 360;
  // Tiny negatives can round v+360 to exactly 360 — clamp back into [0, 360).
  return v >= 360 || Object.is(v, -0) ? 0 : v;
}

/** Signed shortest delta a→b in (-180, 180]. */
export function shortestAngularDeltaDeg(a: number, b: number): number {
  const d = normalizeDeg(b) - normalizeDeg(a);
  if (d > 180) return d - 360;
  if (d <= -180) return d + 360;
  return d;
}

export function distancePx(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function distanceNm(a: Point, b: Point, pxPerNm: number): number {
  if (pxPerNm <= 0) throw new Error("invalid_px_per_nm");
  return distancePx(a, b) / pxPerNm;
}

/** True course from a to b; 0° = north (screen up), 90° = east. */
export function trueCourseDeg(from: Point, to: Point): number {
  if (Math.abs(to.x - from.x) < EPS && Math.abs(to.y - from.y) < EPS) {
    throw new Error("zero_distance_course");
  }
  return normalizeDeg(
    (Math.atan2(to.x - from.x, -(to.y - from.y)) * 180) / Math.PI,
  );
}

export function pointFromCourseDistance(
  from: Point,
  courseDeg: number,
  distanceNmValue: number,
  pxPerNm: number,
): Point {
  const rad = (normalizeDeg(courseDeg) * Math.PI) / 180;
  const px = distanceNmValue * pxPerNm;
  return {
    x: from.x + Math.sin(rad) * px,
    y: from.y - Math.cos(rad) * px,
  };
}

// ---------------------------------------------------------------------------
// Speed – time – distance
// ---------------------------------------------------------------------------

export function timeHours(distanceNmValue: number, speedKn: number): number {
  if (speedKn <= 0) throw new Error("invalid_speed");
  if (distanceNmValue < 0) throw new Error("invalid_distance");
  return distanceNmValue / speedKn;
}

export function timeMinutes(distanceNmValue: number, speedKn: number): number {
  return timeHours(distanceNmValue, speedKn) * 60;
}

export function distanceFromSpeedTime(speedKn: number, hours: number): number {
  if (speedKn < 0 || hours < 0) throw new Error("invalid_input");
  return speedKn * hours;
}

export function speedFromDistanceTime(
  distanceNmValue: number,
  hours: number,
): number {
  if (hours <= 0) throw new Error("invalid_time");
  if (distanceNmValue < 0) throw new Error("invalid_distance");
  return distanceNmValue / hours;
}

// ---------------------------------------------------------------------------
// Lines, segments, polygons
// ---------------------------------------------------------------------------

/** Intersection of infinite lines a1–a2 and b1–b2; null when parallel. */
export function lineIntersection(
  a1: Point,
  a2: Point,
  b1: Point,
  b2: Point,
): Point | null {
  const d1x = a2.x - a1.x;
  const d1y = a2.y - a1.y;
  const d2x = b2.x - b1.x;
  const d2y = b2.y - b1.y;
  const denom = d1x * d2y - d1y * d2x;
  if (Math.abs(denom) < EPS) return null;
  const t = ((b1.x - a1.x) * d2y - (b1.y - a1.y) * d2x) / denom;
  return { x: a1.x + t * d1x, y: a1.y + t * d1y };
}

/**
 * Cross-bearing fix (§21.4): intersection of two bearing RAYS (forward along
 * each bearing only). Null for parallel/coincident or behind-origin cases.
 */
export function bearingRayIntersection(
  fix1: BearingRay,
  fix2: BearingRay,
): Point | null {
  const p1 = fix1.origin;
  const p2 = pointFromCourseDistance(p1, fix1.bearingDeg, 1, 1000);
  const q1 = fix2.origin;
  const q2 = pointFromCourseDistance(q1, fix2.bearingDeg, 1, 1000);

  const point = lineIntersection(p1, p2, q1, q2);
  if (!point) return null;

  const along = (o: Point, dir: Point, pt: Point) =>
    (pt.x - o.x) * (dir.x - o.x) + (pt.y - o.y) * (dir.y - o.y);
  if (along(p1, p2, point) < -EPS || along(q1, q2, point) < -EPS) return null;
  return point;
}

export function closestPointOnSegment(point: Point, a: Point, b: Point): Point {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const len2 = abx * abx + aby * aby;
  if (len2 < EPS) return { ...a };
  const t = Math.max(
    0,
    Math.min(1, ((point.x - a.x) * abx + (point.y - a.y) * aby) / len2),
  );
  return { x: a.x + t * abx, y: a.y + t * aby };
}

export function pointToSegmentDistanceNm(
  point: Point,
  a: Point,
  b: Point,
  pxPerNm: number,
): number {
  return distanceNm(point, closestPointOnSegment(point, a, b), pxPerNm);
}

export function polylineLengthNm(points: Point[], pxPerNm: number): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += distanceNm(points[i - 1], points[i], pxPerNm);
  }
  return total;
}

/** Ray-casting containment; points exactly on an edge count as inside. */
export function polygonContains(point: Point, polygon: Point[]): boolean {
  if (polygon.length < 3) return false;

  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i];
    const b = polygon[(i + 1) % polygon.length];
    const onSegment =
      distancePx(point, closestPointOnSegment(point, a, b)) < 1e-6;
    if (onSegment) return true;
  }

  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const pi = polygon[i];
    const pj = polygon[j];
    const intersects =
      pi.y > point.y !== pj.y > point.y &&
      point.x < ((pj.x - pi.x) * (point.y - pi.y)) / (pj.y - pi.y) + pi.x;
    if (intersects) inside = !inside;
  }
  return inside;
}

function segmentsIntersect(
  a1: Point,
  a2: Point,
  b1: Point,
  b2: Point,
): boolean {
  const orient = (p: Point, q: Point, r: Point) => {
    const v = (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
    if (Math.abs(v) < EPS) return 0;
    return v > 0 ? 1 : -1;
  };
  const onSeg = (p: Point, q: Point, r: Point) =>
    Math.min(p.x, r.x) - EPS <= q.x &&
    q.x <= Math.max(p.x, r.x) + EPS &&
    Math.min(p.y, r.y) - EPS <= q.y &&
    q.y <= Math.max(p.y, r.y) + EPS;

  const o1 = orient(a1, a2, b1);
  const o2 = orient(a1, a2, b2);
  const o3 = orient(b1, b2, a1);
  const o4 = orient(b1, b2, a2);

  if (o1 !== o2 && o3 !== o4) return true;
  if (o1 === 0 && onSeg(a1, b1, a2)) return true;
  if (o2 === 0 && onSeg(a1, b2, a2)) return true;
  if (o3 === 0 && onSeg(b1, a1, b2)) return true;
  if (o4 === 0 && onSeg(b1, a2, b2)) return true;
  return false;
}

/** Route legs crossing or touching a hazard polygon (§21.4 route safety). */
export function routeIntersectsHazard(
  route: Point[],
  hazard: Point[],
): boolean {
  if (route.length === 0 || hazard.length < 3) return false;
  for (const p of route) {
    if (polygonContains(p, hazard)) return true;
  }
  for (let i = 1; i < route.length; i++) {
    for (let j = 0; j < hazard.length; j++) {
      if (
        segmentsIntersect(
          route[i - 1],
          route[i],
          hazard[j],
          hazard[(j + 1) % hazard.length],
        )
      ) {
        return true;
      }
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// Under-keel clearance & set/drift (fictional teaching simplifications)
// ---------------------------------------------------------------------------

export type ClearanceInput = {
  chartedDepthM: number;
  draughtM: number;
  safetyMarginM: number;
};
export type ClearanceResult = { clearanceM: number; safe: boolean };

export function underKeelClearance(params: ClearanceInput): ClearanceResult {
  const clearance = params.chartedDepthM - params.draughtM;
  return {
    clearanceM: Number(clearance.toFixed(2)),
    safe: clearance >= params.safetyMarginM,
  };
}

export type SetDriftInput = {
  courseDeg: number;
  speedKn: number;
  setDeg: number;
  driftKn: number;
};
export type SetDriftResult = {
  courseOverGroundDeg: number;
  speedOverGroundKn: number;
};

/** Vector sum of vessel velocity and current (§21.4 set & drift). */
export function applySetAndDrift(params: SetDriftInput): SetDriftResult {
  const toVec = (deg: number, mag: number) => ({
    x: Math.sin((normalizeDeg(deg) * Math.PI) / 180) * mag,
    y: -Math.cos((normalizeDeg(deg) * Math.PI) / 180) * mag,
  });
  const v = toVec(params.courseDeg, params.speedKn);
  const c = toVec(params.setDeg, params.driftKn);
  const sum = { x: v.x + c.x, y: v.y + c.y };
  const speed = Math.hypot(sum.x, sum.y);
  return {
    courseOverGroundDeg:
      speed < EPS
        ? 0
        : normalizeDeg((Math.atan2(sum.x, -sum.y) * 180) / Math.PI),
    speedOverGroundKn: speed,
  };
}
