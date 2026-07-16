import { normalizeDeg, shortestAngularDeltaDeg } from "./geometry";

/**
 * Compass mathematics (SPEC §20.6): variation/deviation east positive, west
 * negative (§20.5). Conversion chain: kompasskurs (K) + deviation = magnetisk
 * kurs (M); M + variation = sann kurs (T).
 */

export type DeviationPoint = { compassDeg: number; deviationDeg: number };

/**
 * Linear interpolation in a deviation table, correct across the 315–360–0–45
 * wrap. The table must cover [0, 360] (first and last rows typically equal).
 */
export function interpolateDeviation(
  table: DeviationPoint[],
  compassDeg: number,
): number {
  if (table.length === 0) throw new Error("empty_deviation_table");
  const sorted = [...table].sort((a, b) => a.compassDeg - b.compassDeg);
  const c = normalizeDeg(compassDeg);

  let lower = sorted[sorted.length - 1];
  let upper = sorted[0];
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].compassDeg <= c) lower = sorted[i];
    if (sorted[i].compassDeg >= c) {
      upper = sorted[i];
      break;
    }
  }

  if (lower.compassDeg === upper.compassDeg) return lower.deviationDeg;

  // Wrap segment (e.g. 315 → 360/0)
  let span = upper.compassDeg - lower.compassDeg;
  let offset = c - lower.compassDeg;
  if (span < 0) {
    span += 360;
    if (offset < 0) offset += 360;
  }
  const t = offset / span;
  return lower.deviationDeg + t * (upper.deviationDeg - lower.deviationDeg);
}

export function magneticFromCompass(
  compassDeg: number,
  deviationDeg: number,
): number {
  return normalizeDeg(compassDeg + deviationDeg);
}

export function trueFromMagnetic(
  magneticDeg: number,
  variationDeg: number,
): number {
  return normalizeDeg(magneticDeg + variationDeg);
}

export function trueFromCompass(
  compassDeg: number,
  variationDeg: number,
  table: DeviationPoint[],
): number {
  return trueFromMagnetic(
    magneticFromCompass(compassDeg, interpolateDeviation(table, compassDeg)),
    variationDeg,
  );
}

/**
 * Inverse chain (§20.6): deviation depends on the UNKNOWN compass course, so
 * solve by bounded fixed-point iteration. Returns an error result instead of
 * throwing — a non-converging table must never crash a learner session.
 */
export function compassFromTrue(
  trueDeg: number,
  variationDeg: number,
  table: DeviationPoint[],
): { ok: true; compassDeg: number } | { ok: false; error: string } {
  const magnetic = normalizeDeg(trueDeg - variationDeg);
  let compass = magnetic; // start: assume zero deviation

  for (let i = 0; i < 50; i++) {
    const dev = interpolateDeviation(table, compass);
    const next = normalizeDeg(magnetic - dev);
    if (Math.abs(shortestAngularDeltaDeg(compass, next)) < 0.01) {
      // Verify the roundtrip.
      const check = magneticFromCompass(
        next,
        interpolateDeviation(table, next),
      );
      if (Math.abs(shortestAngularDeltaDeg(check, magnetic)) < 0.1) {
        return { ok: true, compassDeg: next };
      }
    }
    compass = next;
  }
  return { ok: false, error: "deviation_iteration_no_convergence" };
}
