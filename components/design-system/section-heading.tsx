import { cn } from "@/lib/utils";

/**
 * Marketing/editorial section header: numbered kicker in chart-annotation
 * caps, then a serif display heading (SPEC §10.3 allows sparing serif).
 */
export function SectionHeading({
  kicker,
  title,
  lead,
  className,
  as: Heading = "h2",
}: {
  kicker?: string;
  title: string;
  lead?: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <header className={cn("max-w-2xl", className)}>
      {kicker ? (
        <p className="text-label mb-3 flex items-center gap-3 text-sea-700 dark:text-sea-300">
          <span aria-hidden="true" className="h-px w-8 bg-current" />
          {kicker}
        </p>
      ) : null}
      <Heading className="font-serif text-3xl font-medium tracking-tight text-balance sm:text-4xl">
        {title}
      </Heading>
      {lead ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {lead}
        </p>
      ) : null}
    </header>
  );
}
