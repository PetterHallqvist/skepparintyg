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
  /** Stripe secret key (test-mode `sk_test_…` in dev) — server only (§60.2). */
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  /** Stripe webhook signing secret (`whsec_…`) — verifies event authenticity. */
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  /** Transactional email (Resend) — server only, no-op without a key (§53). */
  RESEND_API_KEY: z.string().min(1).optional(),
  /** From-address for transactional email; must be on a verified domain. */
  EMAIL_FROM: z.string().min(3).optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  /** Publishable key (`pk_test_…`) — safe in the client bundle by design. */
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  /** PostHog EU project key — analytics no-ops entirely without it (§81). */
  NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.url().default("https://eu.i.posthog.com"),
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
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
});

/** Server-only env. Do not import from client components. */
export const serverEnv = parse(serverSchema, {
  NODE_ENV: process.env.NODE_ENV,
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
  CRON_SECRET: process.env.CRON_SECRET,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
});

export const isSupabaseConfigured =
  clientEnv.NEXT_PUBLIC_SUPABASE_URL !== undefined &&
  clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY !== undefined;

/**
 * Commerce is live only when Supabase AND both Stripe secrets are present
 * (fail-closed, SPEC §60.2). Server-oriented: it reads server-only secrets, so
 * it is always false in the client bundle — gate commerce in server components
 * and pass the boolean down as a prop to avoid hydration drift.
 */
export const isCommerceConfigured =
  isSupabaseConfigured &&
  serverEnv.STRIPE_SECRET_KEY !== undefined &&
  serverEnv.STRIPE_WEBHOOK_SECRET !== undefined;

/** Transactional email is live only with a Resend key + from-address (§53). */
export const isCommsConfigured =
  serverEnv.RESEND_API_KEY !== undefined && serverEnv.EMAIL_FROM !== undefined;

/** Analytics fire only with a PostHog key AND user consent (§81, gated later). */
export const isAnalyticsConfigured =
  clientEnv.NEXT_PUBLIC_POSTHOG_KEY !== undefined;
