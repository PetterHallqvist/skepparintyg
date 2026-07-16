/**
 * Coordinate entry + transposition check for the electronic-chart plotter tasks
 * (SPEC §21.5 #33). Pure. A waypoint is entered as two strings (lat, lon); the
 * grader parses them to degrees/minutes/hemisphere and, on a miss, checks
 * whether the learner simply transposed digits — the classic GNSS entry error
 * the task is designed to teach.
 */

export type Coord = { deg: number; min: number; hemi: "N" | "S" | "E" | "W" };

const COORD_RE = /^(\d{1,3})\s*[°:\s]\s*(\d{1,2}(?:[.,]\d+)?)\s*['′:\s]*\s*([NSEWnsew])$/;

/** Parse "59°20,5'N" / "59 20.5 N" / "018:03.2 E" → Coord, or null. */
export function parseCoord(raw: string): Coord | null {
  const m = COORD_RE.exec(raw.trim());
  if (!m) return null;
  const deg = Number(m[1]);
  const min = Number(m[2].replace(",", "."));
  if (min >= 60) return null;
  return { deg, min, hemi: m[3].toUpperCase() as Coord["hemi"] };
}

const MINUTE_TOLERANCE = 0.05;

/** Coordinates match to within 0.05′ and the same hemisphere. */
export function coordsEqual(a: Coord, b: Coord): boolean {
  return (
    a.hemi === b.hemi &&
    a.deg === b.deg &&
    Math.abs(a.min - b.min) <= MINUTE_TOLERANCE + 1e-9
  );
}

const digitsOf = (s: string): string => s.replace(/\D/g, "");
const sortDigits = (s: string): string => s.split("").sort().join("");

/**
 * True when `actual` uses the same digits as `expected` in a different order —
 * i.e. a transposition rather than a genuinely different position.
 */
export function isTransposition(expected: string, actual: string): boolean {
  const de = digitsOf(expected);
  const da = digitsOf(actual);
  if (de.length === 0 || de === da) return false;
  return sortDigits(de) === sortDigits(da);
}

export type WaypointGrade = {
  correct: boolean;
  latOk: boolean;
  lonOk: boolean;
  /** A parseable value whose digits were transposed against the target. */
  transposedLat: boolean;
  transposedLon: boolean;
  /** Either field could not be parsed as a coordinate. */
  malformed: boolean;
};

export function gradeWaypoint(
  expected: { lat: string; lon: string },
  actual: { lat: string; lon: string },
): WaypointGrade {
  const el = parseCoord(expected.lat);
  const eo = parseCoord(expected.lon);
  const al = parseCoord(actual.lat);
  const ao = parseCoord(actual.lon);

  const latOk = !!el && !!al && coordsEqual(el, al);
  const lonOk = !!eo && !!ao && coordsEqual(eo, ao);

  return {
    correct: latOk && lonOk,
    latOk,
    lonOk,
    transposedLat: !latOk && isTransposition(expected.lat, actual.lat),
    transposedLon: !lonOk && isTransposition(expected.lon, actual.lon),
    malformed: !al || !ao,
  };
}
