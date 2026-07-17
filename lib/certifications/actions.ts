"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  CERT_COOKIE,
  certIdSchema,
} from "@/lib/certifications/registry";
import { isSupabaseConfigured } from "@/lib/env";
import { logger } from "@/lib/observability/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Internal-path guard — same idiom as the auth callback (§61.2). */
function safeInternalPath(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : null;
}

/**
 * Set the learner's chosen certification (SPEC §12.2 "target certificate").
 * The httpOnly cookie is the runtime truth in both modes; in DB mode the
 * choice is also mirrored to the self-learner row (best effort — durability
 * across devices, never a gate).
 */
export async function setActiveCertification(
  certId: unknown,
  nasta?: unknown,
): Promise<void> {
  const parsed = certIdSchema.safeParse(certId);
  if (!parsed.success) throw new Error("okant_intyg");

  const jar = await cookies();
  jar.set(CERT_COOKIE, parsed.data, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
  });

  if (isSupabaseConfigured) {
    try {
      const supabase = await createSupabaseServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("learners")
          .update({ target_certification_id: parsed.data })
          .eq("is_self_profile", true);
      }
    } catch {
      // Cookie already set — the DB mirror is never a gate.
    }
  }

  logger.info("certification.selected", { certification: parsed.data });
  redirect(safeInternalPath(nasta) ?? "/app/start");
}

/** Form-action wrapper for the picker (values arrive as FormData). */
export async function setActiveCertificationForm(
  formData: FormData,
): Promise<void> {
  await setActiveCertification(
    formData.get("certification"),
    formData.get("nasta") ?? undefined,
  );
}
