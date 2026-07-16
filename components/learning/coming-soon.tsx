import { StatusChip } from "@/components/design-system/status-chip";

/** Styled stub for routes whose feature lands in a later phase. */
export function ComingSoon({
  title,
  phase,
  description,
}: {
  title: string;
  phase: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <StatusChip tone="neutral">Byggs i {phase}</StatusChip>
      </header>
      <div className="bezel mt-6 flex min-h-64 items-center justify-center rounded-lg border border-border bg-card/50 p-8">
        <p className="max-w-md text-center text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
