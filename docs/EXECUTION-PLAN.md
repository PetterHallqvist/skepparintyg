# Sjöklart — Execution Plan for `PetterHallqvist/skepparintyg`

**Date:** 2026-07-16 · **Type:** execution plan (continuous, lives with the project)
**Source of truth:** `SPEC.md` at the repo root (v2.0, 6,892 lines).

## Implementation status (2026-07-16)

Built so far, all gates green (`pnpm lint · typecheck · 107 unit tests · build`); migrations + RLS validated against a local Postgres 17 scratch cluster (no container runtime on the dev machine — identical pgTAP suites run in CI).

| Phase | Milestone | Status | Commit |
|---|---|---|---|
| 0 | M0 — scaffold + design system + visual shell | ✅ **done** | `e695c13`, `7297e9e` |
| 1 | M1 — content backbone + admin studio + publish gates | ✅ **done** | `36b0021` |
| 2 | M2 — core learning engine + attempts pipeline + session player | ✅ **done** | `0f25d5a` |
| 3 | M3 — chart laboratory (generator, §20.6 math, viewport, graded tasks) | ✅ **done** | `34cc85d` |
| 4 | M4 — trainers, dashboard breadth, deck exports | ✅ **done** | `06d7ead`…`e96ccb1` |
| 5 | M6 — commerce, guardians, entitlements | ⬜ next | — |
| 6 | M7 — marketing site, free funnel, SEO | ⬜ pending | — |
| 7 | M5 — training simulations (deprioritized 2026-07-16) | ⬜ pending | — |
| 8 | M8–M9 — beta hardening & launch ops (operator-heavy) | ⬜ pending | — |

**Build order (reordered 2026-07-16):** M4 → M6 → M7 → M5 → M8. Simulations (M5)
moved last — they depend on a large live item pool (content-gated); commerce +
marketing unblock revenue and the free funnel first.

**Runs with zero cloud infrastructure.** No database exists yet (deliberate): env vars unset → `isSupabaseConfigured` false → preview banners + demo learning loop + manifest-graded chart lab. Migrations `0001–0004` are SQL files in-repo, applied to no cloud project. Standing up a **new dedicated Supabase EU project** (or local Docker) is a parallel operator task (`docs/HUMAN_VERIFY.md` #1, #6) — **never** a shared/curevo project.

Per-phase detail log: `docs/BUILD-STATUS.md`.

## Context

The GitHub repo `PetterHallqvist/skepparintyg` started empty (created 2026-07-16, zero commits). `SPEC.md` is a complete product/engineering specification for a Swedish boat-license exam-preparation platform ("Sjöklart", working name): Förarintyg first (v1), later Båtpraktik/SRC/Kustskeppar/Seglarintyg. This plan turns the SPEC's own milestone plan (M-1→M9 for v1) into an executable phased build, run in SPEC order, with an early visual shell pulled into Phase 0 so the UI is visible and steerable from the start.

**Decisions already made (owner, 2026-07-16):**
- **UI:** Hybrid instrument theme — light "Scandinavian paper" surfaces for marketing + lessons; dark navy **"navigation console"** theme for chart lab, simulations, dashboards (precise tabular numerals, hairline grids, instrument-panel feel). Palette per SPEC §10.2: deep navy / off-white paper / muted sea blue / restrained amber / green=success only / red=error only. Sans-serif, strong Swedish glyph support.
- **Sequencing:** SPEC milestone order (M0→M7), aggressive push, but design system + app shell + styled landing page land in Phase 0.
- **Brand:** `Sjöklart` everywhere via one config constant (`lib/brand.ts`). Trademark/domain check = open operator task.

**This repo is standalone.** pnpm (lockfile committed, frozen in CI), Vercel for hosting, its own new Supabase EU project (never any shared/other project). Local clone at `~/skepparintyg`.

**Working conventions:** initial scaffold commits to `main` (repo was empty); thereafter feature branches `claude/phase-N-*` with PRs. Small reviewable commits per deliverable. ADRs in `/docs/adr`. Open human items tracked in `docs/HUMAN_VERIFY.md`.

---

## Phase 0 — Bootstrap, scaffold, design system, visual shell (SPEC M-1 partial + M0) — ✅ done

1. **Repo bootstrap**: `SPEC.md`, repo `AGENTS.md`/`CLAUDE.md` guide, `.gitignore`, `docs/` skeleton (`adr/`, `runbooks/`, `research/`, `content/`), `docs/HUMAN_VERIFY.md`.
2. **Scaffold**: Next.js 16.2 (App Router, strict TS, Tailwind v4), pnpm + `packageManager` pin; ESLint + Prettier; Zod-validated env (`lib/env.ts` — fail closed, `.env.example`); Vitest + fast-check; GitHub Actions CI (lint/typecheck/test/build, frozen install).
3. **Official-facts as data** (M-1 corrective): `official_facts` config (75% threshold, 90/120/60 min, ages 12/15, prerequisites) — each row with source URL + `verified_at` + review date. Never hard-coded in components.
4. **Migration 0001**: `profiles`, `admin_users`, `learners`, `learner_guardians`, `guardian_consents` with RLS **in the same migration**, security-definer helpers, `create_learner` RPC. pgTAP RLS harness.
5. **Auth skeleton**: Supabase SSR (cookie) pattern, magic-link `/logga-in` (never reveals account existence), callback with open-redirect guard, `proxy.ts` guarding `(learner)` + `/admin`.
6. **Design system** (`components/design-system/` + Tailwind tokens): navy/paper/sea/amber palette, IBM Plex Sans/Mono/Serif, two scoped themes (`:root` paper, `.theme-instrument` navy console), primitives, `.bezel`/`.text-label`/`.font-readout`/`.bg-contours`/`.bg-graticule`.
7. **Visual shell**: marketing layout + homepage (§77.1), learner app layout + `/app/start` dashboard, styled stubs for `/app/sjokort`, `/app/ova`, `/app/framsteg`.
8. **ADR-0001** (stack + versions), **ADR-0002** (fictional-chart-only decision).

## Phase 1 — Content backbone & admin studio (M1) — ✅ done

Migration 0002 (full content model, RLS inline), DB-enforced publish gates (source + approved domain + editorial reviews; 2 distinct reviewers for safety-critical), live-version immutability, §3.3 source-change monitoring (flags dependent objectives `review_required` + opens issue, never auto-unpublishes), admin studio (review queue, facts editor, audit log, content-issue inbox), shared Zod content schemas, CSV round-trip with OWASP formula-injection guarding, seed 40 items / 10 objectives / 5 lessons (status=`review`).

## Phase 2 — Core learning engine (M2) — ✅ done

Migrations 0003/0004 (`study_sessions`, `attempts` unique on learner+idempotency_key, `attempt_steps`, `srs_state`, `learner_skill_state`, `learner_objective_state`, `readiness_snapshots`, `felbok_entries`; `get_challenge` RPC strips answer key + live-only; `apply_attempt` atomic definer fn — idempotent, felbok resolution after 2 independent successes on separate dates, revoked from anon+authenticated). Pure `lib/domain/` (FSRS rating mapping §15.1, latency baseline §15.2, `planDueDate` §15.3, mastery stages §16.2, readiness + caps §17, session planner §18.3), server-authoritative grading, session player (5 renderers, confidence, tiered hints, progressive feedback), Felboken, `/app/framsteg` with "Så beräknas detta" panel.

## Phase 3 — Chart laboratory (M3) — ✅ done

Deterministic seeded Grundviken generator (original fictional SVG + Zod manifest, double "ÖVNINGSKORT — EJ FÖR NAVIGATION" watermark), full §20.6 pure math (property-tested with fast-check across §20.7 edge cases), `ChartViewport` (pan/zoom/pinch/keyboard/Enter-placement), tool-reducer state machine, 6 server-graded task families with §22.3 feedback overlays, accessibility typed-entry paths.

---

## Phase 4 — Trainers, dashboard breadth, exports (M4) — ✅ done

**Shipped** across `06d7ead` (4a engines + 4 item kinds), `9853f8e` (4b lights/sound), `3cb85e5` (4c rules), `5fa3999` (4d knot/weather/plotter), `af93f05` (4e remediation + dashboard breadth), `e96ccb1` (4f deck exports). Architecture: a **stimulus/response split** — trainer tasks are existing/new response kinds paired with a visual/audio stimulus, all flowing through the one session player, so SRS + felbok + readiness work unchanged (zero new DB migrations; `item_kind` is unconstrained). Gates green throughout (eslint, tsc, 167 unit/property tests, next build, deck-determinism double-build); each trainer verified in the browser at desktop + 375px. Below is the original plan, all delivered:

1. **Rules trainer** (§24): scenario schema, original top-down vessel rendering, 5-part grading (perception / classification / rule / action / explanation) so a lucky final answer can't hide a conceptual error, day/night variants, scrubber, keyboard + text-diagram alternatives, misconception tags.
2. **Lights/shapes/sound trainer** (§25): semantic light engine (`NavigationLight` — colour, arc, vertical order, rhythm), blink-character driver (`Fl(2) WRG 10s`), sector rendering, day shapes, original WebAudio sound synthesis (waveform/pulse alternative, no autoplay, captions), identify + produce + flashcard modes.
3. **Knot trainer** (§26): step-frame ordering + error spotting; status capped at **"teoretiskt förberedd"** (never "behärskar knopen" from a quiz); ships with placeholder frames — original media = operator task (HV #7/#11).
4. **Weather trainer** (§27): fictional forecast/observation scenario cards; interpret symbols, identify trend, distinguish forecast vs observation, choose conservative action, detect insufficient info. **Electronic-chart concept tasks** (§21.5): generic non-trade-dress plotter (overzoom, waypoint entry, MOB).
5. **Remediation sessions** generated from felbok; progress/readiness dashboard breadth.
6. **Deck exports** (§37): deterministic Anki `.apkg` builder + Quizlet-compatible TSV, card schema §37.4, "not for navigation" on chart-like cards, no exam-security-sensitive items, entitlement-gated signed downloads. Anki generation library = ADR.

**DoD (M4):** every v1 objective type has a working interaction; exports build deterministically; audio/drag interactions have alternatives; ≥55 objectives in the pipeline (content review operator-gated).

## Phase 5 — Training simulations (M5) — ⬜ pending

Blueprint model + admin editor (§35.2); deterministic stratified assembly with exposure limits (§35.3, seeded, tested); normalized `exam_sessions` + per-item rows (§50); **server-authoritative timer** (§35.5); runner UI (autosave, flag, navigation, no feedback until submit); one-final-submission; scoring vs configured 75% rule; diagnostic sections separate (§35.7); remediation plan; readiness integration; multi-tab/refresh/timeout tests. Labelled **"Träningssimulering"** with non-official-format disclaimer.

## Phase 6 — Commerce, guardians, entitlements (M6) — ⬜ pending

Migrations (products/prices in öre + VAT facts, orders + events, `external_events` idempotency, entitlements + seats, guarantee_claims, consent/terms evidence, leads); Stripe Checkout (server) + idempotent signature-verified webhook (success redirect grants nothing); guardian/minor flow (§12.2, §43, §70 — guardian owns purchase, learner is display-name + age band only, no marketing to minors); receipts via Resend; account export/deletion (§71.3–71.4); study-guarantee claim skeleton (no auto payout).

## Phase 7 — Marketing site, free funnel, SEO, comms (M7) — ⬜ pending

All public routes (§11.1): product pages with trust blocks, `/priser`, `/sa-fungerar-provet`, `/om-oss`, `/experter-och-kallor`, `/kundtjanst`, legal pages (drafts flagged for counsel), `kunskapsbank/[slug]` + `ordlista/[term]`; **free diagnostic** + **free chart demo** with on-screen result, optional email save, separate unticked marketing consent (§9.3); waitlist pages; consent-aware PostHog EU (no item answers/PII §81); sitemap/robots/metadata/OG, `noindex` on app/admin; Lighthouse ≥90.

## Phase 8 — Beta hardening & launch ops (M8–M9, operator-heavy) — ⬜ pending

Analytics dashboards, support tooling (§84.3), runbooks (payment-no-access, content correction, incident), backup/restore rehearsal, launch acceptance checklist (§95). Beta cohort, content cycles, price validation, legal sign-offs = operator.

## Parallel content track (C0–C4) & post-v1

Content production (real taxonomy from NFB docs → worked examples → batch item production with review → media → calibration) runs parallel from Phase 1 but is **gated on operator inputs** (sources + reviewers). Post-v1: M10 Båtpraktik → M11 SRC (radio lab §32) → M12 Kustskeppar (Ytterskär chart world) → M13 Seglarintyg.

---

## Open items needing specification / operator action

**Blocking cloud deploy & payments (not local dev):**
1. **Accounts**: new Supabase **EU** project (separate from every other project), Vercel project + domain, Stripe (+ Klarna), Resend (+ sending domain), PostHog EU. Local Docker covers Phases 0–5 without any of these.
2. **Pricing**: pick launch price inside SPEC ranges before Stripe products are created (Phase 6).
3. **Supabase auth email**: magic links via Resend SMTP vs Supabase default sender — decide at first deploy.

**Blocking real content going live (not the build):**
4. **NFB source documents**: current kunskapsfordringar/product pages for Förarintyg; until then all content stays `review`-status with unverified-source flags.
5. **Domain reviewer** (qualified navigation instructor) + editorial reviewer — launch gate; nothing ships `live` without sign-off.
6. **Chart review**: maritime/cartography review of the generated fictional charts before launch.
7. **Original media**: knot photos/illustrations, boat/manoeuvre illustrations; synthesized audio covers sound signals.

**Blocking public launch (not the build):**
8. **Legal**: consumer terms, withdrawal-consent wording (§69.2), privacy policy + minor/guardian review, guarantee wording (§9.5), VAT classification — Swedish counsel + accountant.
9. **Brand**: Sjöklart trademark + domain check.
10. **Beta cohort** recruitment (30–75 learners) for M8.

**Engineering decisions made during the build (each gets an ADR):** exact Next 16.x/Tailwind/shadcn versions; pgTAP RLS harness; Anki `.apkg` generation library; chart-generator terrain algorithm.

## Verification

- **Every phase**: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`; `supabase db reset` + RLS matrix tests green; CI green.
- **UI phases (0,3,4,7)**: preview via dev server — 375px + desktop, keyboard-only, axe, both themes; screenshot proof.
- **Phase 2/3/5**: inspect network payloads to confirm no answer keys pre-submit; property tests for geometry; reducer tests for tool state machine.
- **Phase 6**: Stripe test-mode purchase → webhook → entitlement e2e; verify success-redirect-alone grants nothing.
- **Phase 7**: Lighthouse ≥90 on `/` and `/forarintyg`; `noindex` verified on app/admin; free diagnostic works with no email.
- **E2E (accumulating)**: Playwright critical paths per §89 — public→purchase, guardian, study loop, chart task, simulation, deck download, admin publish.
