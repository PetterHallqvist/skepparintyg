"use server";

import { z } from "zod";
import {
  distanceNm,
  pointFromCourseDistance,
  shortestAngularDeltaDeg,
  trueCourseDeg,
  type Point,
} from "./geometry";
import { compassFromTrue, trueFromCompass } from "./compass";
import { CHART_TASKS, getFeature, getTask, loadManifest } from "./tasks";
import { logger } from "@/lib/observability/logger";

/**
 * Chart-lab server actions. Grading is server-authoritative (SPEC §58.2):
 * the client shows provisional geometry while working, but the verdict —
 * and the correct-answer overlay (§22.3) — only ever comes from here,
 * after submission.
 */

export type ChartTaskDto = {
  id: string;
  index: number;
  total: number;
  type: string;
  titleSv: string;
  instructionSv: string;
  /** Tool flow the client should use. */
  toolKind: "two_point" | "one_point" | "typed_only";
  /** Typed-alternative unit (a11y path, §20.10). */
  typedUnit: "M" | "°" | null;
  chart: { svg: string; widthPx: number; heightPx: number; pxPerNm: number };
  /** Extra data safe to show BEFORE submission. */
  given: Record<string, unknown>;
};

export type ChartFeedback = {
  correct: boolean;
  oneLiner: string;
  explanation: string;
  /** Learner-visible numbers, e.g. measured vs correct with tolerance (§22.2). */
  yourValue: string | null;
  correctValue: string;
  toleranceNote: string;
  /** Overlay geometry to render AFTER submission (§22.3). */
  overlay:
    | { kind: "point"; point: Point; toleranceRadiusPx: number }
    | { kind: "line"; from: Point; to: Point }
    | null;
};

const fmtNm = (v: number) => `${v.toFixed(2).replace(".", ",")} M`;
const fmtDeg = (v: number) =>
  `${(Math.round(v * 10) / 10).toString().replace(".", ",")}°`;

export async function getChartTaskList(): Promise<
  { id: string; titleSv: string; type: string }[]
> {
  return CHART_TASKS.map((t) => ({
    id: t.id,
    titleSv: t.titleSv,
    type: t.type,
  }));
}

export async function getChartTask(taskId: string): Promise<ChartTaskDto> {
  const task = getTask(taskId);
  const manifest = loadManifest(task.chartId);
  const index = CHART_TASKS.findIndex((t) => t.id === taskId);

  const base = {
    id: task.id,
    index,
    total: CHART_TASKS.length,
    type: task.type,
    titleSv: task.titleSv,
    instructionSv: task.instructionSv,
    chart: {
      svg: manifest.svg,
      widthPx: manifest.widthPx,
      heightPx: manifest.heightPx,
      pxPerNm: manifest.scale.pxPerNm,
    },
  };

  switch (task.type) {
    case "locate_feature":
      return { ...base, toolKind: "one_point", typedUnit: null, given: {} };
    case "measure_distance":
      return { ...base, toolKind: "two_point", typedUnit: "M", given: {} };
    case "measure_bearing":
      return { ...base, toolKind: "two_point", typedUnit: "°", given: {} };
    case "plot_course": {
      const from = getFeature(manifest, task.fromFeatureId).position;
      return {
        ...base,
        toolKind: "one_point",
        typedUnit: null,
        given: {
          startPoint: from,
          courseDeg: task.courseDeg,
          distanceNm: task.distanceNm,
        },
      };
    }
    case "compass_conversion":
      return {
        ...base,
        toolKind: "typed_only",
        typedUnit: "°",
        given: {
          inputDeg: task.inputDeg,
          direction: task.direction,
          variationDeg: manifest.compass.variationDeg,
          deviationTable: manifest.compass.deviationTable,
        },
      };
  }
}

const submitSchema = z.object({
  taskId: z.string().min(1),
  points: z
    .array(z.object({ x: z.number().finite(), y: z.number().finite() }))
    .max(2)
    .optional(),
  typedValue: z.number().finite().optional(),
});

export async function submitChartTask(
  input: z.input<typeof submitSchema>,
): Promise<ChartFeedback> {
  const parsed = submitSchema.parse(input);
  const task = getTask(parsed.taskId);
  const manifest = loadManifest(task.chartId);
  const pxPerNm = manifest.scale.pxPerNm;

  logger.info("chart.attempt", { taskId: task.id, type: task.type });

  switch (task.type) {
    case "locate_feature": {
      const target = getFeature(manifest, task.targetFeatureId);
      const point = parsed.points?.[0];
      if (!point) throw new Error("missing_point");
      const errNm = distanceNm(point, target.position, pxPerNm);
      const correct = errNm <= task.toleranceNm;
      return {
        correct,
        oneLiner: correct
          ? "Rätt — det är fyren Norrgrund."
          : `Din markering ligger ${fmtNm(errNm)} från fyren.`,
        explanation:
          "Fyrsymbolen är en punkt med röd ring och strålar, med namn och fyrkaraktär (Fl(2) 10s) intill.",
        yourValue: null,
        correctValue: target.name ?? target.id,
        toleranceNote: `Tolerans: inom ${fmtNm(task.toleranceNm)}.`,
        overlay: {
          kind: "point",
          point: target.position,
          toleranceRadiusPx: task.toleranceNm * pxPerNm,
        },
      };
    }

    case "measure_distance": {
      const from = getFeature(manifest, task.fromFeatureId).position;
      const to = getFeature(manifest, task.toFeatureId).position;
      const expected = distanceNm(from, to, pxPerNm);
      const value =
        parsed.typedValue ??
        (parsed.points && parsed.points.length === 2
          ? distanceNm(parsed.points[0], parsed.points[1], pxPerNm)
          : null);
      if (value === null) throw new Error("missing_response");
      const delta = Math.abs(value - expected);
      const correct = delta <= task.toleranceNm;
      return {
        correct,
        oneLiner: correct
          ? "Rätt uppmätt."
          : `Du avviker ${fmtNm(delta)} från den riktiga distansen.`,
        explanation:
          "Mät mellan punkternas symboler och läs av mot latitudskalan: en latitudminut motsvarar en nautisk mil.",
        yourValue: fmtNm(value),
        correctValue: fmtNm(expected),
        toleranceNote: `Tolerans: ±${fmtNm(task.toleranceNm)}.`,
        overlay: { kind: "line", from, to },
      };
    }

    case "measure_bearing": {
      const from = getFeature(manifest, task.fromFeatureId).position;
      const to = getFeature(manifest, task.toFeatureId).position;
      const expected = trueCourseDeg(from, to);
      const value =
        parsed.typedValue ??
        (parsed.points && parsed.points.length === 2
          ? trueCourseDeg(parsed.points[0], parsed.points[1])
          : null);
      if (value === null) throw new Error("missing_response");
      const delta = Math.abs(shortestAngularDeltaDeg(value, expected));
      const correct = delta <= task.toleranceDeg;
      return {
        correct,
        oneLiner: correct
          ? "Rätt kurs."
          : `Din kurs avviker ${fmtDeg(delta)} från den sanna kursen.`,
        explanation:
          "Sann kurs mäts med kortets nordriktning som referens, medurs 000–360°.",
        yourValue: fmtDeg(value),
        correctValue: fmtDeg(expected),
        toleranceNote: `Tolerans: ±${fmtDeg(task.toleranceDeg)}.`,
        overlay: { kind: "line", from, to },
      };
    }

    case "plot_course": {
      const from = getFeature(manifest, task.fromFeatureId).position;
      const expectedEnd = pointFromCourseDistance(
        from,
        task.courseDeg,
        task.distanceNm,
        pxPerNm,
      );
      const point = parsed.points?.[0];
      if (!point) throw new Error("missing_point");
      const errNm = distanceNm(point, expectedEnd, pxPerNm);
      const correct = errNm <= task.toleranceNm;
      return {
        correct,
        oneLiner: correct
          ? "Rätt utsatt."
          : `Din punkt ligger ${fmtNm(errNm)} från rätt läge.`,
        explanation:
          "Utgå från startpunkten, lägg ut kursen 132° mot kortets nord och mät 3,0 M längs linjen med latitudskalan.",
        yourValue: null,
        correctValue: `kurs ${fmtDeg(task.courseDeg)}, ${fmtNm(task.distanceNm)}`,
        toleranceNote: `Tolerans: inom ${fmtNm(task.toleranceNm)}.`,
        overlay: { kind: "line", from, to: expectedEnd },
      };
    }

    case "compass_conversion": {
      if (parsed.typedValue === undefined) throw new Error("missing_value");
      const table = manifest.compass.deviationTable;
      const variation = manifest.compass.variationDeg;
      let expected: number;
      if (task.direction === "compass_to_true") {
        expected = trueFromCompass(task.inputDeg, variation, table);
      } else {
        const r = compassFromTrue(task.inputDeg, variation, table);
        if (!r.ok) throw new Error(r.error);
        expected = r.compassDeg;
      }
      const delta = Math.abs(
        shortestAngularDeltaDeg(parsed.typedValue, expected),
      );
      const correct = delta <= task.toleranceDeg;
      return {
        correct,
        oneLiner: correct
          ? "Rätt omvandlat."
          : `Ditt svar avviker ${fmtDeg(delta)} — kontrollera tecknen på deviation och missvisning.`,
        explanation:
          task.direction === "compass_to_true"
            ? "Kompasskurs + deviation = magnetisk kurs; magnetisk kurs + missvisning = sann kurs. Ostlig rättelse är positiv."
            : "Gå baklänges: sann kurs − missvisning = magnetisk kurs; hitta den kompasskurs vars deviation stämmer (iterera i tabellen).",
        yourValue: fmtDeg(parsed.typedValue),
        correctValue: fmtDeg(expected),
        toleranceNote: `Tolerans: ±${fmtDeg(task.toleranceDeg)}.`,
        overlay: null,
      };
    }
  }
}
