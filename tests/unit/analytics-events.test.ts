import { describe, expect, it } from "vitest";
import { buildEnvelope, type AnalyticsEvent } from "@/lib/analytics/events";

describe("analytics envelope (§81)", () => {
  it("emits the event name with no props for prop-less events", () => {
    expect(buildEnvelope({ name: "free_diagnostic_started" })).toEqual({
      event: "free_diagnostic_started",
      properties: {},
    });
  });

  it("passes allow-listed enum/id props", () => {
    expect(
      buildEnvelope({ name: "free_diagnostic_completed", scoreBand: "75-100" }),
    ).toEqual({
      event: "free_diagnostic_completed",
      properties: { scoreBand: "75-100" },
    });
    expect(
      buildEnvelope({ name: "purchase_completed", productId: "forarintyg-digital" }),
    ).toEqual({
      event: "purchase_completed",
      properties: { productId: "forarintyg-digital" },
    });
  });

  it("drops any key that is not allow-listed for the event", () => {
    // Simulate a widened/abused payload with a smuggled PII field.
    const abused = {
      name: "purchase_completed",
      productId: "forarintyg-digital",
      email: "victim@example.com",
    } as unknown as AnalyticsEvent;
    const env = buildEnvelope(abused);
    expect(env.properties).toEqual({ productId: "forarintyg-digital" });
    expect(JSON.stringify(env)).not.toContain("@");
  });

  it("refuses an email-shaped value even in an allow-listed key", () => {
    const abused = {
      name: "waitlist_joined",
      certification: "user@example.com",
    } as unknown as AnalyticsEvent;
    expect(buildEnvelope(abused).properties).toEqual({});
  });

  it("refuses over-long free text in an allow-listed key", () => {
    const abused = {
      name: "checkout_started",
      productId: "x".repeat(100),
    } as unknown as AnalyticsEvent;
    expect(buildEnvelope(abused).properties).toEqual({});
  });
});
