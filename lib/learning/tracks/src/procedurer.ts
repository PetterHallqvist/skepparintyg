import type { DemoItem } from "../../demo";

/**
 * SRC — rutintrafik, bokstavering och marin engelska (SPEC §31 R4, R8).
 * Draft quality, sources marked unverified.
 */

const SOURCE = "Lektion: SRC — procedurer (utkast, ej källgranskad)";

export const PROCEDURER_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "ordering",
    stemSv:
      "Ordna stegen i ett korrekt rutinanrop till en annan fritidsbåt (utan DSC).",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "Lyssna av kanal 16 så att den är ledig" },
        { key: "b", text_sv: "”[Motpartens namn] × 3 — DETTA ÄR [ditt namn] × 3, KOM”" },
        { key: "c", text_sv: "Kom överens om en ledig arbetskanal" },
        { key: "d", text_sv: "Byt till arbetskanalen och genomför samtalet" },
        { key: "e", text_sv: "Avsluta tydligt: ”KLART SLUT”" },
      ],
    },
    answerKey: { order: ["a", "b", "c", "d", "e"] },
    explanation:
      "Anropet sker kort på 16 (eller en anropskanal), själva samtalet flyttar direkt till en arbetskanal — 16 hålls fri.",
    sourceRef: SOURCE,
    objectiveTitle: "Rutinanrop",
  },
  {
    index: 1,
    kind: "single_choice",
    stemSv: "Vad betyder ”KOM” (engelska OVER) i slutet av en sändning?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Jag är klar — jag väntar på ditt svar" },
        { key: "b", text_sv: "Samtalet är helt avslutat" },
        { key: "c", text_sv: "Jag byter kanal nu" },
        { key: "d", text_sv: "Upprepa ditt senaste meddelande" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "KOM/OVER lämnar över ordet. KLART SLUT/OUT avslutar samtalet — de kombineras aldrig (”over and out” är fel).",
    sourceRef: SOURCE,
    objectiveTitle: "Procedurord",
    misconceptionByKey: {
      b: "Det är KLART SLUT (OUT) som avslutar — KOM begär svar.",
    },
  },
  {
    index: 2,
    kind: "matching",
    stemSv: "Para ihop procedurordet med dess betydelse.",
    interaction: {
      kind: "matching",
      left: [
        { key: "l1", text_sv: "”DETTA ÄR” (THIS IS)" },
        { key: "l2", text_sv: "”UPPREPA” (SAY AGAIN)" },
        { key: "l3", text_sv: "”RÄTTELSE” (CORRECTION)" },
      ],
      right: [
        { key: "r1", text_sv: "Här följer den sändande stationens namn" },
        { key: "r2", text_sv: "Sänd ditt senaste meddelande igen" },
        { key: "r3", text_sv: "Jag sa fel — det rätta följer nu" },
      ],
    },
    answerKey: { pairs: { l1: "r1", l2: "r2", l3: "r3" } },
    explanation:
      "Standardiserade procedurord gör trafiken entydig även vid dåliga förhållanden och över språkgränser.",
    sourceRef: SOURCE,
    objectiveTitle: "Procedurord",
  },
  {
    index: 3,
    kind: "matching",
    stemSv: "Para ihop siffran med rätt uttal i radiotrafik (marin engelska).",
    interaction: {
      kind: "matching",
      left: [
        { key: "l1", text_sv: "5" },
        { key: "l2", text_sv: "9" },
        { key: "l3", text_sv: "1000" },
      ],
      right: [
        { key: "r1", text_sv: "FIFE" },
        { key: "r2", text_sv: "NINER" },
        { key: "r3", text_sv: "ONE TOUSAND" },
      ],
    },
    answerKey: { pairs: { l1: "r1", l2: "r2", l3: "r3" } },
    explanation:
      "Siffror uttalas med standardljud (FIFE, NINER, TOUSAND) för att inte förväxlas i brus — 5/9 är det klassiska förväxlingsparet.",
    sourceRef: SOURCE,
    objectiveTitle: "Marin engelska — siffror",
  },
  {
    index: 4,
    kind: "ordering",
    stemSv: "Bokstavera ”EK” + siffran 4 enligt det fonetiska alfabetet, i ordning.",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "ECHO" },
        { key: "b", text_sv: "KILO" },
        { key: "c", text_sv: "FOWER" },
      ],
    },
    answerKey: { order: ["a", "b", "c"] },
    explanation: "E = Echo, K = Kilo och siffran 4 uttalas FOWER.",
    sourceRef: SOURCE,
    objectiveTitle: "Bokstavering",
  },
  {
    index: 5,
    kind: "single_choice",
    stemSv:
      "Du hör en pågående nödtrafik på kanal 16 och behöver själv göra ett rutinanrop. Vad gäller?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Radiotystnad för dig — nödtrafiken har absolut företräde",
        },
        { key: "b", text_sv: "Anropa mellan de andras sändningar" },
        { key: "c", text_sv: "Höj effekten så att du hörs över dem" },
        { key: "d", text_sv: "Byt till kanal 70 och tala där" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Nödtrafik äger kanalen. Rutintrafik väntar eller flyttar — och kanal 70 är aldrig en talkanal.",
    sourceRef: SOURCE,
    objectiveTitle: "Trafikdisciplin",
  },
  {
    index: 6,
    kind: "single_choice",
    stemSv: "Vad innebär sekretessen i sjöradiotrafiken?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Det du råkar höra får inte föras vidare eller utnyttjas",
        },
        { key: "b", text_sv: "All trafik är krypterad" },
        { key: "c", text_sv: "Du får inte lyssna på andras samtal" },
        { key: "d", text_sv: "Endast myndigheter får använda VHF" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Radion är ett öppet medium — alla hör allt. Sekretessen ligger i att inte sprida eller utnyttja det du hört.",
    sourceRef: SOURCE,
    objectiveTitle: "Sekretess",
  },
  {
    index: 7,
    kind: "multiple_select",
    stemSv: "Vad kännetecknar bra taldisciplin på VHF? Välj alla som stämmer.",
    interaction: {
      kind: "multiple_select",
      options: [
        { key: "a", text_sv: "Tänk igenom meddelandet INNAN du trycker på sändknappen" },
        { key: "b", text_sv: "Tala långsamt, tydligt och i normal samtalston" },
        { key: "c", text_sv: "Håll sändningarna korta" },
        { key: "d", text_sv: "Fyll tystnad med småprat så kanalen hålls varm" },
      ],
    },
    answerKey: { correct: ["a", "b", "c"] },
    explanation:
      "Planera – tala tydligt – fatta dig kort. Kanalen är gemensam; småprat blockerar den för andra.",
    sourceRef: SOURCE,
    objectiveTitle: "Taldisciplin",
  },
];
