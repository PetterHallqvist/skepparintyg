import { z } from "zod";

/**
 * Rules-of-the-road scene model (SPEC §24.1). A top-down tactical scene of own
 * vessel plus other traffic, with headings and speeds so time can be scrubbed
 * forward. Pure helpers project positions and describe the scene in words (the
 * §24.4 text alternative). Night scenes map each vessel's status to the §25.3
 * light configurations — one light engine, two trainers.
 */

export const vesselSchema = z.object({
  id: z.string(),
  kind: z.enum(["power", "sailing"]),
  label_sv: z.string(),
  /** Position in a 0–200 top-down viewport (x right, y down). */
  x: z.number(),
  y: z.number(),
  /** Heading in degrees, 0 = up (north), clockwise. */
  headingDeg: z.number(),
  /** Viewport units per time step. */
  speed: z.number().min(0),
  isOwn: z.boolean().optional(),
  status: z.enum(["underway", "anchored", "nuc"]).default("underway"),
});
export type Vessel = z.infer<typeof vesselSchema>;

export const sceneSchema = z.object({
  vessels: z.array(vesselSchema).min(1),
  environment: z.enum(["day", "night", "restricted"]).default("day"),
  seaRoom_sv: z.string().optional(),
});
export type Scene = z.infer<typeof sceneSchema>;

const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Project every vessel forward by `t` time steps along its heading. Pure. */
export function projectScene(scene: Scene, t: number): Vessel[] {
  return scene.vessels.map((v) => {
    if (v.status !== "underway" || v.speed === 0) return { ...v };
    const rad = toRad(v.headingDeg);
    return {
      ...v,
      x: v.x + Math.sin(rad) * v.speed * t,
      y: v.y - Math.cos(rad) * v.speed * t,
    };
  });
}

const STATUS_SV: Record<Vessel["status"], string> = {
  underway: "med gång",
  anchored: "för ankar",
  nuc: "manöveroförmöget",
};

const KIND_SV: Record<Vessel["kind"], string> = {
  power: "maskindrivet fartyg",
  sailing: "segelfartyg",
};

/** §24.4 text-only description of a scene. */
export function describeSceneSv(scene: Scene): string[] {
  const env =
    scene.environment === "night"
      ? "Mörker."
      : scene.environment === "restricted"
        ? "Nedsatt sikt."
        : "Dager.";
  const lines = [env];
  if (scene.seaRoom_sv) lines.push(scene.seaRoom_sv);
  for (const v of scene.vessels) {
    const who = v.isOwn ? "Ditt fartyg" : v.label_sv;
    lines.push(
      `${who}: ${KIND_SV[v.kind]} ${STATUS_SV[v.status]}, kurs ${Math.round(v.headingDeg)}°.`,
    );
  }
  return lines;
}

/** Map a vessel's status to its §25.3 light configuration (for night scenes). */
export function lightConfigFor(v: Vessel): string {
  if (v.status === "anchored") return "anchor";
  if (v.status === "nuc") return "not_under_command";
  return v.kind === "sailing" ? "sailing_underway" : "power_underway";
}
