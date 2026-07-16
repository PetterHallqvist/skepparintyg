import { describe, expect, it } from "vitest";
import { OFFICIAL_FACTS, getFact } from "@/lib/content/official-facts";

/**
 * SPEC §4: official facts are data with provenance — every fact must carry
 * a source and a verification date, and must never be silently stale.
 */
describe("official facts register", () => {
  it("every fact has source, verifiedAt and reviewBy dates", () => {
    for (const fact of OFFICIAL_FACTS) {
      expect(fact.sourceUrl).toMatch(/^https:\/\//);
      expect(fact.sourceOrg.length).toBeGreaterThan(0);
      expect(fact.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(fact.reviewBy).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(fact.reviewBy).getTime()).toBeGreaterThan(
        new Date(fact.verifiedAt).getTime(),
      );
    }
  });

  it("getFact throws on unknown ids", () => {
    expect(() => getFact("finns-inte")).toThrow(/Okänt officiellt faktum/);
  });

  it("pass threshold is expressed as 75 % (SPEC §4)", () => {
    expect(getFact("pass_threshold_digital").value).toBe("75 %");
  });
});
