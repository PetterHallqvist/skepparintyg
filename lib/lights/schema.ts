/**
 * Semantic navigation lights (SPEC §25.3). Lights are defined as data — colour,
 * horizontal arc, vertical order, rhythm — so a scene renders identically
 * wherever it appears (lights trainer, rules-of-the-road night scenes) and the
 * `light_build` grader can diagnose a learner's arrangement by role, not pixels.
 *
 * Arcs use the COLREG convention: degrees relative to the vessel's head (000 =
 * dead ahead, clockwise). A masthead light shows 225° (from 112.5° on one side
 * through the bow to 112.5° on the other); sidelights show 112.5° each; a
 * sternlight shows 135°; an all-round light shows 360°.
 */

import type { LightColorCode, LightRhythm } from "./rhythm";

export type LightColor = "white" | "red" | "green" | "yellow";

export type NavigationLight = {
  color: LightColor;
  /** Role key — stable identity used by the grader and captions. */
  role: LightRole;
  arcStartDeg: number;
  arcEndDeg: number;
  /** 1 = lowest. Vertical stacking for all-round light combinations. */
  verticalOrder?: number;
  rhythm?: LightRhythm;
};

export type LightRole =
  | "masthead"
  | "masthead_aft"
  | "sidelight_port"
  | "sidelight_starboard"
  | "sternlight"
  | "allround_white"
  | "allround_red_upper"
  | "allround_red_lower"
  | "allround_green"
  | "towing_yellow";

export const COLOR_SV: Record<LightColor, string> = {
  white: "vitt",
  red: "rött",
  green: "grönt",
  yellow: "gult",
};

export const ROLE_SV: Record<LightRole, string> = {
  masthead: "toppljus",
  masthead_aft: "aktre toppljus",
  sidelight_port: "grönt/rött sidoljus (babord)",
  sidelight_starboard: "grönt sidoljus (styrbord)",
  sternlight: "akterljus",
  allround_white: "runtlysande vitt ljus",
  allround_red_upper: "övre runtlysande rött",
  allround_red_lower: "nedre runtlysande rött",
  allround_green: "runtlysande grönt",
  towing_yellow: "gult bogserljus",
};

// COLREG standard arcs.
const MASTHEAD: Pick<NavigationLight, "arcStartDeg" | "arcEndDeg"> = {
  arcStartDeg: 247.5,
  arcEndDeg: 112.5,
}; // 225° over the bow
const PORT: Pick<NavigationLight, "arcStartDeg" | "arcEndDeg"> = {
  arcStartDeg: 247.5,
  arcEndDeg: 360,
}; // 112.5° on the port bow
const STARBOARD: Pick<NavigationLight, "arcStartDeg" | "arcEndDeg"> = {
  arcStartDeg: 0,
  arcEndDeg: 112.5,
};
const STERN: Pick<NavigationLight, "arcStartDeg" | "arcEndDeg"> = {
  arcStartDeg: 112.5,
  arcEndDeg: 247.5,
}; // 135° over the stern
const ALLROUND: Pick<NavigationLight, "arcStartDeg" | "arcEndDeg"> = {
  arcStartDeg: 0,
  arcEndDeg: 360,
};

const port = (): NavigationLight => ({
  color: "red",
  role: "sidelight_port",
  ...PORT,
});
const starboard = (): NavigationLight => ({
  color: "green",
  role: "sidelight_starboard",
  ...STARBOARD,
});
const stern = (): NavigationLight => ({
  color: "white",
  role: "sternlight",
  ...STERN,
});
const masthead = (): NavigationLight => ({
  color: "white",
  role: "masthead",
  ...MASTHEAD,
});

/** Standard COLREG configurations used in trainer content (§28.4 subset). */
export const VESSEL_LIGHTS = {
  /** Power-driven vessel underway, < 50 m: masthead + sidelights + sternlight. */
  power_underway: [masthead(), port(), starboard(), stern()],
  /** Sailing vessel underway: sidelights + sternlight, no masthead. */
  sailing_underway: [port(), starboard(), stern()],
  /** Vessel at anchor, < 50 m: single all-round white forward. */
  anchor: [
    { color: "white", role: "allround_white", ...ALLROUND } as NavigationLight,
  ],
  /** Not under command: two all-round red in a vertical line, no way on. */
  not_under_command: [
    {
      color: "red",
      role: "allround_red_upper",
      verticalOrder: 2,
      ...ALLROUND,
    } as NavigationLight,
    {
      color: "red",
      role: "allround_red_lower",
      verticalOrder: 1,
      ...ALLROUND,
    } as NavigationLight,
  ],
} satisfies Record<string, NavigationLight[]>;

export type VesselLightConfig = keyof typeof VESSEL_LIGHTS;

// --- light_build comparator -------------------------------------------------

/** Minimal descriptor the grader compares on — role + colour. */
export type LightDescriptor = { role: LightRole; color: LightColor };

export type LightSetComparison = {
  correct: boolean;
  /** Roles present in target but absent from the build. */
  missing: LightDescriptor[];
  /** Roles present in the build but not in target. */
  extra: LightDescriptor[];
  /** Roles present in both but with the wrong colour. */
  wrongColor: { role: LightRole; expected: LightColor; got: LightColor }[];
};

/**
 * Compare a built light set against a target by role + colour. Order-free and
 * duplicate-safe. Used by the `light_build` grader and unit-tested directly.
 */
export function compareLightSets(
  target: LightDescriptor[],
  built: LightDescriptor[],
): LightSetComparison {
  const targetByRole = new Map(target.map((d) => [d.role, d.color]));
  const builtByRole = new Map(built.map((d) => [d.role, d.color]));

  const missing: LightDescriptor[] = [];
  const wrongColor: LightSetComparison["wrongColor"] = [];
  for (const [role, color] of targetByRole) {
    if (!builtByRole.has(role)) {
      missing.push({ role, color });
    } else if (builtByRole.get(role) !== color) {
      wrongColor.push({ role, expected: color, got: builtByRole.get(role)! });
    }
  }

  const extra: LightDescriptor[] = [];
  for (const [role, color] of builtByRole) {
    if (!targetByRole.has(role)) extra.push({ role, color });
  }

  return {
    correct:
      missing.length === 0 && extra.length === 0 && wrongColor.length === 0,
    missing,
    extra,
    wrongColor,
  };
}

/** Human-readable Swedish list of a set of descriptors (for feedback captions). */
export function describeRolesSv(descriptors: LightDescriptor[]): string {
  return descriptors.map((d) => ROLE_SV[d.role]).join(", ");
}

/** Map a rhythm colour code to a rendering colour. */
export function colorFromCode(code: LightColorCode): LightColor {
  switch (code) {
    case "W":
      return "white";
    case "R":
      return "red";
    case "G":
      return "green";
    case "Y":
      return "yellow";
  }
}
