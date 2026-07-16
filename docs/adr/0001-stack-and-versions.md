# ADR-0001: Stack and versions

_2026-07-16 · accepted · continuous record_

## Decision

Implement SPEC §56 with the current patched stable releases:

| Layer           | Choice                                                                       | Version           |
| --------------- | ---------------------------------------------------------------------------- | ----------------- |
| Framework       | Next.js App Router, Server Components default                                | 16.2.10           |
| UI runtime      | React                                                                        | 19.2.4            |
| Language        | TypeScript strict                                                            | 5.9.x             |
| Styling         | Tailwind CSS v4 (CSS-token config in `app/globals.css`)                      | 4.x               |
| Components      | shadcn/ui `base-nova` style on **Base UI** primitives (`@base-ui/react`)     | shadcn 4.13       |
| Validation      | Zod (v4 API: `z.email()`, `z.url()`)                                         | 4.4.x             |
| DB/Auth         | Supabase (EU region in cloud; local via CLI) `@supabase/ssr` cookie sessions | supabase-js 2.110 |
| Unit tests      | Vitest + fast-check                                                          | 4.1 / 4.x         |
| E2E             | Playwright (desktop + iPhone-13 viewport projects)                           | 1.5x              |
| Package manager | pnpm, lockfile committed, `--frozen-lockfile` in CI                          | 11.9              |
| Node            | 22 LTS (`engines`, CI matrix)                                                | 22.15             |

## Notable choices

- **`proxy.ts`** (Next 16 name) instead of deprecated `middleware.ts` for session
  refresh + route protection.
- **Base UI over Radix**: shadcn 4.x default; composition via `render` prop.
  Our `Button` defaults `nativeButton` to false when `render` is present.
- **No extra libraries** for env (hand-rolled Zod in `lib/env.ts`), logging
  (`lib/observability/logger.ts`), or state (SPEC §56.1 dependency policy).
- **Fonts**: IBM Plex Sans/Mono/Serif via `next/font` — engineering-document
  character, full Swedish glyph support, tabular numerals for instrument UI
  (SPEC §10.3 allows a sparing serif; learning/chart UI stays sans).
- **Design tokens**: two scoped themes — `:root` paper (marketing/lessons) and
  `.theme-instrument` (chart lab/simulations/dashboards). The Tailwind `dark:`
  variant is remapped to `.theme-instrument` scope.

## Consequences

- Version bumps happen deliberately (renovate/manual), never implicitly.
- shadcn components are owned after generation — audited and restyled locally;
  regeneration must not blindly overwrite `components/ui`.
