# LEGAL_COPY.md — draft consumer-facing legal copy

_2026-07-16 · **temporary draft, `[LEGAL GATE]`** · needs Swedish consumer-law
sign-off before go-live (docs/HUMAN_VERIFY.md #8)._

This file is the reviewable home for the exact wording behind the versioned
identifiers in [`lib/commerce/constants.ts`](../lib/commerce/constants.ts) and
[`lib/commerce/legal-copy.ts`](../lib/commerce/legal-copy.ts). **None of this is
lawyer-approved.** Bumping any wording = bump the matching version id in
`constants.ts` so historic orders keep the text they were actually shown.

Legal references: distansavtalslagen (2005:59), konsumentköplagen, and the SPEC's
own §69 checkout requirements. The withdrawal-right interaction with *immediate
digital delivery* is the sensitive part and the reason §69.2 exists.

## `angerratt-2026-07-16-utkast` — withdrawal-right consent (§69.2)

The checkout presents this as a **deliberate, unchecked-by-default** control. The
purchase cannot proceed until the buyer actively checks it.

> **Jag vill få tillgång direkt.** Jag begär att tjänsten görs tillgänglig
> omedelbart, och jag förstår att jag därmed **förlorar min ångerrätt** när
> tjänsten har levererats i sin helhet. Fram till dess har jag 14 dagars ångerrätt.

Durable confirmation shown on the receipt (§69.2 item 3):

> Du godkände omedelbar tillgång och avstod därmed från ångerrätten enligt
> distansavtalslagen. Detta godkännande registrerades {tidpunkt}.

## `kopvillkor-2026-07-16-utkast` — §69.1 pre-purchase disclosure (13 items)

Shown in full on the checkout page before the pay button (see
`PRE_PURCHASE_DISCLOSURE` in `legal-copy.ts`):

1. **Säljare:** {Sjöklart, organisationsnummer, adress} — _[operatörsuppgift]_.
2. **Tjänsten:** digital förberedelsekurs inför Förarintyg (lektioner, övningar,
   sjökortslabb, kortlekar). Fristående — prov och intyg ingår inte.
3. **Totalpris inkl. moms** anges i kronor innan köp; {momssats} moms ingår.
4. **Betalning** sker med kort/Klarna via Stripe. Inga dolda avgifter.
5. **Tillgångens längd:** {access_months} månader från köpet. Ingen automatisk
   förnyelse och ingen prenumeration.
6. **Officiella avgifter** (provlicens, bokning) betalas separat till NFB och
   ingår inte i priset.
7. **Ångerrätt:** 14 dagar enligt distansavtalslagen — men se punkt 8.
8. **Omedelbar leverans:** om du begär direkt tillgång (kryssrutan) förlorar du
   ångerrätten när tjänsten levererats i sin helhet.
9. **Så ångrar du dig** (innan omedelbar leverans begärts): mejla
   {support}. Vi återbetalar hela beloppet.
10. **Digital tjänst:** kräver konto och internetuppkoppling; inga fysiska varor.
11. **Support:** {support} — vi svarar normalt inom {svarstid}.
12. **Reklamation och tvist:** du kan vända dig till Allmänna reklamations-
    nämnden (ARN) och EU:s plattform för tvistlösning (ODR).
13. **Personuppgifter** behandlas enligt vår [integritetspolicy](/integritet);
    barns uppgifter minimeras (endast visningsnamn + åldersspann).

## `integritet-2026-07-16-utkast`

Placeholder id for the privacy-policy version snapshotted on consent events. Full
policy text is out of scope for this file (marketing/legal task, M7 §7a legal
pages) — the id exists so `consent_events.policy_version` is meaningful now.
