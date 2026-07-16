import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  chartManifestSchema,
  chartTaskSchema,
  type ChartManifest,
  type ChartTask,
} from "./schemas";

/**
 * Chart task definitions + manifest access (server only). Expected answers
 * are COMPUTED at grading time from the manifest by trusted pure functions
 * (SPEC §16.3) — never stored, never sent to the client before submission
 * (§58.3).
 */

let manifestCache: ChartManifest | null = null;

export function loadManifest(chartId: string): ChartManifest {
  if (chartId !== "grundviken-v1") throw new Error("unknown_chart");
  if (manifestCache) return manifestCache;
  const raw = readFileSync(
    join(process.cwd(), "public", "charts", "grundviken-v1", "manifest.json"),
    "utf8",
  );
  manifestCache = chartManifestSchema.parse(JSON.parse(raw));
  return manifestCache;
}

/** Phase 3 task set on Grundviken (foundation + measurement + compass). */
export const CHART_TASKS: ChartTask[] = chartTaskSchema.array().parse([
  {
    id: "gv-locate-fyr",
    chartId: "grundviken-v1",
    type: "locate_feature",
    titleSv: "Hitta fyren",
    instructionSv:
      "Peka ut fyren Norrgrund på kortet. Använd symbolen och fyrkaraktären för att hitta rätt.",
    targetFeatureId: "fyr-norrgrund",
    toleranceNm: 0.3,
  },
  {
    id: "gv-distans-hamn-fyr",
    chartId: "grundviken-v1",
    type: "measure_distance",
    titleSv: "Mät distansen",
    instructionSv:
      "Mät distansen från hamnen i Grundviken till fyren Norrgrund. Klicka på startpunkten och sedan på slutpunkten — eller skriv in ditt svar.",
    fromFeatureId: "hamn-grundviken",
    toFeatureId: "fyr-norrgrund",
    toleranceNm: 0.2,
  },
  {
    id: "gv-bering-fyr-nordprick",
    chartId: "grundviken-v1",
    type: "measure_bearing",
    titleSv: "Mät sann kurs",
    instructionSv:
      "Mät den sanna kursen från fyren Norrgrund till nordpricken Två systrar. Klicka först på fyren, sedan på pricken — eller skriv kursen i grader.",
    fromFeatureId: "fyr-norrgrund",
    toFeatureId: "nordprick-tva-systrar",
    toleranceDeg: 3,
  },
  {
    id: "gv-plot-kurs",
    chartId: "grundviken-v1",
    type: "plot_course",
    titleSv: "Sätt ut en kurslinje",
    instructionSv:
      "Från ankarplatsen vid Ekholmen: sätt ut punkten som ligger kurs 132° och 3,0 M bort. Klicka där linjen ska sluta.",
    fromFeatureId: "ankarplats-ekholmen",
    courseDeg: 132,
    distanceNm: 3,
    toleranceNm: 0.25,
  },
  {
    id: "gv-kompass-till-sann",
    chartId: "grundviken-v1",
    type: "compass_conversion",
    titleSv: "Kompass till sann kurs",
    instructionSv:
      "Din kompasskurs är 090°. Använd kortets deviationstabell och missvisningen 6° E för att räkna ut sann kurs.",
    direction: "compass_to_true",
    inputDeg: 90,
    toleranceDeg: 0.6,
  },
  {
    id: "gv-sann-till-kompass",
    chartId: "grundviken-v1",
    type: "compass_conversion",
    titleSv: "Sann kurs till kompass",
    instructionSv:
      "Du vill styra sann kurs 098°. Vilken kompasskurs ska du styra? (Missvisning 6° E, kortets deviationstabell.)",
    direction: "true_to_compass",
    inputDeg: 98,
    toleranceDeg: 1,
  },
]);

export function getTask(taskId: string): ChartTask {
  const task = CHART_TASKS.find((t) => t.id === taskId);
  if (!task) throw new Error("unknown_task");
  return task;
}

export function getFeature(manifest: ChartManifest, id: string) {
  const f = manifest.features.find((x) => x.id === id);
  if (!f) throw new Error(`unknown_feature: ${id}`);
  return f;
}
