import { describe, expect, it } from "vitest";
import {
  canAssignLearner,
  computeExpiry,
  hasAccessToProduct,
  isActive,
  seatsAvailable,
  type Entitlement,
  type SeatAssignment,
} from "@/lib/commerce/entitlement";

const NOW = new Date("2026-07-16T12:00:00Z");

const ent = (over: Partial<Entitlement> = {}): Entitlement => ({
  id: "e1",
  productId: "forarintyg-digital",
  startsAt: "2026-07-01T00:00:00Z",
  expiresAt: "2027-07-01T00:00:00Z",
  seatCount: 1,
  status: "active",
  refundedAt: null,
  ...over,
});

const seat = (over: Partial<SeatAssignment> = {}): SeatAssignment => ({
  entitlementId: "e1",
  learnerId: "l1",
  removedAt: null,
  ...over,
});

describe("isActive (SPEC §52.3)", () => {
  it("grants inside the window", () => {
    expect(isActive(ent(), NOW)).toBe(true);
  });

  it("denies before start, at/after expiry, when refunded or revoked", () => {
    expect(isActive(ent({ startsAt: "2026-08-01T00:00:00Z" }), NOW)).toBe(false);
    expect(isActive(ent({ expiresAt: "2026-07-16T12:00:00Z" }), NOW)).toBe(false);
    expect(isActive(ent({ refundedAt: "2026-07-10T00:00:00Z" }), NOW)).toBe(false);
    expect(isActive(ent({ status: "revoked" }), NOW)).toBe(false);
  });

  it("treats null expiry as no expiry", () => {
    expect(isActive(ent({ expiresAt: null }), NOW)).toBe(true);
  });
});

describe("seat accounting (§52 hard rule: assignments ≤ seat_count)", () => {
  it("counts only non-removed assignments on this entitlement", () => {
    const assignments = [
      seat(),
      seat({ learnerId: "l2", removedAt: "2026-07-02T00:00:00Z" }),
      seat({ entitlementId: "other", learnerId: "l3" }),
    ];
    expect(seatsAvailable(ent({ seatCount: 2 }), assignments)).toBe(1);
  });

  it("refuses over-assignment with a reason", () => {
    const full = canAssignLearner(ent(), [seat()], "l2", NOW);
    expect(full).toEqual({ ok: false, reason: "no_seats_left" });
  });

  it("refuses duplicates and inactive entitlements", () => {
    expect(canAssignLearner(ent({ seatCount: 2 }), [seat()], "l1", NOW)).toEqual(
      { ok: false, reason: "already_assigned" },
    );
    expect(
      canAssignLearner(ent({ status: "refunded" }), [], "l1", NOW),
    ).toEqual({ ok: false, reason: "entitlement_inactive" });
  });

  it("permits assignment when a seat is free", () => {
    expect(canAssignLearner(ent(), [], "l1", NOW)).toEqual({ ok: true });
  });

  it("a removed seat can be re-used", () => {
    const assignments = [seat({ removedAt: "2026-07-05T00:00:00Z" })];
    expect(canAssignLearner(ent(), assignments, "l2", NOW)).toEqual({
      ok: true,
    });
  });
});

describe("hasAccessToProduct", () => {
  it("requires a matching, active entitlement", () => {
    const set = [ent({ productId: "other" }), ent({ status: "refunded" })];
    expect(hasAccessToProduct(set, "forarintyg-digital", NOW)).toBe(false);
    expect(hasAccessToProduct([...set, ent()], "forarintyg-digital", NOW)).toBe(
      true,
    );
  });
});

describe("computeExpiry", () => {
  it("adds whole months in UTC", () => {
    expect(computeExpiry(new Date("2026-07-16T09:30:00Z"), 12).toISOString()).toBe(
      "2027-07-16T09:30:00.000Z",
    );
  });

  it("clamps to the last day of shorter months", () => {
    expect(computeExpiry(new Date("2026-01-31T00:00:00Z"), 1).toISOString()).toBe(
      "2026-02-28T00:00:00.000Z",
    );
    // Leap year
    expect(computeExpiry(new Date("2028-01-31T00:00:00Z"), 1).toISOString()).toBe(
      "2028-02-29T00:00:00.000Z",
    );
  });

  it("rejects nonsense periods", () => {
    expect(() => computeExpiry(NOW, 0)).toThrow(/åtkomstperiod/);
  });
});
