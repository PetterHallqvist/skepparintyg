/**
 * Structured JSON logger (SPEC §65.1). Server-side use.
 *
 * Scrubbing: never log answers, tokens, secrets, emails or free-text user
 * input. Scrub runs on known-sensitive key names as defence in depth —
 * callers are still responsible for not passing PII.
 */
const SENSITIVE_KEY = /(answer|token|secret|password|authorization|email|pnr|personnummer|audio)/i;

type LogLevel = "debug" | "info" | "warn" | "error";

function scrub(value: unknown, depth = 0): unknown {
  if (depth > 4 || value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map((v) => scrub(v, depth + 1));
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([k, v]) => [
      k,
      SENSITIVE_KEY.test(k) ? "[REDACTED]" : scrub(v, depth + 1),
    ]),
  );
}

function emit(
  level: LogLevel,
  event: string,
  fields: Record<string, unknown> = {},
) {
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    level,
    event,
    ...(scrub(fields) as Record<string, unknown>),
  });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  debug: (event: string, fields?: Record<string, unknown>) =>
    emit("debug", event, fields),
  info: (event: string, fields?: Record<string, unknown>) =>
    emit("info", event, fields),
  warn: (event: string, fields?: Record<string, unknown>) =>
    emit("warn", event, fields),
  error: (event: string, fields?: Record<string, unknown>) =>
    emit("error", event, fields),
};
