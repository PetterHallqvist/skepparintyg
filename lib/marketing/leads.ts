"use server";

import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { PRIVACY_POLICY_VERSION } from "@/lib/commerce/constants";
import { logger } from "@/lib/observability/logger";

/**
 * Lead capture (SPEC §9.3, §53). Used by the free-funnel "save my result" and by
 * waitlist forms. Two hard rules baked in here:
 *   - Marketing consent is a SEPARATE, opt-in flag — never bundled, default off.
 *   - The result/flow works with NO email (§9.3 "no email hostage"): an empty
 *     email still returns ok, it just stores nothing.
 * Writes go through the service client (leads/consent_events have no client
 * insert surface). Best-effort: a storage failure never blocks the UX.
 */

const schema = z.object({
  email: z.union([z.email(), z.literal("")]).optional(),
  source: z.string().min(1).max(80),
  ageBand: z
    .enum(["under_13", "13_15", "16_17", "18_plus", "unknown"])
    .optional(),
  marketingConsent: z.boolean().default(false),
  diagnosticResult: z.record(z.string(), z.unknown()).optional(),
});

export type LeadResult = { ok: boolean; stored: boolean };

export async function captureLead(
  input: z.input<typeof schema>,
): Promise<LeadResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, stored: false };
  const { email, source, ageBand, marketingConsent, diagnosticResult } =
    parsed.data;

  // No email → nothing to store, but the flow still succeeds (§9.3).
  if (!email) return { ok: true, stored: false };
  if (!isSupabaseConfigured) return { ok: true, stored: false };

  try {
    const svc = createSupabaseServiceClient();
    const { data: lead, error } = await svc
      .from("leads")
      .insert({
        email,
        age_band: ageBand ?? null,
        source,
        diagnostic_result: diagnosticResult ?? null,
      })
      .select("id")
      .single();
    if (error || !lead) return { ok: true, stored: false };

    if (marketingConsent) {
      // Separate, purpose-specific consent event (§53) — never bundled.
      await svc.from("consent_events").insert({
        lead_id: lead.id,
        purpose: "marketing_email",
        action: "grant",
        policy_version: PRIVACY_POLICY_VERSION,
        evidence: { source, ts: new Date().toISOString() },
      });
    }
    return { ok: true, stored: true };
  } catch (err) {
    logger.error("lead.capture_failed", {
      message: err instanceof Error ? err.message : "okänt fel",
    });
    return { ok: true, stored: false };
  }
}
