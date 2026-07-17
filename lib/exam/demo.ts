import "server-only";
import { getTrackItems } from "@/lib/learning/tracks";
import type { DemoItem } from "@/lib/learning/demo";
import { assembleExam, type Blueprint } from "@/lib/exam/assembly";

/**
 * Demo simulation (SPEC §35). Builds a real, deterministic exam from the demo
 * item pool so the runner — server timer, no-feedback-until-submit, one-final-
 * submission, 75 % scoring, diagnostic separation — is fully exercisable without
 * a database. Answer keys never leave this server-only module.
 */

const POOL_TRACKS = ["demo", "ljus", "vajning", "knop", "vader"];

export interface DemoPoolEntry {
  id: string;
  item: DemoItem;
  objectiveTag: string;
}

export function getDemoExamPool(): DemoPoolEntry[] {
  const entries: DemoPoolEntry[] = [];
  for (const track of POOL_TRACKS) {
    getTrackItems(track).forEach((item, i) =>
      entries.push({
        id: `${track}:${i}`,
        item,
        objectiveTag: item.objectiveTitle,
      }),
    );
  }
  return entries;
}

export interface BuiltDemoExam {
  blueprint: Blueprint;
  assembled: ReturnType<typeof assembleExam>;
  itemById: Map<string, DemoItem>;
}

/** Build the deterministic demo exam for a given seed. */
export function buildDemoExam(seed: string): BuiltDemoExam {
  const pool = getDemoExamPool();
  const allTags = [...new Set(pool.map((p) => p.objectiveTag))];
  const safetyTags = allTags.filter((t) => /[Ss]äkerhet|[Nn]öd/.test(t));

  // 20-minute demo (a real Förarintyg blueprint runs 90). Two sections: a
  // graded mix and a small diagnostic block (excluded from the pass calc).
  const gradedCount = Math.min(6, Math.max(1, pool.length - 2));
  const blueprint: Blueprint = {
    id: "forar-sim-demo",
    title: "Träningssimulering — Förarintyg",
    durationSeconds: 20 * 60,
    passThresholdBp: 7500,
    sections: [
      {
        id: "del1",
        title: "Del 1 — blandade uppgifter",
        objectiveTags: allTags,
        count: gradedCount,
      },
      {
        id: "diag",
        title: "Diagnos — säkerhet",
        isDiagnostic: true,
        objectiveTags: safetyTags.length ? safetyTags : allTags,
        count: 2,
      },
    ],
  };

  const assembled = assembleExam(
    blueprint,
    pool.map((p) => ({ id: p.id, objectiveTag: p.objectiveTag })),
    seed,
  );
  return {
    blueprint,
    assembled,
    itemById: new Map(pool.map((p) => [p.id, p.item])),
  };
}
