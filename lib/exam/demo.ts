import "server-only";
import {
  certification,
  type CertificationId,
} from "@/lib/certifications/registry";
import { getTrackItems } from "@/lib/learning/tracks";
import type { DemoItem } from "@/lib/learning/demo";
import { EXAM_CONFIG } from "@/lib/exam/blueprints";
import { assembleExam, type Blueprint } from "@/lib/exam/assembly";

/**
 * Demo simulation (SPEC §35), certification-scoped. Builds a real,
 * deterministic exam from ONE certification's item pool so the runner —
 * server timer, no-feedback-until-submit, one-final-submission, 75 % scoring,
 * diagnostic separation — is fully exercisable without a database. Pool ids
 * are namespaced `${cert}/${track}:${index}`, so a session can never grade
 * against another certification's items. Answer keys never leave this
 * server-only module.
 */

export interface DemoPoolEntry {
  id: string;
  item: DemoItem;
  objectiveTag: string;
}

export function getDemoExamPool(cert: CertificationId): DemoPoolEntry[] {
  const entries: DemoPoolEntry[] = [];
  for (const track of certification(cert).tracks) {
    (getTrackItems(cert, track.id) ?? []).forEach((item, i) =>
      entries.push({
        id: `${cert}/${track.id}:${i}`,
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

/** Build the deterministic demo exam for a certification and seed. */
export function buildDemoExam(
  cert: CertificationId,
  seed: string,
): BuiltDemoExam {
  const config = EXAM_CONFIG[cert];
  const pool = getDemoExamPool(cert);
  const allTags = [...new Set(pool.map((p) => p.objectiveTag))];
  const diagTags = allTags.filter((t) => config.diagnosticTagPattern.test(t));

  const gradedCount = Math.min(
    config.gradedCount,
    Math.max(1, pool.length - 2),
  );
  const blueprint: Blueprint = {
    id: `${cert}-sim-demo`,
    title: config.titleSv,
    durationSeconds: config.durationSeconds,
    passThresholdBp: config.passThresholdBp,
    sections: [
      {
        id: "del1",
        title: "Del 1 — blandade uppgifter",
        objectiveTags: allTags,
        count: gradedCount,
      },
      {
        id: "diag",
        title: config.diagnosticTitle,
        isDiagnostic: true,
        objectiveTags: diagTags.length ? diagTags : allTags,
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
