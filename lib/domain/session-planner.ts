/**
 * Daily session assembly (SPEC §18.3). Pure and deterministic — same inputs,
 * same session. Order: quick retrieval → overdue critical review → one main
 * new/guided skill → mixed independent practice → reflection.
 */

export type Criticality =
  "informational" | "standard" | "important" | "safety_critical";

export type ActivityCandidate = {
  id: string;
  type: "review" | "guided_task" | "independent_task" | "lesson";
  objectiveId: string;
  criticality: Criticality;
  /** Days overdue (0 = due today, negative = not yet due). */
  overdueDays: number;
  /** 0..1 — how weak the objective currently is. */
  weakness: number;
  /** Objective is a prerequisite of a currently weak objective. */
  prerequisiteOfWeak: boolean;
  /** Days until target exam; null when no exam date. */
  daysToExam: number | null;
  /** Same interaction kind served in the recent window. */
  recentSameKindCount: number;
  /** Exact entity served within the exclusion window. */
  recentlyServed: boolean;
};

const CRITICALITY_WEIGHT: Record<Criticality, number> = {
  informational: 0,
  standard: 0.4,
  important: 0.8,
  safety_critical: 1.4,
};

export function priorityScore(c: ActivityCandidate): number {
  const overdue =
    c.overdueDays > 0 ? Math.min(2, 0.5 + c.overdueDays * 0.25) : 0;
  const weakness = c.weakness * 1.5;
  const criticality = CRITICALITY_WEIGHT[c.criticality];
  const prerequisite = c.prerequisiteOfWeak ? 0.6 : 0;
  const examProximity =
    c.daysToExam !== null && c.daysToExam > 0
      ? Math.min(1, 14 / c.daysToExam) * 0.8
      : 0;
  const diversityPenalty = Math.min(1.2, c.recentSameKindCount * 0.3);
  const exposurePenalty = c.recentlyServed ? 2 : 0;

  return (
    overdue +
    weakness +
    criticality +
    prerequisite +
    examProximity -
    diversityPenalty -
    exposurePenalty
  );
}

export type PlannedActivity = {
  id: string;
  objectiveId: string;
  section: "warmup" | "overdue_review" | "main_skill" | "mixed" | "reflection";
  type: ActivityCandidate["type"];
};

/**
 * Assemble a session (§18.3 order, §12.3 shape). Never serves a wall of
 * identical MCQs — the diversity penalty plus section structure prevent it.
 */
export function planSession(
  candidates: ActivityCandidate[],
  opts: { maxActivities?: number } = {},
): PlannedActivity[] {
  const max = opts.maxActivities ?? 8;
  const ranked = [...candidates]
    .map((c) => ({ c, score: priorityScore(c) }))
    .sort((a, b) => b.score - a.score || a.c.id.localeCompare(b.c.id));

  const used = new Set<string>();
  const take = (
    pred: (c: ActivityCandidate) => boolean,
    n: number,
  ): ActivityCandidate[] => {
    const out: ActivityCandidate[] = [];
    for (const { c } of ranked) {
      if (out.length >= n) break;
      if (used.has(c.id) || !pred(c)) continue;
      used.add(c.id);
      out.push(c);
    }
    return out;
  };

  const warmup = take(
    (c) => c.type === "review" && c.weakness < 0.5 && c.overdueDays >= 0,
    1,
  );
  const overdueReview = take(
    (c) =>
      c.type === "review" &&
      c.overdueDays > 0 &&
      (c.criticality === "important" || c.criticality === "safety_critical"),
    2,
  );
  const mainSkill = take(
    (c) => c.type === "guided_task" || c.type === "lesson",
    1,
  );
  const mixed = take(
    (c) => c.type === "independent_task" || c.type === "review",
    Math.max(0, max - used.size - 1),
  );

  const activities: PlannedActivity[] = [
    ...warmup.map((c) => toPlanned(c, "warmup")),
    ...overdueReview.map((c) => toPlanned(c, "overdue_review")),
    ...mainSkill.map((c) => toPlanned(c, "main_skill")),
    ...mixed.map((c) => toPlanned(c, "mixed")),
  ];
  if (activities.length > 0) {
    activities.push({
      id: "reflection",
      objectiveId: activities[activities.length - 1].objectiveId,
      section: "reflection",
      type: "review",
    });
  }
  return activities;
}

function toPlanned(
  c: ActivityCandidate,
  section: PlannedActivity["section"],
): PlannedActivity {
  return { id: c.id, objectiveId: c.objectiveId, section, type: c.type };
}
