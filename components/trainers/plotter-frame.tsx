"use client";

import { cn } from "@/lib/utils";

/**
 * Generic electronic-chart plotter mock (SPEC §21.5). Deliberately schematic and
 * non-trade-dress — it must not resemble a named commercial product. Used as a
 * stimulus for overzoom awareness, layer/settings checks, waypoint entry, MOB,
 * and GNSS cross-checking. Always labelled as a training aid, not for navigation.
 */

export type PlotterSpec = {
  mode?: "normal" | "overzoom";
  rangeNm?: number;
  showMob?: boolean;
  waypoint?: { x: number; y: number; label_sv: string };
  gnssMarker?: { x: number; y: number };
  note_sv?: string;
};

export function PlotterFrame({ spec }: { spec: PlotterSpec }) {
  const overzoom = spec.mode === "overzoom";
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-navy-950">
      {/* generic status bar */}
      <div className="flex items-center justify-between gap-2 border-b border-border bg-navy-900 px-3 py-1.5 text-xs">
        <span className="text-label text-muted-foreground">Övningsplotter</span>
        <span className="font-readout text-muted-foreground">
          {spec.rangeNm ? `${spec.rangeNm} M` : "—"}
          {overzoom ? " · OVERZOOM" : ""}
        </span>
        <span
          className={cn(
            "rounded px-1.5 py-0.5 text-[11px] font-semibold",
            spec.showMob ? "bg-destructive/80 text-white" : "bg-navy-800 text-muted-foreground",
          )}
        >
          MOB
        </span>
      </div>

      {/* chart screen */}
      <div className="relative">
        <svg
          viewBox="0 0 240 180"
          role="img"
          aria-label={overzoom ? "Plotterskärm, kraftigt inzoomad (overzoom)" : "Plotterskärm"}
          className={cn("h-auto w-full", overzoom && "blur-[1.5px] saturate-150")}
        >
          <rect width="240" height="180" fill="#0f2233" />
          {/* schematic land + depth areas (invented) */}
          <path d="M0 0 H90 Q70 40 100 70 Q60 90 80 130 Q40 160 0 150 Z" fill="#12303a" stroke="#1d4a52" strokeWidth={1} />
          <path d="M240 180 H150 Q170 140 150 110 Q190 90 175 60 Q210 40 240 55 Z" fill="#12303a" stroke="#1d4a52" strokeWidth={1} />
          <text x={40} y={90} style={{ fontSize: 7 }} className="fill-sea-300/70">4.2</text>
          <text x={120} y={70} style={{ fontSize: 7 }} className="fill-sea-300/70">7.8</text>
          <text x={150} y={150} style={{ fontSize: 7 }} className="fill-sea-300/70">3.1</text>

          {/* range rings + own ship */}
          <circle cx={120} cy={95} r={30} fill="none" stroke="#24506a" strokeWidth={0.5} />
          <circle cx={120} cy={95} r={55} fill="none" stroke="#24506a" strokeWidth={0.5} />
          <line x1={120} y1={95} x2={120} y2={40} stroke="#8ec5ff" strokeWidth={1} />
          <path d="M120 86 L126 104 L120 99 L114 104 Z" fill="#8ec5ff" />

          {spec.waypoint ? (
            <g>
              <circle cx={spec.waypoint.x} cy={spec.waypoint.y} r={4} fill="none" stroke="#ffcf4a" strokeWidth={1.5} />
              <line x1={120} y1={95} x2={spec.waypoint.x} y2={spec.waypoint.y} stroke="#ffcf4a" strokeWidth={0.75} strokeDasharray="3 2" />
              <text x={spec.waypoint.x + 6} y={spec.waypoint.y} style={{ fontSize: 7 }} className="fill-amber-400">
                {spec.waypoint.label_sv}
              </text>
            </g>
          ) : null}

          {spec.gnssMarker ? (
            <g>
              <circle cx={spec.gnssMarker.x} cy={spec.gnssMarker.y} r={3} fill="#46a758" />
              <text x={spec.gnssMarker.x + 5} y={spec.gnssMarker.y - 4} style={{ fontSize: 6 }} className="fill-success">GNSS</text>
            </g>
          ) : null}
        </svg>

        {overzoom ? (
          <span className="absolute right-2 top-2 rounded bg-warning/90 px-1.5 py-0.5 text-[10px] font-semibold text-warning-foreground">
            Detaljnivå osäker
          </span>
        ) : null}
      </div>

      <p className="border-t border-border px-3 py-1.5 text-[11px] text-muted-foreground">
        {spec.note_sv ?? "Generisk övningsplotter — ej för navigation."}
      </p>
    </div>
  );
}
