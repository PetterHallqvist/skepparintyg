import { cn } from "@/lib/utils";

const tones = {
  neutral: "border-border text-muted-foreground",
  info: "border-sea-700/40 text-sea-800 dark:border-sea-300/40 dark:text-sea-300",
  success: "border-success/40 text-success",
  warning: "border-warning/50 text-warning",
  danger: "border-destructive/40 text-destructive",
} as const;

/**
 * Small status marker. Colour is never the only signal (SPEC §10.2):
 * always renders its text label.
 */
export function StatusChip({
  tone = "neutral",
  children,
  className,
}: {
  tone?: keyof typeof tones;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-label",
        tones[tone],
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
