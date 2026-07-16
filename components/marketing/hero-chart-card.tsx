import { DataReadout } from "@/components/design-system/data-readout";
import { BRAND } from "@/lib/brand";

/**
 * Hero visual: a miniature, ORIGINAL fictional chart vignette with a plotted
 * course, rendered as a navigation-console card. Static preview of the chart
 * lab (the real interactive lab ships in Phase 3). All geography is invented
 * (SPEC §20.1); the watermark is always present.
 */
export function HeroChartCard() {
  return (
    <div className="theme-instrument bezel overflow-hidden rounded-lg border border-border bg-background shadow-2xl shadow-navy-950/25">
      {/* Console header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-label text-muted-foreground">
          Sjökortslabb · Uppgift 12
        </span>
        <span className="text-label text-sea-300">Rita kurslinjen</span>
      </div>

      {/* Fictional chart vignette */}
      <div className="bg-graticule relative">
        <svg
          viewBox="0 0 480 300"
          role="img"
          aria-label="Utsnitt ur ett fiktivt övningssjökort med en plottad kurslinje mellan två punkter"
          className="block w-full"
        >
          {/* water */}
          <rect width="480" height="300" fill="oklch(0.28 0.045 240)" />
          {/* depth contours */}
          <path
            d="M-20 250 Q 120 200 200 240 T 500 220"
            fill="none"
            stroke="oklch(0.36 0.05 235)"
            strokeWidth="1"
          />
          <path
            d="M-20 280 Q 140 240 230 270 T 500 255"
            fill="none"
            stroke="oklch(0.36 0.05 235)"
            strokeWidth="1"
          />
          {/* land: north island */}
          <path
            d="M 0 0 H 190 Q 175 30 140 38 Q 90 46 70 80 Q 55 105 10 110 L 0 112 Z"
            fill="oklch(0.42 0.055 150)"
            stroke="oklch(0.62 0.06 150)"
            strokeWidth="1.5"
          />
          {/* land: east skerry */}
          <path
            d="M 480 90 Q 430 95 415 125 Q 405 150 430 168 Q 460 180 480 172 Z"
            fill="oklch(0.42 0.055 150)"
            stroke="oklch(0.62 0.06 150)"
            strokeWidth="1.5"
          />
          {/* shallow area hatch near skerry */}
          <circle
            cx="392"
            cy="195"
            r="16"
            fill="none"
            stroke="oklch(0.6 0.09 220)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <text
            x="392"
            y="199"
            textAnchor="middle"
            fontSize="10"
            fill="oklch(0.75 0.05 220)"
            fontFamily="var(--font-plex-mono)"
          >
            2,4
          </text>
          {/* depth soundings */}
          {[
            [150, 170, "12"],
            [240, 120, "18"],
            [330, 90, "24"],
            [265, 235, "8,6"],
            [95, 235, "6,2"],
          ].map(([x, y, d]) => (
            <text
              key={`${x}-${y}`}
              x={x}
              y={y}
              textAnchor="middle"
              fontSize="10"
              fill="oklch(0.68 0.03 230)"
              fontFamily="var(--font-plex-mono)"
            >
              {d}
            </text>
          ))}
          {/* lateral mark (green cone) */}
          <g transform="translate(210 190)">
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-14"
              stroke="oklch(0.8 0.13 155)"
              strokeWidth="2"
            />
            <path d="M -5 -14 h 10 l -5 -9 z" fill="oklch(0.8 0.13 155)" />
          </g>
          {/* lighthouse dot + sector hint */}
          <g transform="translate(60 60)">
            <circle r="3.5" fill="oklch(0.9 0.02 90)" />
            <circle
              r="9"
              fill="none"
              stroke="oklch(0.9 0.02 90)"
              strokeWidth="0.8"
              opacity="0.6"
            />
            <text
              x="14"
              y="4"
              fontSize="9"
              fill="oklch(0.8 0.02 90)"
              fontFamily="var(--font-plex-mono)"
            >
              Fl(2) 10s
            </text>
          </g>
          {/* plotted course line */}
          <g>
            <line
              x1="96"
              y1="232"
              x2="352"
              y2="118"
              stroke="oklch(0.78 0.098 215)"
              strokeWidth="2"
            />
            <circle
              cx="96"
              cy="232"
              r="4"
              fill="none"
              stroke="oklch(0.78 0.098 215)"
              strokeWidth="1.5"
            />
            <circle
              cx="352"
              cy="118"
              r="4"
              fill="none"
              stroke="oklch(0.78 0.098 215)"
              strokeWidth="1.5"
            />
            {/* arrowhead */}
            <path
              d="M 352 118 l -12 1.5 l 7 -9.5 z"
              fill="oklch(0.78 0.098 215)"
            />
            <text
              x="215"
              y="163"
              fontSize="11"
              fill="oklch(0.86 0.07 212)"
              fontFamily="var(--font-plex-mono)"
              transform="rotate(-24 224 175)"
            >
              047° · 3,2 M
            </text>
          </g>
          {/* watermark — always present (SPEC §20.1) */}
          <text
            x="240"
            y="290"
            textAnchor="middle"
            fontSize="9"
            letterSpacing="2"
            fill="oklch(0.65 0.02 230)"
            fontFamily="var(--font-plex-mono)"
          >
            ÖVNINGSKORT — EJ FÖR NAVIGATION
          </text>
        </svg>
      </div>

      {/* Instrument readouts */}
      <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
        <DataReadout
          label="Kurs"
          value="047"
          unit="°"
          className="border-0 bg-transparent"
        />
        <DataReadout
          label="Distans"
          value="3,2"
          unit="M"
          className="border-0 bg-transparent"
        />
        <DataReadout
          label="Din avvikelse"
          value="±2"
          unit="°"
          hint="inom tolerans"
          className="border-0 bg-transparent"
        />
      </div>

      <p className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
        {BRAND.navigationDisclaimer} Fiktivt övningsområde.
      </p>
    </div>
  );
}
