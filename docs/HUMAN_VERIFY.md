# HUMAN_VERIFY — open operator items

_2026-07-16 · continuous document. Items the build cannot resolve on its own
(SPEC §0.1: unclear official requirements become labelled, configurable
assumptions — never silent code)._

## Blocking cloud deploy & payments (not local dev)

| #   | Item                                                                                                                                      | Needed by             | Status |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ------ |
| 1   | New **Supabase EU** project (separate from every other project)                                                                           | first deploy          | open   |
| 2   | Vercel project + production domain                                                                                                        | first deploy          | open   |
| 3   | Stripe account (+ enable Klarna), price decision within SPEC §9.1 ranges                                                                  | Phase 6               | open   |
| 4   | Resend account + verified sending domain                                                                                                  | Phase 6–7             | open   |
| 5   | PostHog EU project                                                                                                                        | Phase 7               | open   |
| 6   | Local container runtime (Docker Desktop/OrbStack) so `supabase start` / `supabase test db` run on this machine — CI covers them meanwhile | developer convenience | open   |
| 7   | Supabase auth email: Resend SMTP vs default sender                                                                                        | first deploy          | open   |

## Blocking real content going live (not the build)

| #   | Item                                                                                             | Needed by                       | Status |
| --- | ------------------------------------------------------------------------------------------------ | ------------------------------- | ------ |
| 8   | Current NFB kunskapsfordringar/product pages for Förarintyg (source register, SPEC §3.2)         | Phase 1 content beyond samples  | open   |
| 9   | Qualified navigation-instructor reviewer + editorial reviewer engaged                            | content `live` gate (SPEC §8.3) | open   |
| 10  | Maritime-cartography review of generated fictional charts                                        | launch (SPEC §20.1)             | open   |
| 11  | Original media: knot photos/illustrations, manoeuvre illustrations, licences recorded            | Phase 4                         | open   |
| 12  | Re-verify all `official_facts` values (75 %, 90/120/60 min, ages, fees) within 14 days of launch | M9 DoD                          | open   |

## Blocking public launch (not the build)

| #   | Item                                                                                                                                       | Needed by | Status |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ------ |
| 13  | Swedish counsel: consumer terms, withdrawal-consent checkout wording (SPEC §69.2), privacy incl. minors (§70–71), guarantee wording (§9.5) | M8/M9     | open   |
| 14  | Accountant: VAT classification and pricing incl. moms                                                                                      | Phase 6   | open   |
| 15  | "Sjöklart" trademark + domain check (working name per SPEC header)                                                                         | launch    | open   |
| 16  | Beta cohort recruitment, 30–75 learners                                                                                                    | M8        | open   |
