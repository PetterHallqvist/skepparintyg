import { cn } from "@/lib/utils";

/**
 * Instrument tile: letterspaced caps label over a mono tabular value.
 * The core "navigation console" element (SPEC §10 tech-precision direction).
 */
export function DataReadout({
  label,
  value,
  unit,
  hint,
  className,
}: {
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bezel flex flex-col gap-1 border border-border bg-card px-4 py-3",
        className,
      )}
    >
      <span className="text-label text-muted-foreground">{label}</span>
      <span className="font-readout text-2xl font-medium leading-none">
        {value}
        {unit ? (
          <span className="ml-1 text-sm text-muted-foreground">{unit}</span>
        ) : null}
      </span>
      {hint ? (
        <span className="text-xs text-muted-foreground">{hint}</span>
      ) : null}
    </div>
  );
}
