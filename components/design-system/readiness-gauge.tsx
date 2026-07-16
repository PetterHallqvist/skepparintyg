import { cn } from "@/lib/utils";

/** SPEC §17.4 readiness labels. */
export function readinessLabel(score: number): string {
  if (score < 40) return "Börja med grunderna";
  if (score < 60) return "På väg";
  if (score < 75) return "Behöver mer träning";
  if (score < 85) return "Nära provberedskap";
  if (score < 95) return "God beredskap";
  return "Mycket god beredskap";
}

/**
 * Beredskap gauge: 270° instrument arc with tick marks and a mono readout.
 * Pure SVG, server-renderable. Not a pass guarantee (SPEC §17, §68.5) —
 * always pair with an explanation surface ("Så beräknas detta").
 */
export function ReadinessGauge({
  score,
  size = 180,
  className,
}: {
  /** 0–100 */
  score: number;
  size?: number;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const startDeg = 135;
  const sweepDeg = 270;
  const r = 44;
  const c = 50;

  const arc = (fromDeg: number, toDeg: number) => {
    const a0 = ((fromDeg - 90) * Math.PI) / 180;
    const a1 = ((toDeg - 90) * Math.PI) / 180;
    const large = toDeg - fromDeg > 180 ? 1 : 0;
    return `M ${c + r * Math.cos(a0)} ${c + r * Math.sin(a0)} A ${r} ${r} 0 ${large} 1 ${
      c + r * Math.cos(a1)
    } ${c + r * Math.sin(a1)}`;
  };

  const ticks = Array.from({ length: 11 }, (_, i) => {
    const deg = startDeg + (sweepDeg * i) / 10;
    const a = ((deg - 90) * Math.PI) / 180;
    const r0 = i % 5 === 0 ? 36 : 39;
    return {
      x1: c + r0 * Math.cos(a),
      y1: c + r0 * Math.sin(a),
      x2: c + 41.5 * Math.cos(a),
      y2: c + 41.5 * Math.sin(a),
    };
  });

  return (
    <figure
      className={cn("inline-flex flex-col items-center gap-2", className)}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 100 100"
          role="img"
          aria-label={`Beredskap ${clamped} av 100 — ${readinessLabel(clamped)}`}
          className="size-full"
        >
          <path
            d={arc(startDeg, startDeg + sweepDeg)}
            fill="none"
            stroke="var(--border)"
            strokeWidth="1.5"
          />
          {clamped > 0 ? (
            <path
              d={arc(startDeg, startDeg + (sweepDeg * clamped) / 100)}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="3"
              strokeLinecap="butt"
            />
          ) : null}
          {ticks.map((t, i) => (
            <line
              key={i}
              {...t}
              stroke="var(--muted-foreground)"
              strokeWidth={i % 5 === 0 ? 0.9 : 0.5}
              opacity={0.6}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-readout text-4xl font-medium leading-none">
            {clamped}
          </span>
          <span className="text-label mt-1.5 text-muted-foreground">
            av 100
          </span>
        </div>
      </div>
      <figcaption className="text-sm font-medium">
        {readinessLabel(clamped)}
      </figcaption>
    </figure>
  );
}
