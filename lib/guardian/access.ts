import "server-only";
import crypto from "node:crypto";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { logger } from "@/lib/observability/logger";

/**
 * Minor-access PIN (SPEC §43.5). A guardian sets a short PIN that lets a minor
 * enter "learner mode" on a shared device without the guardian's own login. The
 * PIN is:
 *   - slow-hashed with scrypt and a per-PIN random salt (never stored plain),
 *   - verified in constant time,
 *   - rate-limited (lockout after repeated failures),
 *   - rotatable.
 * The `learner_access_tokens` table has NO client RLS policy (default deny), so
 * all reads/writes go through the service client here — and every caller must
 * FIRST have verified guardian access with the user's own RLS client.
 */

const SCRYPT_KEYLEN = 64;
// cost ~ 2^14; deliberately slow to blunt brute force on a 4–8 digit PIN.
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const PIN_RE = /^\d{4,8}$/;

export class PinError extends Error {
  constructor(
    message: string,
    readonly code:
      | "invalid_pin_format"
      | "locked"
      | "not_set"
      | "wrong_pin",
  ) {
    super(message);
    this.name = "PinError";
  }
}

/** Hash a PIN as `scrypt$<saltHex>$<hashHex>`. Pure — unit-tested. */
export function hashPin(pin: string): string {
  if (!PIN_RE.test(pin)) {
    throw new PinError("PIN måste vara 4–8 siffror.", "invalid_pin_format");
  }
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(pin, salt, SCRYPT_KEYLEN, SCRYPT_PARAMS);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

/** Constant-time verify of a PIN against a stored `scrypt$…` string. Pure. */
export function verifyPinAgainstHash(pin: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const salt = Buffer.from(parts[1], "hex");
  const expected = Buffer.from(parts[2], "hex");
  if (salt.length === 0 || expected.length !== SCRYPT_KEYLEN) return false;
  const actual = crypto.scryptSync(pin, salt, SCRYPT_KEYLEN, SCRYPT_PARAMS);
  return crypto.timingSafeEqual(actual, expected);
}

/** Set/rotate a learner's PIN. Caller MUST have verified guardian access. */
export async function setLearnerPin(
  learnerId: string,
  pin: string,
): Promise<void> {
  const token_hash = hashPin(pin); // throws PinError on bad format
  const svc = createSupabaseServiceClient();
  const { error } = await svc.from("learner_access_tokens").upsert(
    {
      learner_id: learnerId,
      token_hash,
      algo: "scrypt",
      failed_attempts: 0,
      locked_until: null,
      rotated_at: new Date().toISOString(),
    },
    { onConflict: "learner_id" },
  );
  if (error) throw new Error(`Kunde inte spara PIN: ${error.message}`);
}

/**
 * Verify a PIN for learner mode. Enforces lockout. On success resets the
 * failure counter; on failure increments it and locks after the threshold.
 * Returns true only on a correct PIN.
 */
export async function verifyLearnerPin(
  learnerId: string,
  pin: string,
): Promise<boolean> {
  if (!PIN_RE.test(pin)) {
    throw new PinError("PIN måste vara 4–8 siffror.", "invalid_pin_format");
  }
  const svc = createSupabaseServiceClient();
  const { data: row } = await svc
    .from("learner_access_tokens")
    .select("token_hash,failed_attempts,locked_until")
    .eq("learner_id", learnerId)
    .maybeSingle();

  if (!row) throw new PinError("Ingen PIN är satt.", "not_set");

  if (row.locked_until && new Date(row.locked_until) > new Date()) {
    throw new PinError("För många försök. Försök igen senare.", "locked");
  }

  if (verifyPinAgainstHash(pin, row.token_hash)) {
    await svc
      .from("learner_access_tokens")
      .update({ failed_attempts: 0, locked_until: null })
      .eq("learner_id", learnerId);
    return true;
  }

  const attempts = (row.failed_attempts ?? 0) + 1;
  const locked =
    attempts >= MAX_FAILED_ATTEMPTS
      ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000).toISOString()
      : null;
  await svc
    .from("learner_access_tokens")
    .update({ failed_attempts: attempts, locked_until: locked })
    .eq("learner_id", learnerId);
  if (locked) {
    logger.warn("guardian.pin_locked", { learnerId });
    throw new PinError("För många försök. Försök igen senare.", "locked");
  }
  return false;
}

/** Whether a learner has a PIN set (for UI state). Guardian-verified upstream. */
export async function learnerHasPin(learnerId: string): Promise<boolean> {
  const svc = createSupabaseServiceClient();
  const { data } = await svc
    .from("learner_access_tokens")
    .select("learner_id")
    .eq("learner_id", learnerId)
    .maybeSingle();
  return data !== null;
}
