"use client";

import { HornHoldControl } from "@/components/trainers/horn-control";
import type { ResponseWidgetProps } from "./types";

/**
 * sound_produce response widget (SPEC §25.1). Wraps the press-and-hold horn;
 * the held-duration sequence is graded server-side against the target signal.
 */
export function SoundProduce(props: ResponseWidgetProps) {
  const hint = props.interaction.hint_sv as string | undefined;
  return (
    <div className="space-y-3">
      {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
      <HornHoldControl {...props} />
    </div>
  );
}
