"use client";

import { useState } from "react";
import {
  describeSceneSv,
  projectScene,
  type Scene,
  type Vessel,
} from "@/lib/trainers/rules-schema";
import { cn } from "@/lib/utils";

/**
 * Top-down rules-of-the-road scene (SPEC §24.4). Original vessel icons on a
 * water grid, own vessel highlighted. A time scrubber advances traffic along
 * its heading — trails and relative motion appear only when the learner opts in
 * (advanced mode, §24.4), never by default. A text description is always
 * available as the non-visual alternative.
 */

const STEPS = 6;

function VesselIcon({ v, own }: { v: Vessel; own: boolean }) {
  const color = own ? "#8ec5ff" : v.kind === "sailing" ? "#cbb26b" : "#9fb2c6";
  return (
    <g transform={`translate(${v.x} ${v.y}) rotate(${v.headingDeg})`}>
      {/* hull pointing along heading (up before rotation) */}
      <path
        d="M0 -10 L6 8 L0 4 L-6 8 Z"
        fill={color}
        stroke={own ? "#c6e0ff" : "#0b1622"}
        strokeWidth={1}
      />
    </g>
  );
}

export function VesselScene({ scene }: { scene: Scene }) {
  const [t, setT] = useState(0);
  const projected = projectScene(scene, t);
  const night = scene.environment !== "day";
  const lines = describeSceneSv(scene);

  return (
    <div className="space-y-2 rounded-lg border border-border bg-card p-4">
      <div
        className={cn(
          "relative mx-auto max-w-xs overflow-hidden rounded-md border border-border",
          night ? "bg-navy-950" : "bg-sea-100/10",
        )}
      >
        <svg viewBox="0 0 200 200" role="img" aria-label="Trafikscen sedd ovanifrån" className="h-auto w-full">
          <defs>
            <pattern id="rules-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0 L0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" />
            </pattern>
          </defs>
          <rect width="200" height="200" fill="url(#rules-grid)" />

          {/* trails only when scrubbed (advanced mode, §24.4) */}
          {t > 0
            ? scene.vessels.map((v0, i) => (
                <line
                  key={`trail-${v0.id}`}
                  x1={v0.x}
                  y1={v0.y}
                  x2={projected[i].x}
                  y2={projected[i].y}
                  stroke={v0.isOwn ? "#8ec5ff" : "#6b7f94"}
                  strokeWidth={0.75}
                  strokeDasharray="2 2"
                  opacity={0.7}
                />
              ))
            : null}

          {projected.map((v) => (
            <g key={v.id}>
              <VesselIcon v={v} own={!!v.isOwn} />
              <text
                x={v.x}
                y={v.y + 20}
                textAnchor="middle"
                className="fill-muted-foreground"
                style={{ fontSize: 8 }}
              >
                {v.isOwn ? "Du" : v.label_sv}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="rules-time" className="text-label text-muted-foreground">
          Tid
        </label>
        <input
          id="rules-time"
          type="range"
          min={0}
          max={STEPS}
          step={1}
          value={t}
          onChange={(e) => setT(Number(e.target.value))}
          className="h-1.5 flex-1 accent-primary"
          aria-label="Spola fram tiden i scenen"
        />
        <span className="font-readout w-8 text-right text-xs text-muted-foreground">
          +{t}
        </span>
      </div>

      <details className="text-sm">
        <summary className="cursor-pointer text-muted-foreground">
          Beskriv scenen i text
        </summary>
        <ul className="mt-2 space-y-1 text-muted-foreground">
          {lines.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}
