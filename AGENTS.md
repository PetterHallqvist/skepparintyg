<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Sjöklart — agent guide

_Continuous document. Swedish exam-preparation platform for boat licences
(Förarintyg first). Working name "Sjöklart" — configurable in `lib/brand.ts`._

## Read SPEC.md first

`SPEC.md` (repo root) is the product, content, legal and engineering source of
truth. When anything conflicts, resolve in this order (SPEC §0.1): laws/official
requirements → SPEC guardrails → accepted ADRs in `docs/adr/` → SPEC → tests →
existing code → tickets/notes. If an official requirement is unclear: make it a
labelled, configurable value and add it to `docs/HUMAN_VERIFY.md` — never encode
a silent assumption.

## Non-negotiable guardrails

- **We prepare; NFB examines.** Never imply the product, its questions, chart
  or simulators are official, NFB-approved, or that completion yields a
  certificate (SPEC §0.2). The real exam is booked separately.
- **Official facts are data**, date-stamped with source (`lib/content/official-facts.ts`,
  later the `official_facts` table). Never hard-code exam times/thresholds in
  components. Current verified values: 75 % pass, Förar 90 min, Kust 120 min,
  SRC 60 min.
- **Server is authoritative** (SPEC §58.2): entitlements, grading, timers,
  SRS/skill state, orders. Clients render and compute provisional geometry only.
- **No answer keys in client payloads** (SPEC §58.3): challenge payloads exclude
  canonical answers; grading happens in server actions; simulations return no
  correctness until final submission.
- **Charts are original and fictional** (ADR-0002), always watermarked
  "ÖVNINGSKORT — EJ FÖR NAVIGATION". Never derive from real charts. Never
  ingest competitor content anywhere (SPEC §3.4).
- **Every user-data table gets RLS in the same migration that creates it**
  (SPEC §42.8). RLS helpers derive `auth.uid()` internally — never trust
  client-sent user ids. Add pgTAP tests in `supabase/tests/` for each policy.
- **Minors are a first-class case** (SPEC §70): guardian owns account/purchase,
  learner profiles carry minimal data (display name + age band), no marketing
  surfaces in learner mode.
- **UI is Swedish (sv-SE)**, calm and exact (SPEC §10.4): no "Oops!", no fake
  urgency, no guarantees of passing. Pair colour with text/icons — green only
  for confirmed success, red only for errors/safety.
- **Accessibility**: WCAG 2.1 AA target; every pointer interaction needs a
  typed/keyboard alternative; 44px minimum targets in labs.

## Commands

| Task                                | Command                        |
| ----------------------------------- | ------------------------------ |
| Dev server                          | `pnpm dev`                     |
| Lint / typecheck                    | `pnpm lint` / `pnpm typecheck` |
| Unit tests (Vitest + fast-check)    | `pnpm test`                    |
| E2E (Playwright, desktop+mobile)    | `pnpm e2e`                     |
| Production build                    | `pnpm build`                   |
| Local Supabase stack (needs Docker) | `supabase start`               |
| Reset DB + apply migrations + seed  | `supabase db reset`            |
| RLS/pgTAP tests                     | `supabase test db`             |

**pnpm only** — lockfile is committed; CI uses `--frozen-lockfile`. Never
introduce npm/yarn/bun lockfiles.

## Architecture map

```
app/(marketing)   public pages, paper theme, static/cached
app/(auth)        magic-link login + callback (open-redirect guarded)
app/(learner)/app learner shell, instrument theme, auth-gated via proxy.ts
app/admin         admin studio (Phase 1+), role-gated server + RLS
app/api           route handlers: health, webhooks, crons
components/design-system  brand primitives (DataReadout, SourceStamp, gauges…)
components/ui     shadcn (Base UI) primitives — owned, restyled via tokens
lib/domain        PURE business logic (SRS, readiness, planner, grading) — unit-tested
lib/chart         pure chart mathematics (Phase 3) — property-tested
lib/env.ts        Zod-validated env; absent = feature off, malformed = crash
supabase/         migrations (RLS inline), pgTAP tests, seed
docs/             ADRs, HUMAN_VERIFY.md, runbooks
```

Design tokens live in `app/globals.css`: `:root` = paper theme,
`.theme-instrument` = navy console (labs/dashboards). `dark:` utilities map to
the instrument scope. Signature classes: `.bezel`, `.text-label`,
`.font-readout`, `.bg-contours`, `.bg-graticule`.

## Conventions

- Feature branches `claude/<topic>` + PR; only the initial bootstrap committed
  straight to main. Conventional commits.
- Pure domain logic never imports React/Next. Components never contain grading
  formulas or entitlement rules (SPEC §58.1).
- Zod-validate every external boundary; never `as SomeType` untrusted JSON.
- New dependency? Justify per SPEC §56.1 and add an ADR for infrastructure.
- Structured logs via `lib/observability/logger.ts`; never log answers,
  tokens, emails or free-text user input.
