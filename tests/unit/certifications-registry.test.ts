import { describe, expect, it } from "vitest";
import {
  ALL_CERTIFICATIONS,
  CERTIFICATION_IDS,
  CERTIFICATIONS,
  certIdSchema,
} from "@/lib/certifications/registry";
import { getTrackItems } from "@/lib/learning/tracks";
import { sanitizeDemoItem } from "@/lib/learning/demo";

/** SPEC §7.1 — the eight stable machine IDs, never a bare "seglarintyg". */
const SPEC_IDS = [
  "forarintyg",
  "batpraktik_dag_prep",
  "batpraktik_morker_prep",
  "kustskepparintyg",
  "src",
  "seglarintyg_1",
  "seglarintyg_2",
  "seglarintyg_3",
];

const GRADABLE_KINDS = new Set([
  "single_choice",
  "multiple_select",
  "numeric",
  "ordering",
  "matching",
  "rules_scenario",
  "light_build",
  "sound_produce",
  "waypoint_entry",
]);

describe("certification registry", () => {
  it("contains exactly the §7.1 ids", () => {
    expect([...CERTIFICATION_IDS].sort()).toEqual([...SPEC_IDS].sort());
  });

  it("rejects invalid ids (including the forbidden bare seglarintyg)", () => {
    expect(certIdSchema.safeParse("seglarintyg").success).toBe(false);
    expect(certIdSchema.safeParse("").success).toBe(false);
    expect(certIdSchema.safeParse("FORARINTYG").success).toBe(false);
    expect(certIdSchema.safeParse(undefined).success).toBe(false);
  });

  it("only forarintyg is active (§8.1)", () => {
    for (const def of ALL_CERTIFICATIONS) {
      expect(def.status).toBe(def.id === "forarintyg" ? "active" : "preview");
    }
  });

  it("every certification's first track is the mixed pass", () => {
    for (const def of ALL_CERTIFICATIONS) {
      expect(def.tracks[0]?.id).toBe("pass");
    }
  });

  it("every declared track resolves to a non-empty item list", () => {
    for (const def of ALL_CERTIFICATIONS) {
      for (const track of def.tracks) {
        const items = getTrackItems(def.id, track.id);
        expect(items, `${def.id}/${track.id}`).not.toBeNull();
        expect(items!.length, `${def.id}/${track.id}`).toBeGreaterThan(0);
      }
    }
  });

  it("meets the phase-9c per-certification pool minimums", () => {
    const total = (cert: (typeof CERTIFICATION_IDS)[number]) =>
      CERTIFICATIONS[cert].tracks.reduce(
        (n, t) => n + (getTrackItems(cert, t.id)?.length ?? 0),
        0,
      );
    expect(total("forarintyg")).toBeGreaterThanOrEqual(35);
    for (const id of CERTIFICATION_IDS.filter((c) => c !== "forarintyg")) {
      expect(total(id), id).toBeGreaterThanOrEqual(28);
    }
  });

  it("every item is complete and its kind is grade-dispatch-supported", () => {
    for (const def of ALL_CERTIFICATIONS) {
      for (const track of def.tracks) {
        const items = getTrackItems(def.id, track.id) ?? [];
        items.forEach((item, i) => {
          const at = `${def.id}/${track.id}[${i}]`;
          expect(item.index, at).toBe(i);
          expect(GRADABLE_KINDS.has(item.kind), `${at} kind=${item.kind}`).toBe(
            true,
          );
          expect(item.stemSv.length, at).toBeGreaterThan(0);
          expect(item.explanation.length, at).toBeGreaterThan(0);
          expect(item.sourceRef.length, at).toBeGreaterThan(0);
          expect(item.objectiveTitle.length, at).toBeGreaterThan(0);
        });
      }
    }
  });

  it("sanitizeDemoItem never leaks an answer key, for a sample of every certification", () => {
    for (const def of ALL_CERTIFICATIONS) {
      const items = getTrackItems(def.id, "pass")!;
      for (const item of items) {
        const challenge = sanitizeDemoItem(item, items.length);
        expect(challenge).not.toHaveProperty("answerKey");
        expect(challenge).not.toHaveProperty("explanation");
        expect(JSON.stringify(challenge)).not.toContain("answerKey");
      }
    }
  });

  it("chart lab applies to the navigation certificates only (§20.2)", () => {
    for (const def of ALL_CERTIFICATIONS) {
      expect(def.chartLab).toBe(
        def.id === "forarintyg" || def.id === "kustskepparintyg",
      );
    }
  });
});
