/**
 * Deck source of truth (SPEC §37.3–37.5). Facts, terminology, light characters,
 * signal meanings, formulas and short rule distinctions — never exam-like items
 * (§37.5). Card fields follow §37.4. Draft quality; sources marked unverified.
 * Pure data (no timestamps generated at runtime) so exports stay deterministic.
 *
 * This .mjs is the single source consumed by the offline pipeline AND, typed,
 * by the app registry (lib/decks/registry.ts).
 */

const CERT = "forarintyg";
const SYLLABUS = "forar-2026";
const REVIEWED = "2026-07-16";

/** Build one card with the §37.4 field set from a compact spec. */
function card(spec) {
  return {
    card_id: spec.id,
    certification: CERT,
    syllabus_version: SYLLABUS,
    objective_id: spec.objective,
    front: spec.front,
    back: spec.back,
    extra_explanation: spec.extra ?? "",
    source_short: spec.source ?? "Sjöklart (utkast, ej källgranskad)",
    source_url_or_id: spec.sourceId ?? `internal:${spec.objective}`,
    media_path: "",
    media_alt: "",
    card_type: spec.type ?? "basic",
    content_version: "1",
    last_reviewed_at: REVIEWED,
  };
}

const basbegrepp = {
  id: "forarintyg-basbegrepp",
  title_sv: "Förarintyg — Basbegrepp",
  access: "free",
  expectedCount: 12,
  cards: [
    card({ id: "bb-nm", objective: "forar.f2.enheter", front: "Vad är 1 nautisk mil (M) ungefär i meter?", back: "1852 meter" }),
    card({ id: "bb-knop", objective: "forar.f2.enheter", front: "Vad betyder 1 knop?", back: "1 nautisk mil per timme" }),
    card({ id: "bb-styrbord", objective: "forar.f2.sprak", front: "Vilken sida är styrbord?", back: "Höger sida sett föröver" }),
    card({ id: "bb-babord", objective: "forar.f2.sprak", front: "Vilken sida är babord?", back: "Vänster sida sett föröver" }),
    card({ id: "bb-lat-red", objective: "forar.f4.lateral", front: "Vilken färg har ett babordsmärke (IALA A) vid ingående?", back: "Rött (hålls om babord vid ingående från sjön)" }),
    card({ id: "bb-lat-green", objective: "forar.f4.lateral", front: "Vilken färg har ett styrbordsmärke (IALA A) vid ingående?", back: "Grönt (hålls om styrbord vid ingående)" }),
    card({ id: "bb-fl", objective: "forar.f4.fyr", front: "Vad betyder fyrkaraktären Fl?", back: "Blixt — ljus kortare än mörker", extra: "Fl(2) = två blixtar i grupp per period." }),
    card({ id: "bb-iso", objective: "forar.f4.fyr", front: "Vad betyder fyrkaraktären Iso?", back: "Isofas — lika lång ljus- och mörkerperiod" }),
    card({ id: "bb-oc", objective: "forar.f4.fyr", front: "Vad betyder fyrkaraktären Oc?", back: "Förmörkelse — mest ljus med korta mörka avbrott" }),
    card({ id: "bb-1kort", objective: "forar.f8.ljud", front: "Vad betyder en (1) kort stöt i ljudsignal?", back: "Jag ändrar min kurs till styrbord" }),
    card({ id: "bb-2kort", objective: "forar.f8.ljud", front: "Vad betyder två (2) korta stötar?", back: "Jag ändrar min kurs till babord" }),
    card({ id: "bb-5kort", objective: "forar.f8.ljud", front: "Vad betyder minst fem (5) korta stötar?", back: "Tvivels- eller varningssignal" }),
  ],
};

const formler = {
  id: "forarintyg-formler",
  title_sv: "Förarintyg — Formler och kursomvandling",
  access: "paid",
  expectedCount: 8,
  cards: [
    card({ id: "fo-tid", objective: "forar.f7.std", front: "Formel: gångtid ur distans och fart?", back: "Tid = distans / fart", extra: "6,0 M / 5 knop = 1,2 h = 72 min." }),
    card({ id: "fo-distans", objective: "forar.f7.std", front: "Formel: distans ur fart och tid?", back: "Distans = fart × tid" }),
    card({ id: "fo-fart", objective: "forar.f7.std", front: "Formel: fart ur distans och tid?", back: "Fart = distans / tid" }),
    card({ id: "fo-min", objective: "forar.f7.std", front: "Hur många minuter är 1,2 timmar?", back: "72 minuter (1,2 × 60)", type: "basic" }),
    card({ id: "fo-rv-mv", objective: "forar.f5.kompass", front: "Kursomvandling: rättvisande kurs → missvisande kurs?", back: "mvK = rvK − missvisning(ostlig +, västlig −) … applicera med rätt tecken", extra: "Öva alltid med aktuell missvisning från kortet." }),
    card({ id: "fo-dev", objective: "forar.f5.kompass", front: "Vad är deviation (deviation)?", back: "Kompassens fel orsakat av fartygets eget magnetfält, varierar med kurs" }),
    card({ id: "fo-miss", objective: "forar.f5.kompass", front: "Vad är missvisning (variation)?", back: "Skillnaden mellan rättvisande och magnetisk nord på platsen" }),
    card({ id: "fo-kompasskurs", objective: "forar.f5.kompass", front: "Kompasskurs = rättvisande kurs korrigerad för …?", back: "… missvisning och deviation (hela kedjan rv → magnetisk → kompass)" }),
  ],
};

export const DECKS = [basbegrepp, formler];
