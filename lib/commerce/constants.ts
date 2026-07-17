/**
 * Versioned commerce copy identifiers (SPEC §69). These strings are snapshotted
 * onto every order so a receipt always reflects the exact terms and withdrawal
 * wording shown at purchase time, even after the copy is later revised.
 *
 * [LEGAL GATE] The human-readable text these version ids point at lives in
 * docs/LEGAL_COPY.md and needs Swedish consumer-law sign-off before go-live
 * (docs/HUMAN_VERIFY.md #8). Bumping the copy = bump the version id here.
 */
export const TERMS_VERSION = "kopvillkor-2026-07-16-utkast";
export const WITHDRAWAL_CONSENT_VERSION = "angerratt-2026-07-16-utkast";
export const PRIVACY_POLICY_VERSION = "integritet-2026-07-16-utkast";
