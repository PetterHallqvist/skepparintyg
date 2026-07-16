/**
 * Consent storage + external store (SPEC §70.3, §81). First-party cookie only —
 * no third-party storage before consent. Decline-by-default: absence of a
 * cookie means "not decided", which the banner treats as no analytics.
 *
 * Exposed as a `useSyncExternalStore`-compatible store so the provider reads
 * consent without a setState-in-effect: `getSnapshot` returns a STABLE reference
 * (re-parsed only when the cookie string actually changes) and `writeConsent`
 * notifies subscribers.
 */

export interface ConsentState {
  analytics: boolean;
  decidedAt: string;
}

const COOKIE = "sjoklart_consent";
const MAX_AGE = 60 * 60 * 24 * 180; // 180 days

function rawCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${COOKIE}=`));
  return match ? match.slice(COOKIE.length + 1) : null;
}

function parse(raw: string | null): ConsentState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (typeof parsed?.analytics === "boolean") return parsed as ConsentState;
  } catch {
    /* fall through */
  }
  return null;
}

// Cache so getSnapshot returns a stable reference between unchanged reads.
let cachedRaw: string | null = null;
let cachedValue: ConsentState | null = null;
let primed = false;

const listeners = new Set<() => void>();

export function subscribeConsent(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getConsentSnapshot(): ConsentState | null {
  const raw = rawCookie();
  if (!primed || raw !== cachedRaw) {
    cachedRaw = raw;
    cachedValue = parse(raw);
    primed = true;
  }
  return cachedValue;
}

/** Server render always sees "not decided" — no cookie access on the server. */
export function getConsentServerSnapshot(): ConsentState | null {
  return null;
}

export function readConsent(): ConsentState | null {
  return parse(rawCookie());
}

export function writeConsent(state: ConsentState): void {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE}=${encodeURIComponent(
    JSON.stringify(state),
  )}; path=/; max-age=${MAX_AGE}; samesite=lax`;
  cachedRaw = null; // force re-parse on next snapshot
  primed = false;
  listeners.forEach((l) => l());
}
