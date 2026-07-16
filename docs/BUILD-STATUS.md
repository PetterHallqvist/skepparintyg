# Build status

_2026-07-16 · continuous document — updated at the end of each build phase._

## Done (all gates green: lint · typecheck · 107 unit tests · build)

| Phase | Milestone | Commit | Highlights |
|---|---|---|---|
| 0 | M0 scaffold + shell | `e695c13`, `7297e9e` | Next 16.2/Tailwind v4/shadcn (Base UI), paper+instrument themes, IBM Plex trio, marketing homepage, learner console, magic-link auth skeleton, migration 0001 (identity + RLS), pgTAP harness, CI (web+db) |
| 1 | M1 content backbone | `36b0021` | Migration 0002 (full content model, RLS inline), DB-enforced publish gates (source + domain + editorial; 2 reviewers for safety-critical), live-version immutability, §3.3 source-change monitoring, admin studio (review queue, facts editor, audit log), seed 40 items/10 objectives/5 lessons (status=review), CSV round-trip w/ OWASP formula guarding |
| 2 | M2 learning engine | `0f25d5a` | FSRS rating mapping §15.1, planDueDate §15.3, mastery stages §16.2, readiness+caps §17, session planner §18.3, server grading, migrations 0003/0004 (attempts, apply_attempt — atomic + idempotent, felbok resolution rule), session player w/ 5 renderers, confidence, hints, progressive feedback |
| 3 | M3 chart laboratory | `34cc85d` | Deterministic Grundviken generator (original fictional chart + Zod manifest, watermarks), full §20.6 pure math (property-tested), ChartViewport (pan/zoom/pinch/keyboard/Enter-placement), tool state machine, 6 server-graded tasks with §22.3 overlays |
| 4 | M4 trainers + exports | `06d7ead`, `9853f8e`, `3cb85e5`, `5fa3999`, `af93f05`, `e96ccb1` | Stimulus/response split reusing the session player + SRS + felbok; 4 new item kinds (rules_scenario staged §24.3, light_build, sound_produce, waypoint_entry) w/ pure engines (light-rhythm property-tested, COLREG light configs, WebAudio horn, coord transposition); 5 trainers — ljus/dagersignaler/ljud (§25, blink keyframes + reduced-motion strip), väjning (§24, top-down scenes + scrubber), knop (§26, cap "teoretiskt förberedd"), väder (§27), plotter (§21.5, overzoom/MOB/GNSS cross-check); trainer directory hub; planRemediation (§13.6) + repetition route; F1–F12 dashboard breadth; deck pipeline — deterministic Anki .apkg (sql.js+fflate) + Quizlet TSV, fail-closed download route (free 200 / paid 403) |

## Environment notes

- **No container runtime on this machine** — `supabase start`/`test db` can't run
  locally. All migrations + RLS behaviour were validated against a local
  **Postgres 17 scratch cluster** (brew, no service) with a Supabase auth shim;
  the identical pgTAP suites run in CI (`.github/workflows/ci.yml`, db job).
- Supabase/Vercel/Stripe/Resend/PostHog accounts: not yet created
  (docs/HUMAN_VERIFY.md #1–7). The app runs fully in the pre-cloud dev shell:
  learner + admin surfaces render with demo data and preview banners.
- Dev server: `pnpm dev`. Regenerate chart: `node pipeline/chart-gen/generate.mjs`.
  Regenerate seed: `node pipeline/content/seed-content.mjs`.

## Next (SPEC order — reordered 2026-07-16: M5 simulations deprioritized to last)

- **Phase 5 / M6** (next): Stripe checkout + idempotent webhooks, entitlements/seats
  (unlocks the paid decks the M4 route already gates), guardian/minor flows,
  receipts, export/deletion. Needs accounts + price decision (HV #3, #14).
- **Phase 6 / M7**: full public routes, free diagnostic + chart demo, SEO,
  consent-aware analytics, Lighthouse ≥ 90.
- **Phase 7 / M5** (deprioritized): simulation blueprints, deterministic
  assembly, server timer, runner, scoring vs configured 75 % rule. Depends on a
  larger live item pool (content-gated).
- **M4 follow-ups**: original knot media (HV #11) replaces the placeholder
  frames; deck cards need the same source review as other content (HV #9); wire
  trainer items through the DB path (apply_attempt) once Supabase exists.
- **DB-backed learning loop**: swap session-player demo actions to
  startStudySession/apply_attempt once a Supabase environment exists (RPCs are
  migrated + tested).
