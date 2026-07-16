import { Lightbulb } from "lucide-react";
import { Markdown } from "@/components/content/markdown";
import { DisclaimerBlock } from "@/components/design-system/disclaimer-block";

/**
 * Renders a `content_blocks` / `body_blocks` jsonb array (SPEC §38). One
 * renderer serves lessons (closing the M2 learner-facing gap), kunskapsbank
 * articles, and any prose surface. Unknown block types are skipped, never
 * crashed on.
 */
export type ContentBlock = { type: string; [key: string]: unknown };

export function BlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        const body = typeof block.body_sv === "string" ? block.body_sv : "";
        switch (block.type) {
          case "markdown":
            return (
              <div key={i} className="text-sm sm:text-base">
                <Markdown>{body}</Markdown>
              </div>
            );
          case "callout":
            return (
              <DisclaimerBlock
                key={i}
                className={
                  block.tone === "warning"
                    ? "border-warning bg-warning/10"
                    : undefined
                }
              >
                <Markdown>{body}</Markdown>
              </DisclaimerBlock>
            );
          case "worked_example":
            return (
              <div
                key={i}
                className="rounded-md border border-border bg-paper-sunken/60 p-4"
              >
                <p className="text-label mb-2 flex items-center gap-1.5 text-sea-700 dark:text-sea-300">
                  <Lightbulb aria-hidden="true" className="size-3.5" />
                  Exempel
                </p>
                <div className="text-sm">
                  <Markdown>{body}</Markdown>
                </div>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
