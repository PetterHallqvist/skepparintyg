import { describe, expect, it } from "vitest";
import { remainingMs, isExpired, formatRemaining } from "@/lib/exam/timer";

const start = "2026-07-16T10:00:00.000Z";

describe("exam timer (§35.5)", () => {
  it("counts down and floors at zero", () => {
    expect(remainingMs(start, 90 * 60, new Date("2026-07-16T10:00:00Z"))).toBe(
      90 * 60 * 1000,
    );
    expect(remainingMs(start, 90 * 60, new Date("2026-07-16T10:30:00Z"))).toBe(
      60 * 60 * 1000,
    );
    expect(remainingMs(start, 90 * 60, new Date("2026-07-16T12:00:00Z"))).toBe(0);
  });

  it("marks expiry at and after the end", () => {
    expect(isExpired(start, 3600, new Date("2026-07-16T10:59:59Z"))).toBe(false);
    expect(isExpired(start, 3600, new Date("2026-07-16T11:00:00Z"))).toBe(true);
    expect(isExpired(start, 3600, new Date("2026-07-16T11:00:01Z"))).toBe(true);
  });

  it("formats mm:ss", () => {
    expect(formatRemaining(90 * 60 * 1000)).toBe("90:00");
    expect(formatRemaining(65 * 1000)).toBe("1:05");
    expect(formatRemaining(0)).toBe("0:00");
  });
});
