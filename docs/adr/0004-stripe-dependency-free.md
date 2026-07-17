# ADR-0004: Dependency-free Stripe integration

_2026-07-16 · accepted · continuous record · SPEC §60.2, §69 (M6)_

## Decision

We integrate Stripe over the **REST API with `fetch` and verify webhook
signatures with Node's built-in `crypto`**, rather than adding the `stripe` npm
SDK. The whole surface is two calls — create a Checkout Session, verify a
webhook — and lives in one small module (`lib/commerce/stripe.ts`):

- **Checkout Session:** a form-encoded `POST /v1/checkout/sessions` with a
  `Bearer` secret key and an `Idempotency-Key` header (our order id), so a
  double-submit reuses one session instead of double-charging.
- **Webhook signature:** Stripe's documented scheme — `t=<unix>,v1=<hmac>` where
  the signed payload is `` `${t}.${rawBody}` `` under HMAC-SHA256 keyed by the
  webhook secret. We compare in **constant time** (`crypto.timingSafeEqual`),
  enforce a **timestamp tolerance** (replay defence), and accept any of several
  `v1` values (key rotation).

## Rationale

- **Frozen lockfile in CI.** The repo commits `pnpm-lock.yaml` and installs with
  `--frozen-lockfile`. A half-applied `pnpm add` on a network blip is exactly the
  class of lockfile drift that has broken builds before; owning zero new runtime
  deps removes that risk for the payment path.
- **Security-critical code worth owning.** Signature verification is the gate the
  "webhook is the sole authority" invariant (§60.2) rests on. Hand-writing ~30
  lines we fully unit-test (deterministic HMAC vectors: valid / tampered / wrong
  secret / stale / rotated / malformed) is *more* verifiable here than mocking an
  SDK, not less.
- **Consistency.** Matches the repo's established no-native-dep posture (`sql.js`,
  `fflate`, the in-house Anki builder in ADR-0003).
- **No API-version drift.** We pin `Stripe-Version` on the request explicitly.

## Consequences

- `lib/commerce/stripe.ts` is `server-only`. Tests alias `server-only` to a
  no-op stub (`tests/stubs/server-only.ts`) so the pure functions remain
  unit-testable under vitest (plain node).
- If Stripe usage grows beyond checkout + webhook + refund (e.g. subscriptions,
  Billing Portal, dynamic tax), revisit and adopt the SDK — the module is small
  and swappable behind `createStripeCheckoutSession` / `verifyStripeSignature`.
- `charge.refunded` is handled the same way (idempotent `apply_refund` RPC).
- Live keys stay an operator task (`docs/HUMAN_VERIFY.md`); everything runs in
  Stripe **test mode** in dev and no-ops entirely when `isCommerceConfigured` is
  false.
