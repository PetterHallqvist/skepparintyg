import type { DemoItem } from "../../demo";

/**
 * Lights, day shapes & sound-signal trainer content (SPEC §25, §28.4).
 * Draft quality, sources marked unverified — same policy as the seed bank
 * (M1). Each item pairs a stimulus (light scene, day shape, or synthesised
 * sound) with a response kind the engine already grades.
 */

const SOURCE = "Lektion: Ljus, dagersignaler och ljud (utkast, ej källgranskad)";

// Full palette reused by the two light_build items.
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

export const LIGHTS_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "single_choice",
    stemSv:
      "Mitt på dagen visar ett fartyg en svart boll förut. Vad betyder dagersignalen?",
    interaction: {
      kind: "single_choice",
      stimulus: { kind: "day_shape", shape: "ball" },
      options: [
        { key: "a", text_sv: "Fartyget ligger för ankar" },
        { key: "b", text_sv: "Fartyget är manöveroförmöget" },
        { key: "c", text_sv: "Fartyget fiskar" },
        { key: "d", text_sv: "Segelfartyg som även går för motor" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "En svart boll förut är dagersignalen för ett fartyg som ligger för ankar.",
    sourceRef: SOURCE,
    objectiveTitle: "Dagersignaler",
    misconceptionByKey: {
      d: "Segelfartyg för motor visar en kon med spetsen nedåt — inte en boll.",
    },
  },
  {
    index: 1,
    kind: "single_choice",
    stemSv:
      "I mörker ser du ett fartyg som visar en enda runtlysande vit lykta och inga andra ljus. Vad är det troligen?",
    interaction: {
      kind: "single_choice",
      stimulus: { kind: "light_scene", config: "anchor", animated: false },
      options: [
        { key: "a", text_sv: "Ett ankrat fartyg under 50 m" },
        { key: "b", text_sv: "Ett maskindrivet fartyg med gång" },
        { key: "c", text_sv: "Ett segelfartyg med gång" },
        { key: "d", text_sv: "Ett manöveroförmöget fartyg" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Ett ankrat fartyg under 50 m visar en runtlysande vit lykta där den syns bäst.",
    sourceRef: SOURCE,
    objectiveTitle: "Ankarljus",
  },
  {
    index: 2,
    kind: "light_build",
    stemSv:
      "Bygg ljusbilden för ett maskindrivet fartyg under 50 m med gång. Välj alla lyktor som ska visas.",
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
      "Ett maskindrivet fartyg under 50 m med gång visar toppljus, röda och gröna sidoljus samt ett akterljus.",
    sourceRef: SOURCE,
    objectiveTitle: "Fartygsljus — maskindrivet",
  },
  {
    index: 3,
    kind: "single_choice",
    stemSv:
      "En fyr blinkar två snabba blixtar följt av en längre mörk period, om och om igen med tio sekunders mellanrum. Hur noteras karaktären?",
    interaction: {
      kind: "single_choice",
      stimulus: { kind: "light_scene", light: "Fl(2) 10s", animated: true },
      options: [
        { key: "a", text_sv: "Fl(2) 10s" },
        { key: "b", text_sv: "Oc(2) 10s" },
        { key: "c", text_sv: "Iso 10s" },
        { key: "d", text_sv: "Q(2)" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Fl = blixt (ljus kortare än mörker); (2) = två blixtar per period; 10s = periodtiden.",
    method:
      "1. Kort ljus, lång mörk period → Fl (blixt).\n2. Två blixtar i grupp → (2).\n3. Perioden upprepas var tionde sekund → 10s.",
    sourceRef: SOURCE,
    objectiveTitle: "Fyrkaraktärer",
    misconceptionByKey: {
      b: "Oc (förmörkelse) är tvärtom — mest ljus med korta mörka avbrott.",
      c: "Iso har lika lång ljus- och mörkerperiod, inte korta blixtar.",
    },
  },
  {
    index: 4,
    kind: "single_choice",
    stemSv: "Lyssna på ljudsignalen. Vad betyder den?",
    interaction: {
      kind: "single_choice",
      stimulus: { kind: "sound", pattern: ["short", "short"] },
      options: [
        { key: "a", text_sv: "Jag ändrar min kurs till babord" },
        { key: "b", text_sv: "Jag ändrar min kurs till styrbord" },
        { key: "c", text_sv: "Mina maskiner går back" },
        { key: "d", text_sv: "Tvivelssignal" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Två korta stötar betyder ”Jag ändrar min kurs till babord” (Regel 34).",
    sourceRef: SOURCE,
    objectiveTitle: "Ljudsignaler — manöver",
    misconceptionByKey: {
      b: "En kort stöt betyder styrbord; två korta betyder babord.",
    },
  },
  {
    index: 5,
    kind: "sound_produce",
    stemSv:
      "Ge ljudsignalen för ”Mina maskiner går back” — tre korta stötar. Håll ned hornet kort tre gånger.",
    interaction: {
      kind: "sound_produce",
      hint_sv: "En kort stöt ≈ 1 sekund. Håll tydligt kort.",
    },
    answerKey: { pattern: ["short", "short", "short"] },
    explanation: "Tre korta stötar betyder att maskinerna går back (Regel 34).",
    sourceRef: SOURCE,
    objectiveTitle: "Ljudsignaler — producera",
  },
  {
    index: 6,
    kind: "single_choice",
    stemSv:
      "I mörker ser du rött och grönt sidoljus samt ett vitt akterljus, men inget toppljus. Vilket fartyg är det?",
    interaction: {
      kind: "single_choice",
      stimulus: {
        kind: "light_scene",
        config: "sailing_underway",
        animated: false,
      },
      options: [
        { key: "a", text_sv: "Segelfartyg med gång" },
        { key: "b", text_sv: "Maskindrivet fartyg med gång" },
        { key: "c", text_sv: "Ankrat fartyg" },
        { key: "d", text_sv: "Manöveroförmöget fartyg" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Segelfartyg med gång visar sidoljus och akterljus men inget toppljus.",
    sourceRef: SOURCE,
    objectiveTitle: "Fartygsljus — segel",
    misconceptionByKey: {
      b: "Ett maskindrivet fartyg visar även ett vitt toppljus — det saknas här.",
    },
  },
  {
    index: 7,
    kind: "single_choice",
    stemSv:
      "Ett fartyg visar två runtlysande röda lyktor i lodrät linje och inget annat. Vad signalerar det?",
    interaction: {
      kind: "single_choice",
      stimulus: {
        kind: "light_scene",
        config: "not_under_command",
        animated: false,
      },
      options: [
        { key: "a", text_sv: "Manöveroförmöget fartyg (utan fart genom vattnet)" },
        { key: "b", text_sv: "Fartyg för ankar" },
        { key: "c", text_sv: "Lotsfartyg" },
        { key: "d", text_sv: "Fartyg som bogserar" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Två runtlysande röda i lodrät linje betyder manöveroförmöget fartyg.",
    sourceRef: SOURCE,
    objectiveTitle: "Fartygsljus — särskilda",
  },
  {
    index: 8,
    kind: "sound_produce",
    stemSv:
      "Du är osäker på ett mötande fartygs avsikter. Ge tvivelssignalen — minst fem korta stötar i snabb följd.",
    interaction: {
      kind: "sound_produce",
      hint_sv: "Fem tydligt korta stötar efter varandra.",
    },
    answerKey: { pattern: ["short", "short", "short", "short", "short"] },
    explanation:
      "Minst fem korta stötar är tvivels- eller varningssignalen (Regel 34 d).",
    sourceRef: SOURCE,
    objectiveTitle: "Ljudsignaler — tvivel",
  },
  {
    index: 9,
    kind: "light_build",
    stemSv:
      "Bygg ljusbilden för ett fartyg som ligger för ankar (under 50 m). Välj alla lyktor som ska visas.",
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
      "Ett ankrat fartyg under 50 m visar en enda runtlysande vit lykta.",
    sourceRef: SOURCE,
    objectiveTitle: "Fartygsljus — ankar",
  },
];
