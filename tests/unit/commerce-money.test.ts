import { describe, expect, it } from "vitest";
import fc from "fast-check";
import {
  assertOre,
  computeOrderTotals,
  formatOre,
  formatVatRate,
  splitVat,
} from "@/lib/commerce/money";

describe("integer-öre discipline (SPEC §52.1)", () => {
  it("rejects non-integer amounts", () => {
    expect(() => assertOre(99.5)).toThrow(/heltal öre/);
    expect(() => splitVat(100.01, 2500)).toThrow(/heltal öre/);
  });

  it("rejects invalid VAT rates", () => {
    expect(() => splitVat(100, -1)).toThrow(/momssats/);
    expect(() => splitVat(100, 25.5)).toThrow(/momssats/);
  });
});

describe("splitVat", () => {
  it("splits 25 % Swedish VAT on a typical price (895 kr)", () => {
    const s = splitVat(89_500, 2500);
    expect(s.exVatOre).toBe(71_600); // 716,00 kr
    expect(s.vatOre).toBe(17_900); // 179,00 kr
    expect(s.exVatOre + s.vatOre).toBe(89_500);
  });

  it("handles 0 % (rate stored as data, not assumed)", () => {
    const s = splitVat(89_500, 0);
    expect(s.exVatOre).toBe(89_500);
    expect(s.vatOre).toBe(0);
  });

  it("property: parts are integers and always sum back to the inclusive total", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -10_000_000, max: 10_000_000 }),
        fc.integer({ min: 0, max: 5000 }),
        (incVatOre, bps) => {
          const s = splitVat(incVatOre, bps);
          expect(Number.isInteger(s.exVatOre)).toBe(true);
          expect(Number.isInteger(s.vatOre)).toBe(true);
          expect(s.exVatOre + s.vatOre).toBe(incVatOre);
        },
      ),
    );
  });

  it("property: VAT share is monotone in the rate", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 10_000_000 }),
        fc.integer({ min: 0, max: 4999 }),
        (incVatOre, bps) => {
          const lower = splitVat(incVatOre, bps);
          const higher = splitVat(incVatOre, bps + 1);
          expect(higher.vatOre).toBeGreaterThanOrEqual(lower.vatOre);
        },
      ),
    );
  });
});

describe("computeOrderTotals", () => {
  it("keeps the three totals consistent for a single line", () => {
    const t = computeOrderTotals([
      { unitAmountOreIncVat: 89_500, vatRateBasisPoints: 2500, quantity: 1 },
    ]);
    expect(t).toEqual({ subtotalOre: 71_600, vatOre: 17_900, totalOre: 89_500 });
  });

  it("rejects non-positive quantities", () => {
    expect(() =>
      computeOrderTotals([
        { unitAmountOreIncVat: 100, vatRateBasisPoints: 2500, quantity: 0 },
      ]),
    ).toThrow(/antal/);
  });

  it("property: subtotal + VAT === total across mixed-rate carts", () => {
    const line = fc.record({
      unitAmountOreIncVat: fc.integer({ min: 0, max: 1_000_000 }),
      vatRateBasisPoints: fc.constantFrom(0, 600, 1200, 2500),
      quantity: fc.integer({ min: 1, max: 5 }),
    });
    fc.assert(
      fc.property(fc.array(line, { minLength: 0, maxLength: 6 }), (lines) => {
        const t = computeOrderTotals(lines);
        expect(t.subtotalOre + t.vatOre).toBe(t.totalOre);
        expect(t.totalOre).toBe(
          lines.reduce(
            (sum, l) => sum + l.unitAmountOreIncVat * l.quantity,
            0,
          ),
        );
      }),
    );
  });
});

describe("Swedish formatting", () => {
  it("formats öre with NBSP grouping and comma decimals", () => {
    expect(formatOre(89_500)).toBe("895,00 kr");
    expect(formatOre(123_456_789)).toBe("1 234 567,89 kr");
    expect(formatOre(5)).toBe("0,05 kr");
    expect(formatOre(0)).toBe("0,00 kr");
    expect(formatOre(-89_500)).toBe("−895,00 kr");
  });

  it("formats VAT rates from basis points", () => {
    expect(formatVatRate(2500)).toBe("25 %");
    expect(formatVatRate(1250)).toBe("12,5 %");
  });
});
