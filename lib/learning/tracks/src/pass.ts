import type { DemoItem } from "../../demo";

/**
 * SRC (VHF-radio) mixed daily pass (SPEC §31, R1–R10). Theory items only —
 * the generic radio lab (§32) is a later surface. Draft quality, sources
 * marked unverified — Förhandsversion pending domain review.
 */

const SOURCE = "Lektion: SRC — blandat pass (utkast, ej källgranskad)";

export const PASS_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "single_choice",
    stemSv: "Vilken VHF-kanal används för nödanrop med tal?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Kanal 16" },
        { key: "b", text_sv: "Kanal 70" },
        { key: "c", text_sv: "Kanal 6" },
        { key: "d", text_sv: "Kanal 72" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Kanal 16 är den internationella nöd-, il- och anropskanalen för tal. Kanal 70 är reserverad för DSC (digitala anrop) — aldrig tal.",
    sourceRef: SOURCE,
    objectiveTitle: "Nödtrafik — MAYDAY",
    misconceptionByKey: {
      b: "Kanal 70 används enbart för DSC-signalering, aldrig för talat nödanrop.",
    },
  },
  {
    index: 1,
    kind: "ordering",
    stemSv: "Ordna delarna i ett korrekt MAYDAY-anrop.",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "”MAYDAY, MAYDAY, MAYDAY”" },
        { key: "b", text_sv: "”DETTA ÄR [fartygets namn] × 3”" },
        { key: "c", text_sv: "”MAYDAY [fartygets namn]” + position" },
        { key: "d", text_sv: "Nödens art och vilken hjälp som begärs" },
        { key: "e", text_sv: "Antal personer ombord — invänta svar" },
      ],
    },
    answerKey: { order: ["a", "b", "c", "d", "e"] },
    explanation:
      "Nödanropet inleds med MAYDAY × 3, sedan identitet, position, nödens art och hjälpbehov, antal ombord — och därefter lyssnar du efter svar.",
    sourceRef: SOURCE,
    objectiveTitle: "Nödtrafik — MAYDAY",
  },
  {
    index: 2,
    kind: "matching",
    stemSv: "Para ihop bokstaven med rätt ord i det fonetiska alfabetet.",
    interaction: {
      kind: "matching",
      left: [
        { key: "l1", text_sv: "F" },
        { key: "l2", text_sv: "L" },
        { key: "l3", text_sv: "V" },
      ],
      right: [
        { key: "r1", text_sv: "Foxtrot" },
        { key: "r2", text_sv: "Lima" },
        { key: "r3", text_sv: "Victor" },
      ],
    },
    answerKey: { pairs: { l1: "r1", l2: "r2", l3: "r3" } },
    explanation:
      "Det internationella fonetiska alfabetet gör bokstavering entydig: F = Foxtrot, L = Lima, V = Victor.",
    sourceRef: SOURCE,
    objectiveTitle: "Bokstavering och marin engelska",
  },
  {
    index: 3,
    kind: "single_choice",
    stemSv:
      "Vad händer när du håller in DSC-nödknappen (röd, skyddad) i cirka fem sekunder?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Radion sänder ett digitalt nödlarm med din MMSI och position på kanal 70",
        },
        { key: "b", text_sv: "Radion spelar upp ett inspelat MAYDAY på kanal 16" },
        { key: "c", text_sv: "Radion ringer upp sjöräddningen som ett telefonsamtal" },
        { key: "d", text_sv: "Inget — knappen kräver dubbelklick" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "DSC-larmet sänder identitet (MMSI) och position digitalt på kanal 70. Därefter följer du upp med ett talat MAYDAY på kanal 16.",
    sourceRef: SOURCE,
    objectiveTitle: "DSC och GMDSS",
    misconceptionByKey: {
      b: "DSC ersätter inte röstanropet — det digitala larmet följs upp med MAYDAY på kanal 16.",
    },
  },
  {
    index: 4,
    kind: "single_choice",
    stemSv: "Vad innebär det att en VHF-kanal är simplex?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Sändning och mottagning sker på samma frekvens — en talar åt gången",
        },
        { key: "b", text_sv: "Kanalen kan bara användas i hamn" },
        { key: "c", text_sv: "Båda parter kan tala samtidigt, som i telefon" },
        { key: "d", text_sv: "Kanalen är reserverad för myndigheter" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Simplex = en frekvens för både sändning och mottagning; man turas om att tala. Duplex använder två frekvenser.",
    sourceRef: SOURCE,
    objectiveTitle: "VHF-grunder",
    misconceptionByKey: {
      c: "Samtidigt tal åt båda håll kräver duplex — simplex är turordning.",
    },
  },
  {
    index: 5,
    kind: "multiple_select",
    stemSv: "Vad gäller för rutinanrop på VHF? Välj alla som stämmer.",
    interaction: {
      kind: "multiple_select",
      options: [
        { key: "a", text_sv: "Lyssna av kanalen innan du sänder" },
        { key: "b", text_sv: "Använd lägsta uteffekt som räcker (ofta 1 W)" },
        { key: "c", text_sv: "Avbryt aldrig pågående nödtrafik" },
        { key: "d", text_sv: "Tala så snabbt som möjligt för att hålla anropet kort" },
      ],
    },
    answerKey: { correct: ["a", "b", "c"] },
    explanation:
      "Lyssna först, sänd med låg effekt och stör aldrig nödtrafik. Tala lugnt och tydligt — snabbt tal gör anropet svårare, inte kortare.",
    sourceRef: SOURCE,
    objectiveTitle: "Rutintrafik",
    misconceptionByKey: {
      d: "Tydlighet går före tempo — tala långsamt och artikulerat.",
    },
  },
];
