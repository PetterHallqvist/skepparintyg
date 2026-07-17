import type { DemoItem } from "../../demo";

/**
 * Båtpraktik mörker — ljusbilder från rorsmansplats (SPEC §25 + §29 i
 * mörkerkontext). Draft quality, sources marked unverified.
 */

const SOURCE =
  "Lektion: Båtpraktik mörker — ljusbilder (utkast, ej källgranskad)";

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

export const LJUS_IGENKANNING_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "single_choice",
    stemSv:
      "Du ser ENDAST ett vitt ljus föröver, lågt över vattnet, och det rör sig långsamt. Vad kan det INTE uteslutas vara?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Ett upphinnbart fartyg akterifrån, en ankarljusbåt eller en liten båt under åror",
        },
        { key: "b", text_sv: "Ett fartyg som kommer rakt emot dig" },
        { key: "c", text_sv: "En trålare i arbete" },
        { key: "d", text_sv: "Ett fartyg med begränsad manöverförmåga" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Ett ensamt vitt ljus är mångtydigt: akterljus, ankarljus eller en liten båt. Möte skulle visa sidoljus; specialfartyg visar färgade runtljus. Sänk farten tills bilden klarnar.",
    sourceRef: SOURCE,
    objectiveTitle: "Ljusbilder — ensamt vitt ljus",
  },
  {
    index: 1,
    kind: "single_choice",
    stemSv:
      "Du ser ett GRÖNT sidoljus och ett vitt toppljus snett om styrbord, på väg åt höger i din synbild. Vilken sida av fartyget ser du?",
    interaction: {
      kind: "single_choice",
      stimulus: { kind: "light_scene", config: "power_starboard_side", animated: false },
      options: [
        { key: "a", text_sv: "Dess styrbordssida — det går åt höger sett från dig" },
        { key: "b", text_sv: "Dess babordssida" },
        { key: "c", text_sv: "Aktern" },
        { key: "d", text_sv: "Fören, rakt emot" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Grönt sidoljus = du ser fartygets styrbordssida. Rött = babordssidan. Bägge samtidigt = rakt förifrån.",
    sourceRef: SOURCE,
    objectiveTitle: "Sidoljusens logik",
  },
  {
    index: 2,
    kind: "light_build",
    stemSv:
      "Bygg ljusbilden för ett maskindrivet fartyg under 50 m, sett så att alla föreskrivna ljus är representerade. Välj lyktorna.",
    interaction: {
      kind: "light_build",
      view: "stern",
      palette: paletteList,
    },
    answerKey: {
      correct: ["mast", "port", "stbd", "stern"],
      palette: paletteMap,
    },
    explanation:
      "Maskindrivet under 50 m: toppljus, båda sidoljusen och akterljus. Ankarljuset hör inte hemma på ett fartyg med gång.",
    sourceRef: SOURCE,
    objectiveTitle: "Ljusbilder — maskindrivet fartyg",
  },
  {
    index: 3,
    kind: "single_choice",
    stemSv:
      "En segelbåt under segel i mörker — vilka ljus visar den (under 20 m, standardfall)?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Sidoljus och akterljus — men INGET toppljus" },
        { key: "b", text_sv: "Samma som en motorbåt, med toppljus" },
        { key: "c", text_sv: "Bara ett runtlysande rött ljus" },
        { key: "d", text_sv: "Inga ljus alls under segel" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Segel utan maskin = inget toppljus. Ser du sidoljus utan toppljus är det ett segelfartyg — startar motorn tänds toppljuset.",
    sourceRef: SOURCE,
    objectiveTitle: "Ljusbilder — segelfartyg",
    misconceptionByKey: {
      b: "Toppljuset hör till maskindrift — en seglande båt saknar det.",
    },
  },
  {
    index: 4,
    kind: "single_choice",
    stemSv:
      "Ett vitt ljus över ett grönt ljus (runtlysande) syns om babord. Vad är det?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Ett fartyg som trålar" },
        { key: "b", text_sv: "Ett lotsfartyg" },
        { key: "c", text_sv: "En ankrad segelbåt" },
        { key: "d", text_sv: "Ett muddervek" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Grönt över vitt — trålarljus (minnesregel: ”green over white, trawling tonight”). Ge gott om plats: redskapen kan sträcka sig långt.",
    sourceRef: SOURCE,
    objectiveTitle: "Ljusbilder — fiskefartyg",
  },
  {
    index: 5,
    kind: "matching",
    stemSv: "Para ihop ljusbilden med situationen (allt runtlysande).",
    interaction: {
      kind: "matching",
      left: [
        { key: "l1", text_sv: "Ett vitt" },
        { key: "l2", text_sv: "Rött över rött" },
        { key: "l3", text_sv: "Vitt över rött" },
      ],
      right: [
        { key: "r1", text_sv: "Fartyg till ankars (under 50 m)" },
        { key: "r2", text_sv: "Ej manöverfärdigt fartyg" },
        { key: "r3", text_sv: "Lotsfartyg i tjänst" },
      ],
    },
    answerKey: { pairs: { l1: "r1", l2: "r2", l3: "r3" } },
    explanation:
      "Ankarljus = ett vitt; ”red over red” = ej manöverfärdig; ”white over red” = lots. Tre bilder som måste sitta i mörker.",
    sourceRef: SOURCE,
    objectiveTitle: "Runtlysande kombinationer",
  },
  {
    index: 6,
    kind: "single_choice",
    stemSv:
      "Ljusbilden föröver ändras: du såg grönt sidoljus, nu ser du BÅDE rött och grönt. Vad händer?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Fartyget har girat och pekar nu rakt mot dig" },
        { key: "b", text_sv: "Fartyget har stannat" },
        { key: "c", text_sv: "Fartyget har ankrat" },
        { key: "d", text_sv: "Lanternorna har gått sönder" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Från ena sidoljuset till båda = stäven pekar mot dig. Ljusbildens FÖRÄNDRING är ofta viktigare än ögonblicksbilden — agera enligt mötesregeln.",
    sourceRef: SOURCE,
    objectiveTitle: "Ljusbildens förändring",
  },
  {
    index: 7,
    kind: "single_choice",
    stemSv:
      "Varför är skattning av AVSTÅND till ett ljus i mörker så opålitlig?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Ögat saknar referenser — ljusstyrka förväxlas med närhet",
        },
        { key: "b", text_sv: "Ljus rör sig långsammare i mörker" },
        { key: "c", text_sv: "Det är bara svårt vid fullmåne" },
        { key: "d", text_sv: "Det är inte svårt — ögat är pålitligt" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "En stark lanterna långt bort ser ut som en svag nära. Använd bäringsändring, kort och plotter — inte magkänslan — för avståndsbedömning i mörker.",
    sourceRef: SOURCE,
    objectiveTitle: "Avståndsbedömning i mörker",
  },
];
