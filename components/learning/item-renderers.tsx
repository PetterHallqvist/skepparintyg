"use client";

import {
  Matching,
  MultipleSelect,
  Numeric,
  Ordering,
  SingleChoice,
} from "./renderers/basic";
import { WaypointEntry } from "./renderers/waypoint";
import type { ItemResponse, ResponseWidgetProps } from "./renderers/types";

/**
 * Response-widget registry. One entry per item kind; the session player calls
 * ItemRenderer to draw the interactive answer control. The stimulus (light
 * scene, vessel scene, plotter frame, …) is rendered separately by StimulusView
 * so a stimulus can pair with any response kind (SPEC §24–27 architecture).
 *
 * Trainer widgets that depend on a heavy stimulus component (light_build,
 * sound_produce, rules_scenario) register themselves here as their sub-phase
 * lands; the grader already understands every kind.
 */

export type { ItemResponse };
export { StimulusView } from "./renderers/stimulus";

const REGISTRY: Record<string, (props: ResponseWidgetProps) => React.ReactNode> =
  {
    single_choice: SingleChoice,
    multiple_select: MultipleSelect,
    numeric: Numeric,
    ordering: Ordering,
    matching: Matching,
    waypoint_entry: WaypointEntry,
  };

export function ItemRenderer({
  kind,
  interaction,
  disabled,
  onChange,
}: {
  kind: string;
  interaction: Record<string, unknown>;
  disabled: boolean;
  onChange: (response: ItemResponse | null) => void;
}) {
  const Widget = REGISTRY[kind];
  if (!Widget) {
    return (
      <p className="text-sm text-muted-foreground">
        Uppgiftstypen {kind} kommer i en senare fas.
      </p>
    );
  }
  return (
    <Widget interaction={interaction} disabled={disabled} onChange={onChange} />
  );
}
