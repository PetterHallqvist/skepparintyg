import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

/**
 * Original mark: a chart "position fix" — circle with four cardinal ticks.
 * Precise, maritime, no kitsch. Do not replace with stock/clip art.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className={cn("size-7", className)}
    >
      <circle
        cx="14"
        cy="14"
        r="8.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="14" cy="14" r="1.6" fill="currentColor" />
      <path
        d="M14 1.5v5M14 21.5v5M1.5 14h5M21.5 14h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="size-6 text-sea-700 dark:text-sea-300" />
      <span className="text-lg font-semibold tracking-tight">
        {BRAND.name}
      </span>
    </span>
  );
}
