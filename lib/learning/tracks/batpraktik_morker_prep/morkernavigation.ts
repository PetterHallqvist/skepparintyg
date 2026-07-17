import type { DemoItem } from "../../demo";

/**
 * Båtpraktik mörker — mörkernavigation: fyrar, leder och säker framfart
 * (SPEC §29 i mörkerkontext). Draft quality, sources marked unverified.
 */

const SOURCE =
  "Lektion: Båtpraktik mörker — navigation (utkast, ej källgranskad)";

export const MORKERNAVIGATION_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "single_choice",
    stemSv:
      "Hur identifierar du en fyr säkert i mörker bland många ljus i land?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Ta tid på karaktären (blinkmönster + period) och jämför med kortets beteckning",
        },
        { key: "b", text_sv: "Fyren är alltid det starkaste ljuset" },
        { key: "c", text_sv: "Fyrar är alltid röda" },
        { key: "d", text_sv: "Styr mot ljuset så ser du snart" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Karaktären är fyrens fingeravtryck: räkna blinkar och ta perioden med klocka. Gatlyktor och skyltar blinkar inte enligt kortet.",
    sourceRef: SOURCE,
    objectiveTitle: "Fyridentifiering",
    misconceptionByKey: {
      d: "Att styra mot oidentifierade ljus är mörkernavigationens klassiska fälla.",
    },
  },
  {
    index: 1,
    kind: "matching",
    stemSv: "Para ihop fyrkaraktären med hur du räknar in den.",
    interaction: {
      kind: "matching",
      left: [
        { key: "l1", text_sv: "Iso 4s" },
        { key: "l2", text_sv: "LFl 8s" },
        { key: "l3", text_sv: "Q(6)+LFl 15s" },
      ],
      right: [
        { key: "r1", text_sv: "Lika ljus och mörker — 2 s + 2 s" },
        { key: "r2", text_sv: "En lång blixt (≥2 s) per åtta sekunder" },
        { key: "r3", text_sv: "Sex snabba + en lång — sydmärkets karaktär" },
      ],
    },
    answerKey: { pairs: { l1: "r1", l2: "r2", l3: "r3" } },
    explanation:
      "Isofas delar perioden lika; LFl är den långa blixten; Q(6)+LFl är kardinalmärket för syd — sex snabba och en lång.",
    sourceRef: SOURCE,
    objectiveTitle: "Fyrkaraktärer i mörker",
  },
  {
    index: 2,
    kind: "single_choice",
    stemSv:
      "Du går in i en ledfyrs vita sektor. Ljuset skiftar plötsligt till grönt. Vad gör du?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Korrigerar tillbaka mot den vita sektorn — du har drivit ur den säkra linjen",
        },
        { key: "b", text_sv: "Fortsätter — grönt betyder kör" },
        { key: "c", text_sv: "Ankrar omedelbart" },
        { key: "d", text_sv: "Släcker egna lanternor för att se bättre" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Sektorgränsen ÄR varningen: färgskiftet talar om åt vilket håll du glidit. Grönt i en sektorfyr är inte trafikljusets ”kör”.",
    sourceRef: SOURCE,
    objectiveTitle: "Sektorfyrar i praktiken",
    misconceptionByKey: {
      b: "Sektorfärger är lägesbesked, inte körsignaler.",
    },
  },
  {
    index: 3,
    kind: "single_choice",
    stemSv: "Vilken fart är rätt i mörker i trång skärgård?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "En fart där du kan stanna inom den sträcka du faktiskt överblickar",
        },
        { key: "b", text_sv: "Samma som på dagen — leden är densamma" },
        { key: "c", text_sv: "Alltid exakt 5 knop" },
        { key: "d", text_sv: "Så fort som möjligt för att korta exponeringstiden" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Säker fart är en funktion av sikt och stoppsträcka. I mörker krymper det du överblickar — farten måste krympa med.",
    sourceRef: SOURCE,
    objectiveTitle: "Säker fart i mörker",
  },
  {
    index: 4,
    kind: "ordering",
    stemSv: "Ordna förberedelserna för en mörkerpassage i skärgård.",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "Planera rutten i kortet med fyrer, sektorer och bäringar i dagsljus" },
        { key: "b", text_sv: "Ställ plotter och belysning i nattläge före mörkrets inbrott" },
        { key: "c", text_sv: "Fördela roller: rorsman, utkik, kortläsare" },
        { key: "d", text_sv: "Följ upp varje passerat märke mot planen under gång" },
      ],
    },
    answerKey: { order: ["a", "b", "c", "d"] },
    explanation:
      "Mörkernavigering vinns i förberedelsen: rutt i dagsljus, nattanpassad utrustning, tydliga roller — och en aktiv avbockning under gång.",
    sourceRef: SOURCE,
    objectiveTitle: "Mörkerförberedelser",
  },
  {
    index: 5,
    kind: "single_choice",
    stemSv:
      "Varför är obelysta sjömärken (prickar) ett särskilt problem i mörker?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "De syns först på nära håll eller inte alls — rutten läggs efter fyrbelysta märken och fria vatten",
        },
        { key: "b", text_sv: "De flyttar sig på natten" },
        { key: "c", text_sv: "De är inte utsatta i kortet" },
        { key: "d", text_sv: "De är inget problem — reflexen syns alltid" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "En obelyst prick är i praktiken osynlig tills strålkastaren träffar den. Nattrutten planeras på lysande märken, sektorer och god marginal.",
    sourceRef: SOURCE,
    objectiveTitle: "Obelysta märken",
  },
  {
    index: 6,
    kind: "single_choice",
    stemSv: "Hur använder du strålkastare klokt i mörker?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Sparsamt och riktat — t.ex. för att hitta en prick — aldrig svepande mot andra båtar",
        },
        { key: "b", text_sv: "Konstant tänd hela natten" },
        { key: "c", text_sv: "Mot mötande båtar så de ser dig" },
        { key: "d", text_sv: "Aldrig — strålkastare är förbjudna" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Strålkastaren förstör allas mörkerseende, ditt inklusive. Korta riktade svep vid behov — och aldrig i ansiktet på andra.",
    sourceRef: SOURCE,
    objectiveTitle: "Belysningsdisciplin",
  },
  {
    index: 7,
    kind: "single_choice",
    stemSv:
      "Bakgrundsljus från staden gör det svårt att se en mötande båts lanternor. Vad är rätt åtgärd?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Sänk farten och flytta blicken — skanna långsamt i kanten av synfältet",
        },
        { key: "b", text_sv: "Öka farten ur området" },
        { key: "c", text_sv: "Lita på att de ser dig" },
        { key: "d", text_sv: "Titta stint rakt fram" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Mörkerseendet är känsligast strax vid sidan av blickpunkten. Långsam skanning + sänkt fart ger dig tid att skilja lanternor från stadsljus.",
    sourceRef: SOURCE,
    objectiveTitle: "Utkik i mörker",
  },
];
