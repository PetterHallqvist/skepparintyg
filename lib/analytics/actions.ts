"use server";

import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PRIVACY_POLICY_VERSION } from "@/lib/commerce/constants";

/**
 * Persist an analytics-consent decision as an immutable consent event (§53) for
 * signed-in users. Anonymous visitors' decisions live only in the first-party
 * cookie. No-ops when unconfigured or signed out.
 */
export async function recordAnalyticsConsent(granted: boolean): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("consent_events").insert({
    user_id: user.id,
    purpose: "product_analytics",
    action: granted ? "grant" : "withdraw",
    policy_version: PRIVACY_POLICY_VERSION,
    evidence: { source: "consent_banner" },
  });
}
