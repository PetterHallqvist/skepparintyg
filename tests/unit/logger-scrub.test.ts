import { afterEach, describe, expect, it, vi } from "vitest";
import { logger } from "@/lib/observability/logger";

/** SPEC §65.1: logs must never contain answers, tokens or PII. */
describe("logger scrubbing", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("redacts sensitive keys at any depth", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.info("attempt.submitted", {
      itemId: "abc",
      answer: "047",
      nested: { userEmail: "someone@example.com", authToken: "xyz" },
    });
    const line = spy.mock.calls[0][0] as string;
    expect(line).toContain('"itemId":"abc"');
    expect(line).not.toContain("047");
    expect(line).not.toContain("someone@example.com");
    expect(line).not.toContain("xyz");
    expect(line).toContain("[REDACTED]");
  });
});
