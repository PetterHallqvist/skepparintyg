import type { Point } from "@/lib/chart/geometry";

/**
 * Chart tool state machine (SPEC §20.9): explicit reducer, no scattered
 * component booleans. Task load always resets — stale tool state across
 * task changes is a spec-called-out bug class.
 */

export type ToolKind = "two_point" | "one_point" | "typed_only";

export type ToolState =
  | { mode: "idle"; kind: ToolKind }
  | { mode: "await_start"; kind: "two_point" }
  | { mode: "await_end"; kind: "two_point"; start: Point }
  | { mode: "two_placed"; kind: "two_point"; start: Point; end: Point }
  | { mode: "await_point"; kind: "one_point" }
  | { mode: "point_placed"; kind: "one_point"; point: Point }
  | { mode: "typed"; kind: "typed_only" }
  | { mode: "submitted"; kind: ToolKind }
  | { mode: "feedback"; kind: ToolKind };

export type ToolEvent =
  | { type: "TASK_LOADED"; kind: ToolKind }
  | { type: "PLACE"; point: Point }
  | { type: "CLEAR" }
  | { type: "SUBMITTED" }
  | { type: "FEEDBACK_SHOWN" };

export function initialToolState(kind: ToolKind): ToolState {
  if (kind === "two_point") return { mode: "await_start", kind };
  if (kind === "one_point") return { mode: "await_point", kind };
  return { mode: "typed", kind };
}

export function toolReducer(state: ToolState, event: ToolEvent): ToolState {
  switch (event.type) {
    case "TASK_LOADED":
      // Hard reset — never carry marks between tasks (§20.9).
      return initialToolState(event.kind);

    case "PLACE": {
      if (state.mode === "await_start") {
        return { mode: "await_end", kind: "two_point", start: event.point };
      }
      if (state.mode === "await_end") {
        return {
          mode: "two_placed",
          kind: "two_point",
          start: state.start,
          end: event.point,
        };
      }
      if (state.mode === "two_placed") {
        // Re-placing starts a fresh measurement from the new point.
        return { mode: "await_end", kind: "two_point", start: event.point };
      }
      if (state.mode === "await_point" || state.mode === "point_placed") {
        return { mode: "point_placed", kind: "one_point", point: event.point };
      }
      return state; // typed_only / submitted / feedback ignore placements
    }

    case "CLEAR":
      if (state.mode === "submitted" || state.mode === "feedback") return state;
      return initialToolState(state.kind);

    case "SUBMITTED":
      return { mode: "submitted", kind: state.kind };

    case "FEEDBACK_SHOWN":
      return state.mode === "submitted"
        ? { mode: "feedback", kind: state.kind }
        : state;

    default:
      return state;
  }
}
