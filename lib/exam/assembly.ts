/**
 * Deterministic exam assembly (SPEC §35.3). Given a blueprint (section quotas by
 * objective) + an item pool + a seed, produce a stratified selection that is
 * REPRODUCIBLE (same seed → same exam) and respects per-item exposure limits.
 * Pure — no DB, no clock — so it is fully property-testable (§86.4).
 */

/** mulberry32 — a small, fast, deterministic PRNG. */
export function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** FNV-1a: stable string → 32-bit seed so a session id seeds the PRNG. */
export function hashSeed(input: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function seededShuffle<T>(arr: readonly T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface BlueprintSection {
  id: string;
  title: string;
  /** Diagnostic sections are shown separately and excluded from the pass calc. */
  isDiagnostic?: boolean;
  /** Pool items whose objectiveTag is in this list are eligible. */
  objectiveTags: string[];
  count: number;
}

export interface Blueprint {
  id: string;
  title: string;
  durationSeconds: number;
  /** Pass threshold in basis points (7500 = 75 %). */
  passThresholdBp: number;
  sections: BlueprintSection[];
}

export interface PoolItem {
  id: string;
  objectiveTag: string;
}

export interface AssembledSection {
  sectionId: string;
  title: string;
  isDiagnostic: boolean;
  itemIds: string[];
}

export interface AssembledExam {
  blueprintId: string;
  seed: string;
  sections: AssembledSection[];
  /** Flat presentation order across all sections. */
  itemOrder: string[];
  /** Sections that could not be filled to quota from the pool. */
  shortfalls: { sectionId: string; needed: number; got: number }[];
}

export interface AssembleOptions {
  /** Prior usage count for an item; over-exposed items are skipped (§35.3). */
  exposureOf?: (itemId: string) => number;
  maxExposure?: number;
}

export function assembleExam(
  blueprint: Blueprint,
  pool: readonly PoolItem[],
  seed: string,
  options: AssembleOptions = {},
): AssembledExam {
  const rand = mulberry32(hashSeed(`${blueprint.id}:${seed}`));
  const exposureOf = options.exposureOf ?? (() => 0);
  const maxExposure = options.maxExposure ?? Number.POSITIVE_INFINITY;

  const used = new Set<string>();
  const sections: AssembledSection[] = [];
  const shortfalls: AssembledExam["shortfalls"] = [];

  for (const section of blueprint.sections) {
    const eligible = pool.filter(
      (p) =>
        section.objectiveTags.includes(p.objectiveTag) &&
        !used.has(p.id) &&
        exposureOf(p.id) < maxExposure,
    );
    const picked = seededShuffle(eligible, rand).slice(0, section.count);
    picked.forEach((p) => used.add(p.id));
    if (picked.length < section.count) {
      shortfalls.push({
        sectionId: section.id,
        needed: section.count,
        got: picked.length,
      });
    }
    sections.push({
      sectionId: section.id,
      title: section.title,
      isDiagnostic: Boolean(section.isDiagnostic),
      itemIds: picked.map((p) => p.id),
    });
  }

  return {
    blueprintId: blueprint.id,
    seed,
    sections,
    itemOrder: sections.flatMap((s) => s.itemIds),
    shortfalls,
  };
}
