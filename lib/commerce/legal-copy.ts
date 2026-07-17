import { TERMS_VERSION, WITHDRAWAL_CONSENT_VERSION } from "@/lib/commerce/constants";

/**
 * Checkout legal copy (SPEC §69). Draft wording — the authoritative,
 * lawyer-reviewed source is docs/LEGAL_COPY.md ([LEGAL GATE], HUMAN_VERIFY #8).
 * Kept here (not only in the doc) so the checkout page, the receipt and the
 * consent snapshot all render the SAME text tied to the SAME version id.
 *
 * `{tokens}` are filled at render time from product/order data.
 */

export const WITHDRAWAL_CONSENT_LABEL =
  "Jag vill få tillgång direkt. Jag begär att tjänsten görs tillgänglig omedelbart och förstår att jag därmed förlorar min ångerrätt när tjänsten levererats i sin helhet. Fram till dess har jag 14 dagars ångerrätt.";

export const WITHDRAWAL_CONFIRMATION =
  "Du godkände omedelbar tillgång och avstod därmed från ångerrätten enligt distansavtalslagen.";

export interface DisclosureItem {
  heading: string;
  body: string;
}

/**
 * The §69.1 thirteen-item pre-purchase disclosure. Kept as data so the checkout
 * renders it as a real list and a reviewer can diff it against docs/LEGAL_COPY.md.
 */
export const PRE_PURCHASE_DISCLOSURE: DisclosureItem[] = [
  {
    heading: "Säljare",
    body: "Sjöklart (organisationsnummer och adress anges av operatören innan lansering).",
  },
  {
    heading: "Tjänsten",
    body: "Digital förberedelsekurs inför Förarintyg: lektioner, övningar, sjökortslabb och kortlekar. Fristående — prov och intyg ingår inte.",
  },
  {
    heading: "Totalpris inkl. moms",
    body: "Priset visas i kronor inklusive moms innan du betalar. Inga dolda avgifter.",
  },
  {
    heading: "Betalning",
    body: "Kort eller Klarna via Stripe. Beloppet dras vid köpet.",
  },
  {
    heading: "Tillgångens längd",
    body: "Tillgången gäller den angivna perioden från köptillfället. Ingen automatisk förnyelse och ingen prenumeration.",
  },
  {
    heading: "Officiella avgifter tillkommer",
    body: "Provlicens och bokningsavgift betalas separat till NFB och ingår inte i priset.",
  },
  {
    heading: "Ångerrätt",
    body: "Du har 14 dagars ångerrätt enligt distansavtalslagen — se dock nästa punkt om omedelbar leverans.",
  },
  {
    heading: "Omedelbar leverans",
    body: "Om du begär direkt tillgång (kryssrutan nedan) förlorar du ångerrätten när tjänsten har levererats i sin helhet.",
  },
  {
    heading: "Så ångrar du köpet",
    body: "Har du inte begärt omedelbar leverans mejlar du oss inom 14 dagar så återbetalar vi hela beloppet.",
  },
  {
    heading: "Digital tjänst",
    body: "Tjänsten kräver konto och internetuppkoppling. Inga fysiska varor levereras.",
  },
  {
    heading: "Support",
    body: "Kontakta oss via kundtjänst — vi svarar normalt inom en till två arbetsdagar.",
  },
  {
    heading: "Reklamation och tvist",
    body: "Du kan vända dig till Allmänna reklamationsnämnden (ARN) och EU:s plattform för tvistlösning (ODR).",
  },
  {
    heading: "Personuppgifter",
    body: "Behandlas enligt vår integritetspolicy. För barn samlar vi bara in visningsnamn och åldersspann.",
  },
];

/** The versions currently shown at checkout — snapshotted onto every order. */
export const CURRENT_LEGAL_VERSIONS = {
  terms: TERMS_VERSION,
  withdrawal: WITHDRAWAL_CONSENT_VERSION,
} as const;
