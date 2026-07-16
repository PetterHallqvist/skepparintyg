import "server-only";
import crypto from "node:crypto";
import { serverEnv } from "@/lib/env";

/**
 * Minimal, dependency-free Stripe client (ADR-0004). We use exactly two Stripe
 * surfaces — create a Checkout Session, and verify a webhook signature — so we
 * talk to the REST API over `fetch` and verify signatures with Node's `crypto`
 * rather than pulling in the SDK. Rationale: the repo pins a frozen lockfile in
 * CI (a half-applied `pnpm add` on a network blip would break every build), the
 * signature check is security-critical and worth owning line-by-line, and it is
 * fully unit-testable with deterministic HMAC vectors. Matches the repo's
 * established no-native-dep posture (sql.js, fflate, the in-house Anki builder).
 *
 * The webhook is the SOLE authority that provisions entitlements (§60.2); this
 * module's `verifyStripeSignature` is the gate that authority rests on.
 */

const STRIPE_API = "https://api.stripe.com/v1";
/** Reject events whose timestamp is older/newer than this (replay defence). */
const DEFAULT_TOLERANCE_SECONDS = 300;

export class StripeError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly stripeCode?: string,
  ) {
    super(message);
    this.name = "StripeError";
  }
}

function requireSecret(): string {
  if (!serverEnv.STRIPE_SECRET_KEY) {
    throw new StripeError("STRIPE_SECRET_KEY saknas.");
  }
  return serverEnv.STRIPE_SECRET_KEY;
}

/**
 * Encode a nested params object the way Stripe's form API expects:
 * `a[b][c]=v`, arrays as `a[0][x]=v`. Values are stringified; nullish keys are
 * dropped so callers can pass optionals inline.
 */
export function encodeStripeForm(
  obj: Record<string, unknown>,
  parentKey?: string,
  out: string[] = [],
): string {
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;
    const encodedKey = parentKey ? `${parentKey}[${key}]` : key;
    if (typeof value === "object" && !Array.isArray(value)) {
      encodeStripeForm(value as Record<string, unknown>, encodedKey, out);
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => {
        if (v !== null && typeof v === "object") {
          encodeStripeForm(v as Record<string, unknown>, `${encodedKey}[${i}]`, out);
        } else {
          out.push(
            `${encodeURIComponent(`${encodedKey}[${i}]`)}=${encodeURIComponent(String(v))}`,
          );
        }
      });
    } else {
      out.push(
        `${encodeURIComponent(encodedKey)}=${encodeURIComponent(String(value))}`,
      );
    }
  }
  return out.join("&");
}

export interface CheckoutLineItem {
  /** Öre, VAT-inclusive — Stripe wants the smallest currency unit. */
  unitAmountOre: number;
  currency: string;
  nameSv: string;
  quantity: number;
}

export interface CreateCheckoutParams {
  lineItems: CheckoutLineItem[];
  successUrl: string;
  cancelUrl: string;
  /** Our order id — echoed back on the session so the webhook can find it. */
  clientReferenceId: string;
  metadata?: Record<string, string>;
  customerEmail?: string;
  /** Idempotency-Key header: a retry of the same checkout reuses the session. */
  idempotencyKey: string;
  locale?: string;
}

export interface StripeCheckoutSession {
  id: string;
  url: string | null;
  amount_total: number | null;
  currency: string | null;
  payment_intent: string | null;
  status: string | null;
}

/** Create a hosted Checkout Session (test or live per the key). */
export async function createStripeCheckoutSession(
  params: CreateCheckoutParams,
): Promise<StripeCheckoutSession> {
  const form: Record<string, unknown> = {
    mode: "payment",
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    client_reference_id: params.clientReferenceId,
    locale: params.locale ?? "sv",
    // Collect the billing country so VAT jurisdiction is recorded (§69.4).
    billing_address_collection: "required",
    customer_email: params.customerEmail,
    metadata: params.metadata,
    line_items: params.lineItems.map((li) => ({
      quantity: li.quantity,
      price_data: {
        currency: li.currency.toLowerCase(),
        unit_amount: li.unitAmountOre,
        product_data: { name: li.nameSv },
      },
    })),
  };

  const res = await fetch(`${STRIPE_API}/checkout/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireSecret()}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Idempotency-Key": params.idempotencyKey,
      "Stripe-Version": "2025-01-27.acacia",
    },
    body: encodeStripeForm(form),
  });

  const json = (await res.json()) as
    | StripeCheckoutSession
    | { error: { message: string; code?: string } };

  if (!res.ok || "error" in json) {
    const err = "error" in json ? json.error : { message: "okänt fel" };
    throw new StripeError(
      `Stripe checkout misslyckades: ${err.message}`,
      res.status,
      "code" in err ? err.code : undefined,
    );
  }
  return json;
}

// ---------------------------------------------------------------------------
// Webhook signature verification (Stripe's scheme, owned line-by-line).
// Header shape: `t=<unix>,v1=<hex hmac>[,v1=<hmac>…]`. The signed payload is
// `${t}.${rawBody}`, HMAC-SHA256 keyed by the webhook secret. We accept if ANY
// provided v1 matches (Stripe rotates by emitting multiple) and the timestamp
// is within tolerance.
// ---------------------------------------------------------------------------

export interface VerifyOptions {
  /** Injected in tests for determinism; defaults to the env secret. */
  secret?: string;
  /** Injected in tests; defaults to now. */
  nowSeconds?: number;
  toleranceSeconds?: number;
}

function parseSignatureHeader(header: string): {
  timestamp: number | null;
  v1: string[];
} {
  let timestamp: number | null = null;
  const v1: string[] = [];
  for (const part of header.split(",")) {
    const [k, v] = part.split("=");
    if (k === "t") {
      const n = Number(v);
      timestamp = Number.isFinite(n) ? n : null;
    } else if (k === "v1" && v) {
      v1.push(v);
    }
  }
  return { timestamp, v1 };
}

function timingSafeEqualHex(a: string, b: string): boolean {
  // Both must be valid, equal-length hex or timingSafeEqual throws.
  if (a.length !== b.length || a.length === 0) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

/**
 * Verify a raw request body against the `Stripe-Signature` header. Throws
 * `StripeError` on any failure (missing secret, malformed header, stale
 * timestamp, or no matching signature). Returns the parsed event on success.
 */
export function verifyStripeSignature(
  rawBody: string,
  signatureHeader: string | null,
  options: VerifyOptions = {},
): unknown {
  const secret = options.secret ?? serverEnv.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new StripeError("STRIPE_WEBHOOK_SECRET saknas.");
  if (!signatureHeader) throw new StripeError("Stripe-Signature saknas.");

  const { timestamp, v1 } = parseSignatureHeader(signatureHeader);
  if (timestamp === null || v1.length === 0) {
    throw new StripeError("Ogiltig signaturrubrik.");
  }

  const tolerance = options.toleranceSeconds ?? DEFAULT_TOLERANCE_SECONDS;
  const now = options.nowSeconds ?? Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > tolerance) {
    throw new StripeError("Signaturens tidsstämpel är utanför toleransen.");
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`, "utf8")
    .digest("hex");

  if (!v1.some((sig) => timingSafeEqualHex(sig, expected))) {
    throw new StripeError("Signaturen matchar inte.");
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    throw new StripeError("Webhook-kroppen är inte giltig JSON.");
  }
}

/** SHA-256 of the raw body, stored on external_events for auditing (§60.2). */
export function payloadHash(rawBody: string): string {
  return crypto.createHash("sha256").update(rawBody, "utf8").digest("hex");
}
