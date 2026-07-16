/**
 * Light-character ("fyrkaraktär") engine (SPEC §25.3). Parses IALA light
 * notation into a semantic rhythm and compiles it to a deterministic on/off
 * timeline for exactly one period. Pure — no DOM, no time source — so the
 * lights trainer, the rules-of-the-road night scenes, and the unit tests all
 * drive rendering from the same data.
 *
 * Supported classes (the Förarintyg subset, §28.4):
 *   F    fast sken            — continuous light
 *   Fl   blixt               — flash: light shorter than dark
 *   LFl  långblixt           — long flash (≥ 2 s lit)
 *   Oc   förmörkelse         — occulting: light longer than dark
 *   Iso  isofas              — equal light and dark
 *   Q    snabbblink          — quick
 *   VQ   mycket snabb blink  — very quick
 * with optional groups (Fl(2), Oc(2+1)), colours (W R G Y, sectored as WRG),
 * and a period in seconds (10s).
 */

export type RhythmClass = "F" | "Fl" | "LFl" | "Oc" | "Iso" | "Q" | "VQ";
export type LightColorCode = "W" | "R" | "G" | "Y";

export type LightRhythm = {
  cls: RhythmClass;
  /** Flash/eclipse groups: [] continuous or single, [2] for Fl(2), [2,1] composite. */
  groups: number[];
  /** Total period in seconds; null for F (continuous) or when unspecified. */
  periodS: number | null;
};

export type LightCharacter = {
  rhythm: LightRhythm;
  /** Sectored colours in order, e.g. ["W","R","G"] for a WRG sector light. */
  colors: LightColorCode[];
  /** Nominal range in nautical miles, when stated (e.g. "…10M"). */
  rangeNm: number | null;
  raw: string;
};

/** One slice of the compiled timeline. */
export type LightPhase = { on: boolean; ms: number };

// Timing model (ms). Chosen so a single period reads clearly at 1× speed;
// exact values are teaching aesthetics — the tested invariants are the phase
// counts and that the phases sum to the period.
const FLASH_MS = 400; // a lit flash inside a Fl/Q group
const FLASH_GAP_MS = 600; // dark between flashes in one group
const GROUP_GAP_MS = 1200; // dark between groups in a composite character
const LONG_FLASH_MS = 2000; // LFl lit duration
const ECLIPSE_MS = 500; // a dark eclipse inside an Oc character
const LIT_GAP_MS = 600; // lit between eclipses in one group
const QUICK_UNIT_MS = 300; // Q on/off unit
const VQUICK_UNIT_MS = 150; // VQ on/off unit
const MIN_ECLIPSE_MS = 500; // shortest dark/lit remainder that still reads

const DEFAULT_PERIOD_MS = 4000;
const CONTINUOUS_MS = 3000; // nominal window for F / periodless quick

const CLASS_TOKENS: RhythmClass[] = ["LFl", "Fl", "Oc", "Iso", "VQ", "Q", "F"];

const CHARACTER_RE =
  /^(LFl|Fl|Oc|Iso|VQ|Q|F)(?:\(([\d+]+)\))?\s*([WRGY]+)?\s*(?:(\d+(?:[.,]\d+)?)\s*s)?\s*(?:(\d+(?:[.,]\d+)?)\s*M)?$/i;

function num(raw: string): number {
  return Number(raw.replace(",", "."));
}

/** Parse a light character like `Fl(2) WRG 10s`. Throws on unrecognised input. */
export function parseLightCharacter(raw: string): LightCharacter {
  const trimmed = raw.trim();
  const m = CHARACTER_RE.exec(trimmed);
  if (!m) throw new Error(`unparsable_light_character: ${raw}`);

  const cls = CLASS_TOKENS.find(
    (t) => t.toLowerCase() === m[1].toLowerCase(),
  ) as RhythmClass;
  const groups = m[2] ? m[2].split("+").map((g) => Number(g)) : [];
  const colors = (m[3] ? m[3].toUpperCase().split("") : ["W"]) as
    LightColorCode[];
  const periodS = m[4] !== undefined ? num(m[4]) : null;
  const rangeNm = m[5] !== undefined ? num(m[5]) : null;

  return { rhythm: { cls, groups, periodS }, colors, rangeNm, raw: trimmed };
}

/** Canonical string form — round-trips with parseLightCharacter. */
export function formatLightCharacter(c: LightCharacter): string {
  const { cls, groups, periodS } = c.rhythm;
  const grp = groups.length > 0 ? `(${groups.join("+")})` : "";
  const parts = [`${cls}${grp}`];
  if (c.colors.length > 0) parts.push(c.colors.join(""));
  if (periodS !== null) parts.push(`${trimZero(periodS)}s`);
  if (c.rangeNm !== null) parts.push(`${trimZero(c.rangeNm)}M`);
  return parts.join(" ");
}

function trimZero(n: number): string {
  return Number.isInteger(n) ? String(n) : String(n).replace(".", ",");
}

const totalFlashes = (groups: number[]): number =>
  groups.length === 0 ? 1 : groups.reduce((a, b) => a + b, 0);

/** Lit + gap time of the flash portion (everything but the final eclipse). */
function flashFixedMs(groups: number[], flashMs: number): number {
  const g = groups.length === 0 ? [1] : groups;
  let fixed = 0;
  g.forEach((count, gi) => {
    for (let i = 0; i < count; i++) {
      fixed += flashMs;
      const lastFlashOfGroup = i === count - 1;
      const lastGroup = gi === g.length - 1;
      if (lastFlashOfGroup && lastGroup) continue;
      fixed += lastFlashOfGroup ? GROUP_GAP_MS : FLASH_GAP_MS;
    }
  });
  return fixed;
}

/** Shortest period (ms) that can hold this rhythm without overlapping phases. */
export function minPeriodMs(rhythm: LightRhythm): number {
  const { cls, groups } = rhythm;
  switch (cls) {
    case "F":
      return CONTINUOUS_MS;
    case "Iso":
      return 2 * MIN_ECLIPSE_MS;
    case "Fl":
      return flashFixedMs(groups, FLASH_MS) + MIN_ECLIPSE_MS;
    case "LFl":
      return flashFixedMs(groups, LONG_FLASH_MS) + MIN_ECLIPSE_MS;
    case "Oc": {
      const n = totalFlashes(groups);
      return n * ECLIPSE_MS + (n - 1) * LIT_GAP_MS + LIT_GAP_MS;
    }
    case "Q":
      return 2 * QUICK_UNIT_MS;
    case "VQ":
      return 2 * VQUICK_UNIT_MS;
  }
}

/**
 * Compile a rhythm to one period of on/off phases. For any rhythm with a
 * defined period the phases sum exactly to periodS × 1000; F and periodless
 * quick lights fill a nominal window. Deterministic.
 */
export function compileRhythm(rhythm: LightRhythm): LightPhase[] {
  const { cls, groups } = rhythm;
  const periodMs =
    rhythm.periodS !== null ? Math.round(rhythm.periodS * 1000) : null;

  switch (cls) {
    case "F":
      return [{ on: true, ms: periodMs ?? CONTINUOUS_MS }];

    case "Iso": {
      const p = periodMs ?? DEFAULT_PERIOD_MS;
      const half = Math.round(p / 2);
      return [
        { on: true, ms: half },
        { on: false, ms: p - half },
      ];
    }

    case "Fl":
      return flashTimeline(groups, FLASH_MS, periodMs ?? DEFAULT_PERIOD_MS);
    case "LFl":
      return flashTimeline(groups, LONG_FLASH_MS, periodMs ?? 6000);

    case "Oc":
      return occultingTimeline(groups, periodMs ?? DEFAULT_PERIOD_MS);

    case "Q":
      return quickTimeline(QUICK_UNIT_MS, periodMs);
    case "VQ":
      return quickTimeline(VQUICK_UNIT_MS, periodMs);
  }
}

/** n flashes (lit `flashMs`) then a single dark eclipse filling the period. */
function flashTimeline(
  groups: number[],
  flashMs: number,
  periodMs: number,
): LightPhase[] {
  const g = groups.length === 0 ? [1] : groups;
  const phases: LightPhase[] = [];
  let fixed = 0;
  g.forEach((count, gi) => {
    for (let i = 0; i < count; i++) {
      phases.push({ on: true, ms: flashMs });
      fixed += flashMs;
      const lastFlashOfGroup = i === count - 1;
      const lastGroup = gi === g.length - 1;
      if (lastFlashOfGroup && lastGroup) continue; // eclipse added below
      const gap = lastFlashOfGroup ? GROUP_GAP_MS : FLASH_GAP_MS;
      phases.push({ on: false, ms: gap });
      fixed += gap;
    }
  });
  // Final eclipse fills to the period; clamps only for an infeasible period.
  phases.push({ on: false, ms: Math.max(MIN_ECLIPSE_MS, periodMs - fixed) });
  return phases;
}

/** Mostly lit, with n dark eclipses. Eclipse count === total groups. */
function occultingTimeline(groups: number[], periodMs: number): LightPhase[] {
  const n = totalFlashes(groups);
  const darkFixed = n * ECLIPSE_MS + (n - 1) * LIT_GAP_MS;
  const lead = Math.max(LIT_GAP_MS, periodMs - darkFixed);
  const phases: LightPhase[] = [{ on: true, ms: lead }];
  for (let i = 0; i < n; i++) {
    phases.push({ on: false, ms: ECLIPSE_MS });
    if (i < n - 1) phases.push({ on: true, ms: LIT_GAP_MS });
  }
  return phases;
}

/** Continuous quick on/off at `unit` cadence, filling the period exactly. */
function quickTimeline(unit: number, periodMs: number | null): LightPhase[] {
  const total = periodMs ?? CONTINUOUS_MS;
  const phases: LightPhase[] = [];
  let t = 0;
  let on = true;
  while (t < total) {
    const ms = Math.min(unit, total - t);
    phases.push({ on, ms });
    t += ms;
    on = !on;
  }
  return phases;
}

/** Full period length of a compiled timeline, ms. */
export function periodMsOf(phases: LightPhase[]): number {
  return phases.reduce((a, p) => a + p.ms, 0);
}
