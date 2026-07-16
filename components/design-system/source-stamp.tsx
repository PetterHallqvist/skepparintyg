import { cn } from "@/lib/utils";

/**
 * Chart-edition stamp: date-stamped provenance note (SPEC §10.5, §38.4).
 * Every official fact shown to users carries one of these.
 */
export function SourceStamp({
  checkedAt,
  source,
  className,
}: {
  /** ISO date, e.g. "2026-07-16" */
  checkedAt: string;
  source?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border border-border px-2 py-0.5 text-label text-muted-foreground",
        className,
      )}
    >
      <span aria-hidden="true" className="size-1 rounded-full bg-current" />
      Senast kontrollerad{" "}
      <time dateTime={checkedAt} className="font-readout tracking-normal">
        {checkedAt}
      </time>
      {source ? <span className="normal-case">· {source}</span> : null}
    </span>
  );
}
