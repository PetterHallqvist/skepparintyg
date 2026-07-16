"use server";

import { z } from "zod";
import { clientEnv, isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logger } from "@/lib/observability/logger";

const inputSchema = z.object({
  email: z.email({ message: "Ange en giltig e-postadress." }),
});

export type LoginState = {
  status: "idle" | "sent" | "error";
  message?: string;
};

/**
 * Magic-link sign-in (SPEC §61.1). Never reveals whether an account exists
 * (SPEC §61.2) — the response is identical either way. Supabase enforces
 * request rate limits server-side.
 */
export async function sendMagicLink(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isSupabaseConfigured) {
    return {
      status: "error",
      message:
        "Inloggning är inte aktiverad i den här miljön ännu (Supabase saknas).",
    };
  }

  const parsed = inputSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${clientEnv.NEXT_PUBLIC_SITE_URL}/callback`,
    },
  });

  if (error) {
    logger.warn("auth.magic_link_failed", { code: error.code });
    // Deliberately generic — do not leak account existence or provider detail.
    return {
      status: "error",
      message: "Det gick inte att skicka länken just nu. Försök igen strax.",
    };
  }

  return {
    status: "sent",
    message:
      "Om adressen är giltig har vi skickat en inloggningslänk. Kontrollera din e-post.",
  };
}
