import { z } from "zod";

/**
 * Environment validation (SPEC §58.4: every external boundary validates with
 * Zod — including environment variables). Fail-closed: malformed values
 * throw at startup. Values that are absent simply disable their feature via
 * the `isConfigured` helpers so local dev works before cloud accounts exist.
 *
 * NEVER put secrets in NEXT_PUBLIC_* variables.
 */
const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  /** Supabase service-role/secret key — server only, Phase 1+. */
  SUPABASE_SECRET_KEY: z.string().min(1).optional(),
  /** Shared secret protecting cron route handlers (SPEC §56 hosting note). */
  CRON_SECRET: z.string().min(16).optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
});

function parse<T extends z.ZodTypeAny>(
  schema: T,
  values: Record<string, string | undefined>,
): z.infer<T> {
  const result = schema.safeParse(values);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Ogiltig miljökonfiguration:\n${issues}`);
  }
  return result.data;
}

/**
 * NEXT_PUBLIC_* values must be referenced statically for Next.js to inline
 * them in client bundles.
 */
export const clientEnv = parse(clientSchema, {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

/** Server-only env. Do not import from client components. */
export const serverEnv = parse(serverSchema, {
  NODE_ENV: process.env.NODE_ENV,
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
  CRON_SECRET: process.env.CRON_SECRET,
});

export const isSupabaseConfigured =
  clientEnv.NEXT_PUBLIC_SUPABASE_URL !== undefined &&
  clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY !== undefined;
