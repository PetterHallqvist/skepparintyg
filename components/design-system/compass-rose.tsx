/**
 * Decorative fine-line compass rose — original artwork, used as a quiet
 * backdrop motif (hero, dashboard). Purely presentational.
 */
export function CompassRose({ className }: { className?: string }) {
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle
        cx="100"
        cy="100"
        r="96"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      <circle
        cx="100"
        cy="100"
        r="78"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      <circle
        cx="100"
        cy="100"
        r="8"
        stroke="currentColor"
        strokeWidth="0.75"
      />
      {ticks.map((deg) => {
        const major = deg % 90 === 0;
        const mid = deg % 30 === 0;
        const len = major ? 14 : mid ? 9 : 4;
        return (
          <line
            key={deg}
            x1="100"
            y1={4}
            x2="100"
            y2={4 + len}
            stroke="currentColor"
            strokeWidth={major ? 1.1 : 0.5}
            transform={`rotate(${deg} 100 100)`}
          />
        );
      })}
      {/* Cardinal needles */}
      <path
        d="M100 26 L104 96 L100 100 L96 96 Z"
        stroke="currentColor"
        strokeWidth="0.75"
      />
      <path
        d="M100 174 L104 104 L100 100 L96 104 Z"
        stroke="currentColor"
        strokeWidth="0.75"
      />
      <path
        d="M26 100 L96 104 L100 100 L96 96 Z"
        stroke="currentColor"
        strokeWidth="0.75"
      />
      <path
        d="M174 100 L104 104 L100 100 L104 96 Z"
        stroke="currentColor"
        strokeWidth="0.75"
      />
      <text
        x="100"
        y="20"
        textAnchor="middle"
        fill="currentColor"
        fontSize="10"
        fontFamily="var(--font-plex-mono)"
      >
        N
      </text>
    </svg>
  );
}
