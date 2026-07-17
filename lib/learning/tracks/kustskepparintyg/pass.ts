import type { DemoItem } from "../../demo";

/**
 * Kustskepparintyg mixed daily pass (SPEC §30, K1–K10). Draft quality,
 * sources marked unverified — Förhandsversion pending domain review.
 */

const SOURCE = "Lektion: Kustskeppar — blandat pass (utkast, ej källgranskad)";

export const PASS_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "numeric",
    stemSv:
      "Din kompasskurs är 087°. Deviationen är +3° och missvisningen +5°. Vilken rättvisande kurs styr du?",
    interaction: { kind: "numeric", unit: "grader" },
    answerKey: { value: 95, tolerance: 0 },
    explanation:
      "Kompasskurs + deviation = magnetisk kurs (087 + 3 = 090). Magnetisk kurs + missvisning = rättvisande kurs (090 + 5 = 095).",
    method:
      "1. Km + dev = Km(magnetisk): 087° + 3° = 090°.\n2. Kmagnetisk + missvisning = Krv: 090° + 5° = 095°.",
    sourceRef: SOURCE,
    objectiveTitle: "Kompass och kursomvandling",
  },
  {
    index: 1,
    kind: "single_choice",
    stemSv:
      "Du navigerar i mörker mot en fyr med vit, röd och grön sektor. Ditt ljus från fyren är rött. Vad betyder det normalt?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Du är i den säkra sektorn — fortsätt" },
        {
          key: "b",
          text_sv: "Du är utanför den säkra sektorn — kontrollera positionen och sök dig mot vitt sken",
        },
        { key: "c", text_sv: "Fyren är släckt för underhåll" },
        { key: "d", text_sv: "Röd sektor gäller bara dagtid" },
      ],
    },
    answerKey: { correct: "b" },
    explanation:
      "I en sektorfyr markerar den vita sektorn normalt friskt vatten/rätt led. Rött eller grönt sken varnar för att du är utanför den säkra sektorn.",
    sourceRef: SOURCE,
    objectiveTitle: "Fyrsektorer och mörkernavigation",
    misconceptionByKey: {
      a: "Förväxlar sektorfärgerna — vitt är normalt den säkra sektorn, inte rött.",
    },
  },
  {
    index: 2,
    kind: "single_choice",
    stemSv:
      "Nedsatt sikt. Ett maskindrivet fartyg som gör fart genom vattnet ska avge vilken ljudsignal?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Ett långt ljud minst varannan minut" },
        { key: "b", text_sv: "Två långa ljud minst varannan minut" },
        { key: "c", text_sv: "Ett långt och två korta ljud" },
        { key: "d", text_sv: "Ingen signal om radar används" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Maskindrivet fartyg med fart genom vattnet: ett långt ljud med högst två minuters mellanrum. Två långa = uppstoppad; lång + två korta = bl.a. segelfartyg och fartyg med begränsad manöverförmåga.",
    sourceRef: SOURCE,
    objectiveTitle: "Ljudsignaler i nedsatt sikt",
    misconceptionByKey: {
      d: "Radar ersätter aldrig föreskrivna ljudsignaler i nedsatt sikt.",
    },
  },
  {
    index: 3,
    kind: "ordering",
    stemSv: "Ordna stegen i en enkel passageplanering i rimlig ordning.",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "Hämta prognos, varningar och kontrollera Ufs-rättelser" },
        { key: "b", text_sv: "Lägg rutten med etapper, faror och alternativhamnar" },
        { key: "c", text_sv: "Beräkna distans, fart och ETA per etapp" },
        { key: "d", text_sv: "Gå igenom planen med besättningen före avgång" },
      ],
    },
    answerKey: { order: ["a", "b", "c", "d"] },
    explanation:
      "Underlag först (väder + rättade kort), sedan rutt, sedan beräkningar — och genomgång innan ni lägger ut.",
    sourceRef: SOURCE,
    objectiveTitle: "Passageplanering",
  },
  {
    index: 4,
    kind: "multiple_select",
    stemSv:
      "Vilka är rimliga korskontroller av GNSS-positionen under gång? Välj alla som stämmer.",
    interaction: {
      kind: "multiple_select",
      options: [
        { key: "a", text_sv: "Pejla ett känt sjömärke och jämför med kortet" },
        { key: "b", text_sv: "Jämför ekolodets djup med kortets djupkurvor" },
        { key: "c", text_sv: "Zooma in mer på plottern" },
        { key: "d", text_sv: "Kontrollera mot en enslinje när tillfälle ges" },
      ],
    },
    answerKey: { correct: ["a", "b", "d"] },
    explanation:
      "Korskontroll betyder oberoende källa: pejling, djup och enslinjer prövar positionen. Mer zoom visar bara samma GNSS-position större.",
    sourceRef: SOURCE,
    objectiveTitle: "Elektronik och korskontroll",
    misconceptionByKey: {
      c: "Zoomnivån ändrar inte positionens källa — det är ingen kontroll.",
    },
  },
  {
    index: 5,
    kind: "matching",
    stemSv: "Para ihop publikationen med dess innehåll.",
    interaction: {
      kind: "matching",
      left: [
        { key: "l1", text_sv: "Ufs" },
        { key: "l2", text_sv: "Svensk fyrlista" },
        { key: "l3", text_sv: "Seglingsbeskrivning" },
      ],
      right: [
        { key: "r1", text_sv: "Underrättelser och rättelser för sjöfarande" },
        { key: "r2", text_sv: "Fyrars karaktär, höjd och lysvidd" },
        { key: "r3", text_sv: "Beskrivning av farvatten, leder och hamnar" },
      ],
    },
    answerKey: { pairs: { l1: "r1", l2: "r2", l3: "r3" } },
    explanation:
      "Ufs håller korten rättade; fyrlistan ger fyrarnas data; seglingsbeskrivningen beskriver farvattnet i text.",
    sourceRef: SOURCE,
    objectiveTitle: "Sjökort och publikationer",
  },
];
