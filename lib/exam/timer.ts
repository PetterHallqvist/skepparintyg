/**
 * Server-authoritative exam timer (SPEC §35.5). Pure functions over an ISO
 * start time + a duration; the SERVER is the clock of record — the client only
 * displays what `remainingMs` returns. A late submission past expiry is still
 * accepted for grading but flagged expired, so a stalled client can't gain time.
 */

export function endTimeMs(startedAtIso: string, durationSeconds: number): number {
  return Date.parse(startedAtIso) + durationSeconds * 1000;
}

export function remainingMs(
  startedAtIso: string,
  durationSeconds: number,
  now: Date,
): number {
  return Math.max(0, endTimeMs(startedAtIso, durationSeconds) - now.getTime());
}

export function isExpired(
  startedAtIso: string,
  durationSeconds: number,
  now: Date,
): boolean {
  return now.getTime() >= endTimeMs(startedAtIso, durationSeconds);
}

/** "mm:ss" for the countdown display. */
export function formatRemaining(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
