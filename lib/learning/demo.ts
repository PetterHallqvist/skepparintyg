import "server-only";

/**
 * The demo-layer item contract for the pre-cloud dev shell. Items live in
 * per-certification track files under ./tracks/<certification>/ — this module
 * holds only the shared type and the client-safe sanitizer. Answer keys stay
 * in server-only modules (§58.3 hygiene holds even in demo mode).
 */

export type DemoItem = {
  index: number;
  kind: string;
  stemSv: string;
  interaction: Record<string, unknown>;
  answerKey: Record<string, unknown>;
  explanation: string;
  method?: string;
  sourceRef: string;
  objectiveTitle: string;
  /** Misconception copy keyed by a wrong option key (choice kinds). */
  misconceptionByKey?: Record<string, string>;
  /** Misconception copy keyed by a failed stage (rules_scenario). */
  stageMisconceptionBySt?: Record<string, string>;
};

/**
 * Strip an item to the client-safe challenge — never the answer key (§58.3).
 * `total` is the length of the track being played.
 */
export function sanitizeDemoItem(item: DemoItem, total: number) {
  return {
    index: item.index,
    total,
    kind: item.kind,
    stemSv: item.stemSv,
    interaction: item.interaction,
    objectiveTitle: item.objectiveTitle,
  };
}

export type DemoChallenge = ReturnType<typeof sanitizeDemoItem>;

/** Optional per-stage misconception copy for rules_scenario feedback. */
export type StageMisconceptions = Record<string, string>;
