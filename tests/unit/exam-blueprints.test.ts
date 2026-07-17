import { describe, expect, it } from "vitest";
import { CERTIFICATION_IDS } from "@/lib/certifications/registry";
import { EXAM_CONFIG } from "@/lib/exam/blueprints";
import { buildDemoExam, getDemoExamPool } from "@/lib/exam/demo";

/**
 * Per-certification exam assembly (SPEC §35.2 — no universal format; a
 * simulation can only contain its own certification's items).
 */
describe("per-certification demo exams", () => {
  it("every certification has a config and a non-empty pool", () => {
    for (const cert of CERTIFICATION_IDS) {
      expect(EXAM_CONFIG[cert], cert).toBeDefined();
      expect(getDemoExamPool(cert).length, cert).toBeGreaterThan(0);
    }
  });

  it("assembled item ids are namespaced to the certification — never mixed", () => {
    for (const cert of CERTIFICATION_IDS) {
      const { assembled } = buildDemoExam(cert, "seed-x");
      expect(assembled.itemOrder.length, cert).toBeGreaterThan(0);
      for (const id of assembled.itemOrder) {
        expect(id.startsWith(`${cert}/`), `${cert} got ${id}`).toBe(true);
      }
    }
  });

  it("is deterministic per (cert, seed) and varies across seeds", () => {
    for (const cert of CERTIFICATION_IDS) {
      const a = buildDemoExam(cert, "seed-1").assembled.itemOrder;
      const b = buildDemoExam(cert, "seed-1").assembled.itemOrder;
      expect(a, cert).toEqual(b);
    }
    // Förar's pool is large enough that different seeds shuffle differently.
    const s1 = buildDemoExam("forarintyg", "seed-1").assembled.itemOrder;
    const s2 = buildDemoExam("forarintyg", "seed-2").assembled.itemOrder;
    expect(s1).not.toEqual(s2);
  });

  it("uses the certification's title and keeps the diagnostic section separate", () => {
    for (const cert of CERTIFICATION_IDS) {
      const { blueprint, assembled } = buildDemoExam(cert, "seed-y");
      expect(blueprint.title).toBe(EXAM_CONFIG[cert].titleSv);
      const diag = assembled.sections.find((s) => s.isDiagnostic);
      const graded = assembled.sections.find((s) => !s.isDiagnostic);
      expect(diag, cert).toBeDefined();
      expect(graded, cert).toBeDefined();
      expect(graded!.itemIds.length, cert).toBeGreaterThan(0);
    }
  });

  it("every assembled item resolves in the pool map (grading can never miss)", () => {
    for (const cert of CERTIFICATION_IDS) {
      const { assembled, itemById } = buildDemoExam(cert, "seed-z");
      for (const id of assembled.itemOrder) {
        expect(itemById.get(id), `${cert} ${id}`).toBeDefined();
      }
    }
  });
});
