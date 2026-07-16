import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

/**
 * Standing disclaimer strip (SPEC §68). Calm, factual — never alarmist.
 */
export function DisclaimerBlock({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "flex items-start gap-2.5 border-l-2 border-navy-600 bg-secondary px-4 py-3 text-sm text-secondary-foreground dark:border-sea-300",
        className,
      )}
    >
      <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <div>{children}</div>
    </aside>
  );
}
