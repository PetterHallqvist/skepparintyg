/**
 * Pure entitlement logic (SPEC §52.3). The DB rows are the source of truth;
 * these predicates centralise the interpretation so the deck gate, the
 * learner-app gates and the tests all agree on what "active" means. The
 * seat-count invariant (active assignments ≤ seat_count) is ALSO enforced
 * transactionally in the DB (§52 hard rule) — `canAssignLearner` here is the
 * fast-path predicate, not the authority.
 */

export type EntitlementStatus = "active" | "refunded" | "revoked";

export interface Entitlement {
  id: string;
  productId: string;
  startsAt: string; // ISO timestamp
  expiresAt: string | null; // null = no expiry
  seatCount: number;
  status: EntitlementStatus;
  refundedAt: string | null;
}

export interface SeatAssignment {
  entitlementId: string;
  learnerId: string;
  removedAt: string | null;
}

/** An entitlement grants access iff active, started, unexpired, unrefunded. */
export function isActive(ent: Entitlement, now: Date): boolean {
  if (ent.status !== "active" || ent.refundedAt !== null) return false;
  const t = now.getTime();
  if (t < Date.parse(ent.startsAt)) return false;
  if (ent.expiresAt !== null && t >= Date.parse(ent.expiresAt)) return false;
  return true;
}

/** Current (non-removed) assignments for one entitlement. */
export function activeAssignments(
  ent: Entitlement,
  assignments: readonly SeatAssignment[],
): SeatAssignment[] {
  return assignments.filter(
    (a) => a.entitlementId === ent.id && a.removedAt === null,
  );
}

export function seatsAvailable(
  ent: Entitlement,
  assignments: readonly SeatAssignment[],
): number {
  return Math.max(0, ent.seatCount - activeAssignments(ent, assignments).length);
}

export type AssignRefusal =
  | "entitlement_inactive"
  | "already_assigned"
  | "no_seats_left";

/**
 * May `learnerId` be given a seat on `ent` right now? Returns the refusal
 * reason instead of a bare boolean so the UI can explain itself.
 */
export function canAssignLearner(
  ent: Entitlement,
  assignments: readonly SeatAssignment[],
  learnerId: string,
  now: Date,
): { ok: true } | { ok: false; reason: AssignRefusal } {
  if (!isActive(ent, now)) return { ok: false, reason: "entitlement_inactive" };
  const current = activeAssignments(ent, assignments);
  if (current.some((a) => a.learnerId === learnerId)) {
    return { ok: false, reason: "already_assigned" };
  }
  if (current.length >= ent.seatCount) {
    return { ok: false, reason: "no_seats_left" };
  }
  return { ok: true };
}

/**
 * Does any entitlement in the set grant access to `productId` right now?
 * (Purchaser view — learner access goes via seat assignment + RLS.)
 */
export function hasAccessToProduct(
  entitlements: readonly Entitlement[],
  productId: string,
  now: Date,
): boolean {
  return entitlements.some(
    (e) => e.productId === productId && isActive(e, now),
  );
}

/** Compute the expiry timestamp for a purchase made at `paidAt`. */
export function computeExpiry(paidAt: Date, accessMonths: number): Date {
  if (!Number.isInteger(accessMonths) || accessMonths < 1) {
    throw new Error(`Ogiltig åtkomstperiod: ${accessMonths} månader`);
  }
  const d = new Date(paidAt.getTime());
  const targetMonth = d.getUTCMonth() + accessMonths;
  const day = d.getUTCDate();
  d.setUTCMonth(targetMonth, 1); // avoid overflow first…
  const lastDay = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0),
  ).getUTCDate();
  d.setUTCDate(Math.min(day, lastDay)); // …then clamp (31 jan + 1 mån = 28/29 feb)
  return d;
}
