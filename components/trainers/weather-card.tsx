"use client";

import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { DataReadout } from "@/components/design-system/data-readout";

/**
 * Weather scenario card (SPEC §27). A fictional forecast + observation + route
 * context. No live data — the learner interprets symbols, trend, and whether
 * information is sufficient. The wind arrow points the way the wind blows
 * toward (meteorological direction rotated 180°).
 */

export type WeatherSpec = {
  area_sv: string;
  windFromDeg: number;
  windDir_sv: string;
  windMs: number;
  trend: "rising" | "falling" | "steady";
  seaState_sv: string;
  observation_sv?: string;
  route_sv?: string;
  note_sv?: string;
};

const TREND_SV: Record<WeatherSpec["trend"], string> = {
  rising: "Stigande",
  falling: "Fallande",
  steady: "Stabilt",
};

function TrendIcon({ trend }: { trend: WeatherSpec["trend"] }) {
  if (trend === "rising") return <ArrowUp aria-hidden="true" className="size-4 text-warning" />;
  if (trend === "falling") return <ArrowDown aria-hidden="true" className="size-4 text-warning" />;
  return <Minus aria-hidden="true" className="size-4 text-muted-foreground" />;
}

export function WeatherCard({ spec }: { spec: WeatherSpec }) {
  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-label text-muted-foreground">Prognos · {spec.area_sv}</p>
        <span className="text-xs text-muted-foreground">Fiktiv övningsprognos</span>
      </div>

      <div className="flex items-center gap-5">
        <svg viewBox="0 0 80 80" role="img" aria-label={`Vind från ${spec.windDir_sv}`} className="size-20 shrink-0">
          <circle cx={40} cy={40} r={34} fill="none" stroke="var(--border)" strokeWidth={1} />
          <g transform={`rotate(${spec.windFromDeg + 180} 40 40)`}>
            <line x1={40} y1={64} x2={40} y2={16} stroke="var(--primary)" strokeWidth={2.5} />
            <path d="M40 12 L34 24 L46 24 Z" fill="var(--primary)" />
          </g>
          <text x={40} y={9} textAnchor="middle" style={{ fontSize: 9 }} className="fill-muted-foreground">N</text>
        </svg>
        <div className="grid flex-1 grid-cols-2 gap-3">
          <DataReadout label="Vind" value={spec.windMs} unit="m/s" hint={spec.windDir_sv} />
          <div className="rounded-md border border-border bg-background p-3">
            <p className="text-label text-muted-foreground">Lufttryck</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium">
              <TrendIcon trend={spec.trend} />
              {TREND_SV[spec.trend]}
            </p>
          </div>
        </div>
      </div>

      <dl className="grid gap-2 text-sm">
        <div className="flex gap-2">
          <dt className="text-label w-24 shrink-0 text-muted-foreground">Sjö</dt>
          <dd>{spec.seaState_sv}</dd>
        </div>
        {spec.observation_sv ? (
          <div className="flex gap-2">
            <dt className="text-label w-24 shrink-0 text-muted-foreground">Observation</dt>
            <dd>{spec.observation_sv}</dd>
          </div>
        ) : null}
        {spec.route_sv ? (
          <div className="flex gap-2">
            <dt className="text-label w-24 shrink-0 text-muted-foreground">Rutt</dt>
            <dd>{spec.route_sv}</dd>
          </div>
        ) : null}
        {spec.note_sv ? (
          <div className="flex gap-2">
            <dt className="text-label w-24 shrink-0 text-muted-foreground">Notering</dt>
            <dd>{spec.note_sv}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}
