import type { DemoItem } from "../../demo";

/**
 * Seglarintyg 3 — avancerad (SPEC §33.3). Offshore, hårt väder, natt och
 * felscenarier. Draft quality, sources marked unverified.
 */

const SOURCE = "Lektion: Seglarintyg 3 — blandat pass (utkast, ej källgranskad)";

export const PASS_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "single_choice",
    stemSv: "Vad är huvudsyftet med ett vaktsystem på en längre överfart?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Att alla får vila så att utkik och beslut håller kvalitet dygnet runt",
        },
        { key: "b", text_sv: "Att skepparen slipper segla på natten" },
        { key: "c", text_sv: "Att fördela matlagningen rättvist" },
        { key: "d", text_sv: "Det är bara ett formellt krav utan praktisk nytta" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Trötthet försämrar omdöme och utkik. Ett vaktsystem med tydliga överlämningar håller besättningen skarp hela överfarten.",
    sourceRef: SOURCE,
    objectiveTitle: "Offshoreplanering och vaktsystem",
  },
  {
    index: 1,
    kind: "ordering",
    stemSv:
      "Prognosen visar hårt väder om sex timmar. Ordna förberedelserna i rimlig ordning.",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "Uppdatera prognosen och besluta om rutt eller alternativhamn" },
        { key: "b", text_sv: "Reva och byt till mindre segel i god tid" },
        { key: "c", text_sv: "Säkra löst gods och rigga säkerhetslinor på däck" },
        { key: "d", text_sv: "Genomgång med besättningen — varm mat och vila i förväg" },
      ],
    },
    answerKey: { order: ["a", "b", "c", "d"] },
    explanation:
      "Beslutet först (undvika är bäst), sedan segelplan medan det är lugnt, däcket säkras — och besättningen förbereds medan det går.",
    sourceRef: SOURCE,
    objectiveTitle: "Hårt väder och konservativa beslut",
  },
  {
    index: 2,
    kind: "single_choice",
    stemSv: "När är det olämpligt att sätta spinnaker?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "I byig, ökande vind nära gränsen för besättningens erfarenhet",
        },
        { key: "b", text_sv: "I jämn frisk vind med van besättning" },
        { key: "c", text_sv: "På öppet vatten med gott om sjörum" },
        { key: "d", text_sv: "När båten gör mindre än fem knop" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Spinnakern förstärker allt: i byig, ökande vind blir broach-risken stor. Sätt den med marginal — ta ner den innan den tar ner dig.",
    sourceRef: SOURCE,
    objectiveTitle: "Spinnaker och gennaker",
  },
  {
    index: 3,
    kind: "single_choice",
    stemSv: "Vad ingår i en bra nattrutin offshore?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Livsele påkopplad i sittbrunnen, strukturerade vaktbyten och röd belysning nere",
        },
        { key: "b", text_sv: "Alla sover samtidigt när autopiloten styr" },
        { key: "c", text_sv: "Full däcksbelysning hela natten" },
        { key: "d", text_sv: "Vaktbyte utan överlämning för att inte störa" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Natt = sele/livlina, tydliga överlämningar (kurs, trafik, väder) och bevarat mörkerseende. Autopilot ersätter aldrig utkiken.",
    sourceRef: SOURCE,
    objectiveTitle: "Natt- och offshorerutiner",
    misconceptionByKey: {
      b: "Utkiksplikten gäller dygnet runt — autopiloten ser ingenting.",
    },
  },
  {
    index: 4,
    kind: "multiple_select",
    stemSv:
      "Vilka åtgärder minskar risken att ett roderhaveri blir en nödsituation? Välj alla som stämmer.",
    interaction: {
      kind: "multiple_select",
      options: [
        { key: "a", text_sv: "Öva nödstyrning innan den behövs" },
        { key: "b", text_sv: "Veta var nödrorkulten finns och att den passar" },
        { key: "c", text_sv: "Segla alltid med autopilot så slits rodret mindre" },
        { key: "d", text_sv: "Kontrollera styrsystemet före avgång" },
      ],
    },
    answerKey: { correct: ["a", "b", "d"] },
    explanation:
      "Förberedelse gör haveriet hanterbart: övad nödstyrning, känd nödrorkult och kontrollerat system. Autopiloten skyddar inte mekaniken.",
    sourceRef: SOURCE,
    objectiveTitle: "Underhåll och felscenarier",
  },
  {
    index: 5,
    kind: "numeric",
    stemSv:
      "Barometern har fallit 6 hPa på 3 timmar. Hur stort är fallet per timme (hPa/h)?",
    interaction: { kind: "numeric", unit: "hPa/h" },
    answerKey: { value: 2, tolerance: 0 },
    explanation:
      "6 hPa / 3 h = 2 hPa per timme. Fall på 1–2 hPa/h eller mer signalerar snabb försämring — planera konservativt.",
    method: "1. Fall per timme = totalt fall / tid = 6 / 3 = 2 hPa/h.",
    sourceRef: SOURCE,
    objectiveTitle: "Vädertolkning",
  },
];
