# Build status

_2026-07-17 · continuous document — updated at the end of each build phase._

## Done (all gates green: lint · typecheck · 213 unit tests · build)

| Phase | Milestone | Commit | Highlights |
|---|---|---|---|
| 0 | M0 scaffold + shell | `e695c13`, `7297e9e` | Next 16.2/Tailwind v4/shadcn (Base UI), paper+instrument themes, IBM Plex trio, marketing homepage, learner console, magic-link auth skeleton, migration 0001 (identity + RLS), pgTAP harness, CI (web+db) |
| 1 | M1 content backbone | `36b0021` | Migration 0002 (full content model, RLS inline), DB-enforced publish gates (source + domain + editorial; 2 reviewers for safety-critical), live-version immutability, §3.3 source-change monitoring, admin studio (review queue, facts editor, audit log), seed 40 items/10 objectives/5 lessons (status=review), CSV round-trip w/ OWASP formula guarding |
| 2 | M2 learning engine | `0f25d5a` | FSRS rating mapping §15.1, planDueDate §15.3, mastery stages §16.2, readiness+caps §17, session planner §18.3, server grading, migrations 0003/0004 (attempts, apply_attempt — atomic + idempotent, felbok resolution rule), session player w/ 5 renderers, confidence, hints, progressive feedback |
| 3 | M3 chart laboratory | `34cc85d` | Deterministic Grundviken generator (original fictional chart + Zod manifest, watermarks), full §20.6 pure math (property-tested), ChartViewport (pan/zoom/pinch/keyboard/Enter-placement), tool state machine, 6 server-graded tasks with §22.3 overlays |
| 4 | M4 trainers + exports | `06d7ead`, `9853f8e`, `3cb85e5`, `5fa3999`, `af93f05`, `e96ccb1` | Stimulus/response split reusing the session player + SRS + felbok; 4 new item kinds (rules_scenario staged §24.3, light_build, sound_produce, waypoint_entry) w/ pure engines (light-rhythm property-tested, COLREG light configs, WebAudio horn, coord transposition); 5 trainers — ljus/dagersignaler/ljud (§25, blink keyframes + reduced-motion strip), väjning (§24, top-down scenes + scrubber), knop (§26, cap "teoretiskt förberedd"), väder (§27), plotter (§21.5, overzoom/MOB/GNSS cross-check); trainer directory hub; planRemediation (§13.6) + repetition route; F1–F12 dashboard breadth; deck pipeline — deterministic Anki .apkg (sql.js+fflate) + Quizlet TSV, fail-closed download route (free 200 / paid 403) |
| 5 | M5 training simulations | _(squashed commit)_ | Pure engines: seeded stratified `assembleExam` with exposure limits (deterministic, fast-check property-tested §86.4), `scoreExam` (pass over graded sections only, diagnostic separate §35.7, basis points), server-authoritative `timer`. Migration 0008 (exam_blueprints + normalized exam_sessions + per-item rows §50, RLS, autosave policy) + SECURITY DEFINER `start_exam_session` (DB-clock started_at) / `finalize_exam_session` (status-lock = one-final-submission). Demo path: stateless, secure via **httpOnly** cookie so the timer is server-authoritative even without a DB; deterministic assembly from the demo item pool, grading on submit (answer keys never leave the server), cookie cleared on submit. Runner UI — all questions on one page (uncontrolled widgets keep state), server timer countdown + auto-submit at expiry, flag, no feedback until submit; result screen (score vs 75 %, per-section, diagnostic separate, remediation) with the "Träningssimulering — inte officiellt format" disclaimer. `/app/simulering` + sidebar entry |
| 7 | M7 marketing + funnel + SEO | _(squashed commit)_ | 20 public routes (was `/` only): `/forarintyg`, waitlist pages, 4 informational + 5 legal pages, all with `<TrustBlock>` (§10.5, facts from getFact); free funnel — `/gratis-kunskapstest` (demo track, on-screen result, no email hostage) + `/gratis-sjokortsovning` (chart lab lifted public); shared LeadCaptureForm (separate unticked marketing consent, §9.3) → `leads`/`consent_events`; migration 0007 (articles + glossary_terms, public-read RLS) + dependency-free mini-Markdown BlockRenderer (closes the M2 lesson-render gap, adds `/app/lektioner/[slug]`) + `/kunskapsbank` + `/ordlista`; privacy-first analytics — typed PII-proof `buildEnvelope` (§81), consent-gated fetch to PostHog EU (no SDK), decline-by-default cookie banner via useSyncExternalStore; SEO — sitemap/robots/manifest/favicon, `noindex` on /app + /admin, metadataBase + OpenGraph; Resend lifecycle email skeletons |
| 6 | M6 commerce + guardians | _(squashed commit)_ | Migration 0006 (products/prices/orders/order_items/entitlements/entitlement_learners/external_events/leads/consent_events/communication_log/guarantee_claims/learner_access_tokens; RLS inline; `has_active_entitlement`; service-role RPCs `provision_entitlement`/`apply_refund`/`assign_entitlement_seat`); pure `lib/commerce/{money,entitlement,guarantee}` (öre-only, VAT split, seat math); dependency-free Stripe (ADR-0004 — REST + HMAC webhook verify, constant-time, replay-guarded, unit-tested); idempotent webhook = sole entitlement authority; wired deck gate to `has_active_entitlement`; `/priser` + `/kassa/[product]` (13-item §69.1 disclosure + §69.2 unchecked withdrawal consent) + webhook-authoritative `/kassa/klar` receipt; dependency-free Resend receipt email (§53, purpose-separated, minor-marketing block); guardian routes (learners/purchases/consents) + scrypt minor-PIN (rate-limited, §43.5) + pgTAP `0004` permission matrix (16/16 on local PG17); account export (§71.3, no answer keys) + conservative self-deletion (§71.4, finance retained) + studiegaranti claim (§9.5, human-decided) |

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

## Next — M0–M7 complete (all milestones built)

The full v1 build (M0–M7) is done and green. Remaining work is operator/legal,
not engineering: live accounts (Supabase EU, Stripe/Resend/PostHog keys), real
NFB-sourced content + reviewer sign-off, legal copy sign-off (docs/LEGAL_COPY.md,
docs/HUMAN_VERIFY.md), a Lighthouse pass, and DB-backed exam blueprints + a
larger live item pool (the demo simulation path is fully playable now). Post-v1
milestones (M8 beta ops, M10+ further certifications) follow the SPEC roadmap.
- **Phase 7 / M5** (deprioritized): simulation blueprints, deterministic
  assembly, server timer, runner, scoring vs configured 75 % rule. Depends on a
  larger live item pool (content-gated).
- **M4 follow-ups**: original knot media (HV #11) replaces the placeholder
  frames; deck cards need the same source review as other content (HV #9); wire
  trainer items through the DB path (apply_attempt) once Supabase exists.
- **DB-backed learning loop**: swap session-player demo actions to
  startStudySession/apply_attempt once a Supabase environment exists (RPCs are
  migrated + tested).
