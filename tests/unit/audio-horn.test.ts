import { describe, expect, it } from "vitest";
import {
  classifyDuration,
  gradeSoundProduce,
  scheduleBlasts,
  signalLengthMs,
  SOUND_SIGNALS,
} from "@/lib/audio/horn";

describe("sound-signal scheduling (SPEC §25.1)", () => {
  it("schedules blasts sequentially with gaps between them", () => {
    const events = scheduleBlasts(["short", "short"]);
    expect(events).toHaveLength(2);
    expect(events[0].startMs).toBe(0);
    // second blast starts after the first blast + one gap
    expect(events[1].startMs).toBe(events[0].durationMs + 1000);
  });

  it("a prolonged blast is longer than a short blast", () => {
    expect(signalLengthMs(["long"])).toBeGreaterThan(signalLengthMs(["short"]));
  });

  it("the doubt signal is five short blasts", () => {
    expect(SOUND_SIGNALS.doubt).toEqual([
      "short",
      "short",
      "short",
      "short",
      "short",
    ]);
  });
});

describe("blast classification with tolerance bands", () => {
  it("classifies clear short and long presses", () => {
    expect(classifyDuration(1000)).toBe("short");
    expect(classifyDuration(4500)).toBe("long");
  });

  it("returns null for an ambiguous press between the bands", () => {
    expect(classifyDuration(2600)).toBeNull();
  });

  it("returns null for an implausibly short tap", () => {
    expect(classifyDuration(100)).toBeNull();
  });
});

describe("gradeSoundProduce (§25.1 reproduce mode)", () => {
  it("accepts a correctly reproduced signal", () => {
    const g = gradeSoundProduce(["short", "short"], [1000, 1100]);
    expect(g.correct).toBe(true);
    expect(g.firstMismatch).toBeNull();
  });

  it("rejects a wrong sequence and reports the first mismatch", () => {
    const g = gradeSoundProduce(["short", "short"], [4500, 1000]);
    expect(g.correct).toBe(false);
    expect(g.firstMismatch).toBe(0);
    expect(g.produced[0]).toBe("long");
  });

  it("rejects the wrong number of blasts", () => {
    const g = gradeSoundProduce(["short"], [1000, 1000]);
    expect(g.correct).toBe(false);
    expect(g.firstMismatch).toBe(1);
  });

  it("flags ambiguous presses rather than guessing", () => {
    const g = gradeSoundProduce(["short"], [2600]);
    expect(g.correct).toBe(false);
    expect(g.ambiguousCount).toBe(1);
  });
});
