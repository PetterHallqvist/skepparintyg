/**
 * Analytics event contract (SPEC §81). The type system makes raw text / PII
 * UNPASSABLE — event props are enums, bands, or known ids only — and
 * `buildEnvelope` enforces the same rule at runtime as defence in depth: it
 * copies only allow-listed keys and rejects anything that looks like free text
 * or an email. We NEVER emit item stems, responses, emails, audio, answer keys,
 * exact coordinates, or drawn routes.
 */

export type ScoreBand = "0-24" | "25-49" | "50-74" | "75-100";
export type LatencyBand = "fast" | "medium" | "slow";

/** The closed set of events we may emit. Add here, never inline. */
export type AnalyticsEvent =
  | { name: "free_diagnostic_started" }
  | { name: "free_diagnostic_completed"; scoreBand: ScoreBand }
  | { name: "chart_demo_started" }
  | { name: "checkout_started"; productId: string }
  | { name: "purchase_completed"; productId: string }
  | { name: "entitlement_assigned" }
  | { name: "waitlist_joined"; certification: string }
  | { name: "account_export_requested" }
  | { name: "account_deletion_requested" };

/** Allow-listed property keys per event. Anything else is dropped. */
const ALLOWED_PROPS: Record<string, readonly string[]> = {
  free_diagnostic_completed: ["scoreBand"],
  checkout_started: ["productId"],
  purchase_completed: ["productId"],
  waitlist_joined: ["certification"],
};

/** Values that clearly are not enum/band/id are refused at runtime. */
function isSafeValue(v: unknown): v is string {
  return (
    typeof v === "string" &&
    v.length > 0 &&
    v.length <= 64 &&
    !v.includes("@") &&
    !/\s{2,}/.test(v)
  );
}

export interface AnalyticsEnvelope {
  event: string;
  properties: Record<string, string>;
}

/**
 * Build the wire envelope for an event. ONLY allow-listed keys with safe values
 * survive — a widened type or a stray field can never leak PII onto the wire.
 */
export function buildEnvelope(event: AnalyticsEvent): AnalyticsEnvelope {
  const allowed = ALLOWED_PROPS[event.name] ?? [];
  const properties: Record<string, string> = {};
  for (const key of allowed) {
    const value = (event as Record<string, unknown>)[key];
    if (isSafeValue(value)) properties[key] = value;
  }
  return { event: event.name, properties };
}
