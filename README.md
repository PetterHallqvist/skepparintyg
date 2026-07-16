# Sjöklart

Svensk förberedelseplattform inför fritidsbåtsintyg — Förarintyg först.
Interaktivt sjökortsarbete, adaptiv repetition och ärlig provberedskap.

> Fristående utbildningstjänst. Prov och intyg hanteras separat genom den
> officiella processen hos NFB.

## Stack

Next.js 16 (App Router, strict TS) · Tailwind v4 + shadcn/ui (Base UI) ·
Supabase (Postgres/RLS/Auth) · Zod · Vitest + fast-check · Playwright · pnpm.
Details in [docs/adr/0001](docs/adr/0001-stack-and-versions.md).

## Getting started

```bash
pnpm install
cp .env.example .env.local   # values optional until cloud accounts exist
pnpm dev                     # http://localhost:3000

# with Docker installed:
supabase start               # local Postgres/Auth stack
supabase db reset            # apply migrations + seed
supabase test db             # pgTAP RLS tests
```

`pnpm lint · typecheck · test · build` must all pass before a PR.

## Where things live

- **SPEC.md** — product/engineering source of truth (read first)
- **AGENTS.md / CLAUDE.md** — agent working rules
- **docs/HUMAN_VERIFY.md** — open operator items (accounts, legal, reviewers)
- **docs/adr/** — architecture decision records
- `app/` route groups: `(marketing)`, `(auth)`, `(learner)/app`, `admin`, `api`
- `lib/domain` pure business logic · `lib/chart` chart math (Phase 3)
- `supabase/` migrations (RLS inline) + pgTAP tests
