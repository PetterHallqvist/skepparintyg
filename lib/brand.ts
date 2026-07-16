/**
 * Brand configuration — single source for product naming and standing copy.
 *
 * "Sjöklart" is a WORKING NAME (SPEC header): a trademark/domain check is an
 * open operator task (docs/HUMAN_VERIFY.md #9). Nothing outside this file may
 * hard-code the product name.
 */
export const BRAND = {
  name: "Sjöklart",
  /** Used in <title> templates: `${page} · Sjöklart` */
  titleTemplate: "%s · Sjöklart",
  tagline: "Lär dig det du faktiskt behöver kunna",
  description:
    "Fristående förberedelse inför Förarintyg — med interaktivt sjökortsarbete, tydlig återkoppling och en plan fram till provdagen.",
  /** Placeholder until domain decision (HUMAN_VERIFY). */
  domain: "sjoklart.example",
  supportEmail: "support@sjoklart.example",
  /** SPEC §68.1 — shown site-wide. */
  independenceDisclaimer:
    "Fristående utbildningstjänst. Prov och intyg hanteras separat genom den officiella processen hos NFB.",
  /** SPEC §68.2 — shown on every chart surface and export. */
  navigationDisclaimer: "Övningskort — ej för navigation.",
  /** SPEC §68.5 */
  readinessDisclaimer:
    "Beredskap är en vägledning baserad på dina studieresultat — inte en garanti för provresultat.",
} as const;

export type Brand = typeof BRAND;
