import { describe, expect, it } from "vitest";
import {
  initialToolState,
  toolReducer,
  type ToolState,
} from "@/components/chart/tool-reducer";

const p1 = { x: 10, y: 10 };
const p2 = { x: 50, y: 30 };
const p3 = { x: 90, y: 90 };

describe("chart tool reducer (SPEC §20.9)", () => {
  it("two-point flow: start → end → re-place restarts", () => {
    let s: ToolState = initialToolState("two_point");
    expect(s.mode).toBe("await_start");
    s = toolReducer(s, { type: "PLACE", point: p1 });
    expect(s.mode).toBe("await_end");
    s = toolReducer(s, { type: "PLACE", point: p2 });
    expect(s).toMatchObject({ mode: "two_placed", start: p1, end: p2 });
    s = toolReducer(s, { type: "PLACE", point: p3 });
    expect(s).toMatchObject({ mode: "await_end", start: p3 });
  });

  it("one-point flow: placement is replaceable", () => {
    let s: ToolState = initialToolState("one_point");
    s = toolReducer(s, { type: "PLACE", point: p1 });
    s = toolReducer(s, { type: "PLACE", point: p2 });
    expect(s).toMatchObject({ mode: "point_placed", point: p2 });
  });

  it("typed-only ignores chart placements", () => {
    const s = toolReducer(initialToolState("typed_only"), {
      type: "PLACE",
      point: p1,
    });
    expect(s.mode).toBe("typed");
  });

  it("TASK_LOADED hard-resets any state (no stale marks between tasks)", () => {
    let s: ToolState = initialToolState("two_point");
    s = toolReducer(s, { type: "PLACE", point: p1 });
    s = toolReducer(s, { type: "PLACE", point: p2 });
    s = toolReducer(s, { type: "SUBMITTED" });
    s = toolReducer(s, { type: "TASK_LOADED", kind: "one_point" });
    expect(s).toEqual({ mode: "await_point", kind: "one_point" });
  });

  it("submitted/feedback states ignore placement and clear", () => {
    let s: ToolState = initialToolState("one_point");
    s = toolReducer(s, { type: "PLACE", point: p1 });
    s = toolReducer(s, { type: "SUBMITTED" });
    expect(toolReducer(s, { type: "PLACE", point: p2 }).mode).toBe("submitted");
    expect(toolReducer(s, { type: "CLEAR" }).mode).toBe("submitted");
    s = toolReducer(s, { type: "FEEDBACK_SHOWN" });
    expect(s.mode).toBe("feedback");
  });

  it("CLEAR resets an in-progress measurement", () => {
    let s: ToolState = initialToolState("two_point");
    s = toolReducer(s, { type: "PLACE", point: p1 });
    s = toolReducer(s, { type: "CLEAR" });
    expect(s.mode).toBe("await_start");
  });
});
