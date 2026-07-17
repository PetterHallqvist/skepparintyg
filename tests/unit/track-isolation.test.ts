import { describe, expect, it } from "vitest";
import { CERTIFICATION_IDS } from "@/lib/certifications/registry";
import { allTrackEntries, getTrackItems } from "@/lib/learning/tracks";

/**
 * THE phase-9 invariant: a learner practicing for certification X can never
 * be served an item from certification Y. The registry is strict — the old
 * silent `?? DEMO_ITEMS` fallback (which leaked Förarintyg items into every
 * unknown track id) must never come back.
 */
describe("track isolation", () => {
  it("item sets of different certifications are fully disjoint (object identity)", () => {
    const byCert = new Map<string, Set<unknown>>();
    for (const { cert, items } of allTrackEntries()) {
      const set = byCert.get(cert) ?? new Set();
      items.forEach((i) => set.add(i));
      byCert.set(cert, set);
    }
    const certs = [...byCert.keys()];
    for (let a = 0; a < certs.length; a++) {
      for (let b = a + 1; b < certs.length; b++) {
        for (const item of byCert.get(certs[a])!) {
          expect(
            byCert.get(certs[b])!.has(item),
            `${certs[a]} shares an item object with ${certs[b]}`,
          ).toBe(false);
        }
      }
    }
  });

  it("returns null for tracks another certification owns — no fallback", () => {
    expect(getTrackItems("src", "ljus")).toBeNull();
    expect(getTrackItems("src", "vajning")).toBeNull();
    expect(getTrackItems("src", "plotter")).toBeNull();
    expect(getTrackItems("forarintyg", "grunder")).toBeNull();
    expect(getTrackItems("seglarintyg_1", "knop")).toBeNull();
    expect(getTrackItems("kustskepparintyg", "ljus")).toBeNull();
  });

  it("returns null for unknown track ids on every certification", () => {
    for (const cert of CERTIFICATION_IDS) {
      expect(getTrackItems(cert, "demo"), cert).toBeNull();
      expect(getTrackItems(cert, ""), cert).toBeNull();
      expect(getTrackItems(cert, "finns-inte"), cert).toBeNull();
    }
  });

  it("every certification serves its own pass track", () => {
    for (const cert of CERTIFICATION_IDS) {
      const items = getTrackItems(cert, "pass");
      expect(items, cert).not.toBeNull();
      expect(items!.length, cert).toBeGreaterThanOrEqual(5);
    }
  });
});
