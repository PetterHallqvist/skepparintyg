import { z } from "zod";

/**
 * Chart manifest schema (SPEC §20.4). The SVG is visual only — every semantic
 * object used by tasks lives here. Validated at build time, in tests and on
 * load. All geography is fictional (ADR-0002).
 */

export const pointSchema = z.object({ x: z.number(), y: z.number() });

export const deviationPointSchema = z.object({
  compassDeg: z.number().min(0).max(360),
  deviationDeg: z.number().min(-15).max(15),
});

export const chartFeatureSchema = z.object({
  id: z.string().min(1),
  type: z.enum([
    "lighthouse",
    "lateral_port",
    "lateral_starboard",
    "cardinal_north",
    "cardinal_east",
    "cardinal_south",
    "cardinal_west",
    "isolated_danger",
    "harbour",
    "anchorage",
    "sounding",
    "landmark",
  ]),
  position: pointSchema,
  name: z.string().optional(),
  properties: z.record(z.string(), z.unknown()).default({}),
  hitRadiusPx: z.number().positive().default(24),
});

export const chartHazardSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(["shoal", "rock", "wreck", "restricted"]),
  minDepthM: z.number().nullable(),
  polygon: z.array(pointSchema).min(3),
});

export const chartManifestSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  version: z.number().int().positive(),
  svg: z.string().min(1),
  widthPx: z.number().positive(),
  heightPx: z.number().positive(),
  coordinateSystem: z.object({
    type: z.literal("fictional_geographic"),
    originLatDeg: z.number(),
    originLatMin: z.number(),
    originLonDeg: z.number(),
    originLonMin: z.number(),
    pxPerLatMinute: z.number().positive(),
    pxPerLonMinuteAtChart: z.number().positive(),
    northVector: z.tuple([z.literal(0), z.literal(-1)]),
  }),
  scale: z.object({
    pxPerNm: z.number().positive(),
    uniform: z.literal(true),
  }),
  compass: z.object({
    variationDeg: z.number().min(-30).max(30),
    variationEpochLabel: z.string(),
    deviationTable: z.array(deviationPointSchema).min(2),
  }),
  layers: z.array(z.object({ id: z.string(), defaultVisible: z.boolean() })),
  features: z.array(chartFeatureSchema),
  hazards: z.array(chartHazardSchema),
  legal: z.object({
    notice: z.string().min(1),
    assetAuthor: z.string().min(1),
    reviewedBy: z.string(),
  }),
});

export type ChartManifest = z.infer<typeof chartManifestSchema>;
export type ChartFeature = z.infer<typeof chartFeatureSchema>;
export type ChartHazard = z.infer<typeof chartHazardSchema>;

// ---------------------------------------------------------------------------
// Chart tasks (SPEC §22) — discriminated union, Phase 3 families
// ---------------------------------------------------------------------------

const taskBase = z.object({
  id: z.string().min(1),
  chartId: z.string().min(1),
  titleSv: z.string().min(1),
  instructionSv: z.string().min(1),
  objectiveId: z.string().optional(),
});

export const chartTaskSchema = z.discriminatedUnion("type", [
  taskBase.extend({
    type: z.literal("locate_feature"),
    targetFeatureId: z.string(),
    toleranceNm: z.number().positive().default(0.15),
  }),
  taskBase.extend({
    type: z.literal("measure_distance"),
    fromFeatureId: z.string(),
    toFeatureId: z.string(),
    toleranceNm: z.number().positive(),
  }),
  taskBase.extend({
    type: z.literal("measure_bearing"),
    fromFeatureId: z.string(),
    toFeatureId: z.string(),
    toleranceDeg: z.number().positive(),
  }),
  taskBase.extend({
    type: z.literal("plot_course"),
    fromFeatureId: z.string(),
    courseDeg: z.number().min(0).max(360),
    distanceNm: z.number().positive(),
    toleranceNm: z.number().positive(),
  }),
  taskBase.extend({
    type: z.literal("compass_conversion"),
    direction: z.enum(["compass_to_true", "true_to_compass"]),
    inputDeg: z.number().min(0).max(360),
    toleranceDeg: z.number().positive(),
  }),
]);

export type ChartTask = z.infer<typeof chartTaskSchema>;
