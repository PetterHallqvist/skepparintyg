"use client";

import { useId } from "react";
import {
  compileRhythm,
  parseLightCharacter,
  periodMsOf,
  type LightPhase,
} from "@/lib/lights/rhythm";
import {
  VESSEL_LIGHTS,
  type LightColor,
  type LightRole,
  type NavigationLight,
} from "@/lib/lights/schema";
import { cn } from "@/lib/utils";

/**
 * Night-scene renderer for the lights trainer (SPEC §25.3). Lights are drawn
 * from semantic data — vessel configurations or a parsed fyr character — never
 * hard-coded pixels. Blinking is CSS-only, generated from the compiled rhythm
 * timeline and gated behind `prefers-reduced-motion`; a static timeline strip
 * always accompanies it as the reduced-motion / screen-reader alternative.
 */

const HEX: Record<LightColor, string> = {
  white: "#f6f5ee",
  red: "#e5484d",
  green: "#46a758",
  yellow: "#ffe629",
};

// Schematic dot positions on the stern-view hull (viewBox 0 0 200 240).
const DOT: Record<LightRole, { x: number; y: number }> = {
  masthead: { x: 100, y: 66 },
  masthead_aft: { x: 100, y: 104 },
  sidelight_port: { x: 64, y: 122 },
  sidelight_starboard: { x: 136, y: 122 },
  sternlight: { x: 100, y: 206 },
  allround_white: { x: 100, y: 96 },
  allround_red_upper: { x: 100, y: 80 },
  allround_red_lower: { x: 100, y: 108 },
  allround_green: { x: 100, y: 92 },
  towing_yellow: { x: 100, y: 150 },
};

function LightDot({ light }: { light: NavigationLight }) {
  const pos = DOT[light.role];
  const fill = HEX[light.color];
  return (
    <g>
      <circle cx={pos.x} cy={pos.y} r={11} fill={fill} opacity={0.22} />
      <circle cx={pos.x} cy={pos.y} r={5} fill={fill} />
      <circle cx={pos.x} cy={pos.y} r={5} fill="none" stroke="#0b1622" strokeWidth={0.75} />
    </g>
  );
}

/** Hull outline + light dots for a set of lights. Reused by the light builder. */
export function VesselSilhouette({
  lights,
  className,
}: {
  lights: NavigationLight[];
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 240"
      role="img"
      aria-label="Fartyg sett akterifrån med sina lanternor"
      className={cn("h-auto w-full max-w-56", className)}
    >
      <path
        d="M100 22 C120 34 138 62 138 104 L138 176 C138 200 122 214 100 214 C78 214 62 200 62 176 L62 104 C62 62 80 34 100 22 Z"
        fill="#16263a"
        stroke="#3a5069"
        strokeWidth={1.5}
      />
      <line x1={100} y1={30} x2={100} y2={206} stroke="#26384d" strokeWidth={1} />
      {lights.map((l) => (
        <LightDot key={l.role} light={l} />
      ))}
    </svg>
  );
}

/** Vessel lights from a standard configuration. */
function VesselLights({ config }: { config: keyof typeof VESSEL_LIGHTS }) {
  const lights = VESSEL_LIGHTS[config];
  return <VesselSilhouette lights={lights} />;
}

/** Build step-end keyframes that hold each phase's opacity to the next boundary. */
function keyframes(name: string, phases: LightPhase[]): string {
  const total = periodMsOf(phases);
  let acc = 0;
  const stops: string[] = [];
  for (const p of phases) {
    const pct = ((acc / total) * 100).toFixed(3);
    stops.push(`${pct}%{opacity:${p.on ? 1 : 0.12}}`);
    acc += p.ms;
  }
  stops.push(`100%{opacity:${phases[0].on ? 1 : 0.12}}`);
  return `@keyframes ${name}{${stops.join("")}}`;
}

/** A single blinking light (a fyr) driven by a parsed light character. */
function FyrLight({ character }: { character: string }) {
  const rawId = useId();
  const name = `fyr${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const parsed = parseLightCharacter(character);
  const phases = compileRhythm(parsed.rhythm);
  const periodMs = periodMsOf(phases);
  const fill = HEX[
    parsed.colors[0] === "R"
      ? "red"
      : parsed.colors[0] === "G"
        ? "green"
        : parsed.colors[0] === "Y"
          ? "yellow"
          : "white"
  ];

  const css =
    keyframes(name, phases) +
    `@media (prefers-reduced-motion: no-preference){` +
    `.${name}{animation:${name} ${periodMs}ms step-end infinite}}`;

  return (
    <div className="flex flex-col items-center gap-2">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <svg viewBox="0 0 160 200" role="img" aria-label={`Fyr med karaktär ${character}`} className="h-auto w-full max-w-44">
        {/* light glow + lamp */}
        <circle className={name} cx={80} cy={44} r={20} fill={fill} opacity={0.22} />
        <circle className={name} cx={80} cy={44} r={9} fill={fill} />
        {/* tower */}
        <path d="M70 60 L64 180 L96 180 L90 60 Z" fill="#1a2c42" stroke="#3a5069" strokeWidth={1.5} />
        <rect x={60} y={178} width={40} height={8} rx={2} fill="#233649" />
      </svg>
      <TimelineStrip phases={phases} caption={`${character} — ${describeSv(parsed.rhythm.cls)}`} />
    </div>
  );
}

function describeSv(cls: string): string {
  switch (cls) {
    case "Fl":
      return "blixt (ljus kortare än mörker)";
    case "LFl":
      return "långblixt";
    case "Oc":
      return "förmörkelse (mest ljus)";
    case "Iso":
      return "isofas (lika ljus och mörker)";
    case "Q":
      return "snabbblink";
    case "VQ":
      return "mycket snabb blink";
    default:
      return "fast sken";
  }
}

/** Static lit/dark strip — the accessible alternative to the animation. */
export function TimelineStrip({
  phases,
  caption,
}: {
  phases: LightPhase[];
  caption?: string;
}) {
  const total = periodMsOf(phases);
  return (
    <div className="w-full max-w-56 space-y-1">
      <div
        className="flex h-3 overflow-hidden rounded-full border border-border"
        role="img"
        aria-label={`Ljusrytm: ${caption ?? "en period"}`}
      >
        {phases.map((p, i) => (
          <span
            key={i}
            style={{ width: `${(p.ms / total) * 100}%` }}
            className={p.on ? "bg-primary" : "bg-muted"}
          />
        ))}
      </div>
      {caption ? (
        <p className="font-readout text-center text-[11px] text-muted-foreground">
          {caption}
        </p>
      ) : null}
    </div>
  );
}

// --- day shapes -------------------------------------------------------------

const DAY_SHAPE_LABEL: Record<string, string> = {
  ball: "svart boll",
  cone_down: "kon med spetsen nedåt",
  cone_up: "kon med spetsen uppåt",
  cylinder: "cylinder",
  diamond: "romb (två koner)",
};

function DayShape({ shape }: { shape: string }) {
  // Day shapes are black signals viewed against the sky, so they render on a
  // pale sky panel (not the dark night theme) to stay legible.
  const fill = "#161f28";
  const stroke = "#0c1218";
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label={`Dagersignal: ${DAY_SHAPE_LABEL[shape] ?? shape}`} className="h-auto w-full max-w-32">
      {shape === "ball" && <circle cx={60} cy={60} r={34} fill={fill} stroke={stroke} strokeWidth={1.5} />}
      {shape === "cone_down" && (
        <path d="M28 40 L92 40 L60 96 Z" fill={fill} stroke={stroke} strokeWidth={1.5} />
      )}
      {shape === "cone_up" && (
        <path d="M60 24 L92 80 L28 80 Z" fill={fill} stroke={stroke} strokeWidth={1.5} />
      )}
      {shape === "cylinder" && (
        <rect x={40} y={30} width={40} height={60} rx={3} fill={fill} stroke={stroke} strokeWidth={1.5} />
      )}
      {shape === "diamond" && (
        <path d="M60 22 L92 60 L60 60 Z M60 98 L28 60 L92 60 Z" fill={fill} stroke={stroke} strokeWidth={1.5} />
      )}
    </svg>
  );
}

// --- stimulus dispatch ------------------------------------------------------

export type LightSceneSpec = {
  config?: keyof typeof VESSEL_LIGHTS;
  light?: string;
  animated?: boolean;
};

export function LightScene({ spec }: { spec: LightSceneSpec }) {
  return (
    <div className="flex justify-center rounded-lg border border-border bg-navy-950/40 p-4">
      {spec.light ? (
        <FyrLight character={spec.light} />
      ) : spec.config ? (
        <VesselLights config={spec.config} />
      ) : null}
    </div>
  );
}

export function DayShapeView({ shape }: { shape: string }) {
  return (
    <div
      className="flex flex-col items-center gap-2 rounded-lg border border-border p-4"
      style={{
        background: "linear-gradient(180deg, #cddbe8 0%, #e7eef4 100%)",
      }}
    >
      <DayShape shape={shape} />
      <p className="text-label text-slate-600">Dagersignal (mot himlen)</p>
    </div>
  );
}
