import type { DemoItem } from "../../demo";

/**
 * Båtpraktik mörker — teoriförberedelse (SPEC §29 i mörkerkontext + §25).
 * Ljusbilder, nattseende och försiktig mörkermanöver. Draft quality, sources
 * marked unverified.
 */

const SOURCE =
  "Lektion: Båtpraktik mörker — förberedelse (utkast, ej källgranskad)";

const BUILD_PALETTE = {
  mast: { role: "masthead", color: "white", label_sv: "Vitt toppljus" },
  port: {
    role: "sidelight_port",
    color: "red",
    label_sv: "Rött sidoljus (babord)",
  },
  stbd: {
    role: "sidelight_starboard",
    color: "green",
    label_sv: "Grönt sidoljus (styrbord)",
  },
  stern: { role: "sternlight", color: "white", label_sv: "Vitt akterljus" },
  anchor: {
    role: "allround_white",
    color: "white",
    label_sv: "Runtlysande vitt ljus",
  },
  nuc: {
    role: "allround_red_upper",
    color: "red",
    label_sv: "Runtlysande rött ljus",
  },
} as const;

const paletteList = Object.entries(BUILD_PALETTE).map(([key, v]) => ({
  key,
  ...v,
}));
const paletteMap = Object.fromEntries(
  Object.entries(BUILD_PALETTE).map(([k, v]) => [
    k,
    { role: v.role, color: v.color },
  ]),
);

export const PASS_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "single_choice",
    stemSv:
      "I mörker ser du rakt föröver både ett rött och ett grönt sidoljus med ett vitt toppljus ovanför. Vad innebär det?",
    interaction: {
      kind: "single_choice",
      stimulus: { kind: "light_scene", config: "power_head_on", animated: false },
      options: [
        { key: "a", text_sv: "Ett maskindrivet fartyg kommer rakt emot dig" },
        { key: "b", text_sv: "Du hinner upp ett långsammare fartyg" },
        { key: "c", text_sv: "Ett fartyg ligger för ankar" },
        { key: "d", text_sv: "Ett fartyg visar dig sin styrbordssida" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Båda sidoljusen samtidigt betyder att du ser fartyget rakt förifrån — mötessituation, båda ska gira styrbord.",
    sourceRef: SOURCE,
    objectiveTitle: "Ljusbilder från rorsmansplats",
    misconceptionByKey: {
      c: "Ett ankrat fartyg visar runtlysande vitt — aldrig sidoljus.",
    },
  },
  {
    index: 1,
    kind: "light_build",
    stemSv:
      "Bygg ljusbilden för ett fartyg under 50 m som ligger för ankar. Välj alla lyktor som ska visas.",
    interaction: {
      kind: "light_build",
      view: "stern",
      palette: paletteList,
    },
    answerKey: {
      correct: ["anchor"],
      palette: paletteMap,
    },
    explanation:
      "Ett ankrat fartyg under 50 m visar en enda runtlysande vit lykta — inga sidoljus, inget akterljus.",
    sourceRef: SOURCE,
    objectiveTitle: "Ljusbilder — ankarljus",
  },
  {
    index: 2,
    kind: "single_choice",
    stemSv: "Hur bevarar du bäst nattseendet under gång i mörker?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Använd svag röd belysning och undvik vitt ljus i sittbrunnen",
        },
        { key: "b", text_sv: "Titta in i strålkastaren med jämna mellanrum" },
        { key: "c", text_sv: "Höj plotterns ljusstyrka till max" },
        { key: "d", text_sv: "Blunda med ett öga i taget varje minut" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Ögats mörkeradaption tar 20–30 minuter och förstörs på sekunder av vitt ljus. Rött, dämpat ljus och nattläge på skärmar bevarar den.",
    sourceRef: SOURCE,
    objectiveTitle: "Nattseende",
    misconceptionByKey: {
      c: "En ljusstark skärm bländar — plottern ska stå i nattläge, nedbländad.",
    },
  },
  {
    index: 3,
    kind: "matching",
    stemSv: "Para ihop fyrkaraktären med hur den ser ut i mörkret.",
    interaction: {
      kind: "matching",
      left: [
        { key: "l1", text_sv: "Q" },
        { key: "l2", text_sv: "Fl(3) 10s" },
        { key: "l3", text_sv: "Oc" },
      ],
      right: [
        { key: "r1", text_sv: "Snabba blixtar i följd" },
        { key: "r2", text_sv: "Tre blixtar i grupp, period tio sekunder" },
        { key: "r3", text_sv: "Mer ljus än mörker — korta förmörkelser" },
      ],
    },
    answerKey: { pairs: { l1: "r1", l2: "r2", l3: "r3" } },
    explanation:
      "Q = snabblixt, Fl(3) = gruppblixt om tre, Oc = intermittent sken där ljuset dominerar.",
    sourceRef: SOURCE,
    objectiveTitle: "Fyrar och mörkernavigation",
  },
  {
    index: 4,
    kind: "single_choice",
    stemSv:
      "Du är osäker på en mötande båts avsikter i mörker. Vad är den försiktigaste åtgärden?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Sakta in eller stoppa tills läget är klarlagt" },
        { key: "b", text_sv: "Öka farten för att hinna förbi" },
        { key: "c", text_sv: "Blinka med strålkastaren mot båten" },
        { key: "d", text_sv: "Gira växelvis åt båda håll" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Vid tveksamhet: dra ner farten. Små växelvisa girar och bländande ljus gör dig svårare att läsa för den andre.",
    sourceRef: SOURCE,
    objectiveTitle: "Mörkermanöver",
    misconceptionByKey: {
      d: "Växelvisa girar gör din ljusbild obegriplig — håll tydlig kurs eller stoppa.",
    },
  },
  {
    index: 5,
    kind: "sound_produce",
    stemSv:
      "Ge ljudsignalen för ”jag ändrar min kurs åt styrbord” — en kort stöt. Håll ned hornet kort en gång.",
    interaction: {
      kind: "sound_produce",
      hint_sv: "En kort stöt ≈ 1 sekund.",
    },
    answerKey: { pattern: ["short"] },
    explanation:
      "En kort stöt = kursändring åt styrbord (Regel 34). Två korta = babord, tre korta = back.",
    sourceRef: SOURCE,
    objectiveTitle: "Ljudsignaler i mörker",
  },
];
