import "server-only";

/**
 * Demo activity set for the pre-cloud dev shell: exercises every Phase 2 item
 * renderer + server grading end-to-end without a database. Answer keys stay
 * in this server-only module (§58.3 hygiene holds even in demo mode).
 * Content mirrors the seed bank (draft quality, review pending).
 */

export type DemoItem = {
  index: number;
  kind: string;
  stemSv: string;
  interaction: Record<string, unknown>;
  answerKey: Record<string, unknown>;
  explanation: string;
  method?: string;
  sourceRef: string;
  objectiveTitle: string;
  misconceptionByKey?: Record<string, string>;
};

export const DEMO_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "single_choice",
    stemSv:
      "Du går in mot hamn från sjön och möter ett rött märke med cylinderformat topptecken. På vilken sida ska du hålla märket?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Om babord" },
        { key: "b", text_sv: "Om styrbord" },
        { key: "c", text_sv: "Valfri sida" },
        { key: "d", text_sv: "Märket ska inte passeras alls" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Röda babordsmärken hålls om babord vid ingående från sjön (IALA A).",
    sourceRef: "Lektion: Laterala sjömärken",
    objectiveTitle: "Laterala sjömärken",
    misconceptionByKey: {
      b: "Förväxlar lateralmärkenas färger — rött hör till babordssidan vid ingående.",
    },
  },
  {
    index: 1,
    kind: "numeric",
    stemSv:
      "Du ska gå 6,0 M och håller 5,0 knop. Hur lång blir gångtiden i minuter?",
    interaction: { kind: "numeric", unit: "minuter" },
    answerKey: { value: 72, tolerance: 0 },
    explanation: "Tid = distans / fart = 6,0 / 5,0 = 1,2 timmar = 72 minuter.",
    method:
      "1. Tid i timmar = distans / fart = 6,0 / 5,0 = 1,2 h.\n2. Minuter = 1,2 × 60 = 72.",
    sourceRef: "Lektion: Fart, tid och distans",
    objectiveTitle: "Fart, tid och distans",
  },
  {
    index: 2,
    kind: "multiple_select",
    stemSv: "Vilka är vedertagna nödsignaler? Välj alla som stämmer.",
    interaction: {
      kind: "multiple_select",
      options: [
        { key: "a", text_sv: "Röd fallskärmsraket" },
        { key: "b", text_sv: "Orange rök" },
        { key: "c", text_sv: "MAYDAY på VHF kanal 16" },
        { key: "d", text_sv: "Grönt handbloss" },
      ],
    },
    answerKey: { correct: ["a", "b", "c"] },
    explanation:
      "Röda raketer/bloss, orange rök och MAYDAY på kanal 16 är nödsignaler. Gröna ljus används inte som nödsignal.",
    sourceRef: "Lektion: Säkerhet ombord och nödsignaler",
    objectiveTitle: "Nödsignaler",
  },
  {
    index: 3,
    kind: "ordering",
    stemSv: "Ordna åtgärderna i rimlig ordning inför en dagstur.",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "Kontrollera väderprognos" },
        { key: "b", text_sv: "Gå igenom säkerhetsutrustningen" },
        { key: "c", text_sv: "Meddela färdplan till någon i land" },
        { key: "d", text_sv: "Lägga ut från bryggan" },
      ],
    },
    answerKey: { order: ["a", "b", "c", "d"] },
    explanation:
      "Väder först (avgör om turen blir av), sedan utrustning, sedan färdplan — sist avgång.",
    sourceRef: "Lektion: Säkerhet ombord och nödsignaler",
    objectiveTitle: "Säkerhet ombord",
  },
  {
    index: 4,
    kind: "matching",
    stemSv: "Para ihop varje fyrbeteckning med sin beskrivning.",
    interaction: {
      kind: "matching",
      left: [
        { key: "l1", text_sv: "F" },
        { key: "l2", text_sv: "Fl" },
        { key: "l3", text_sv: "Iso" },
      ],
      right: [
        { key: "r1", text_sv: "Fast sken" },
        { key: "r2", text_sv: "Blixt — kort ljus, längre mörker" },
        { key: "r3", text_sv: "Lika lång ljus- och mörkerperiod" },
      ],
    },
    answerKey: { pairs: { l1: "r1", l2: "r2", l3: "r3" } },
    explanation: "F = fast sken, Fl = blixt, Iso = isofas.",
    sourceRef: "Lektion: Fyrkaraktärer",
    objectiveTitle: "Fyrkaraktärer",
  },
];

export function sanitizeDemoItem(item: DemoItem) {
  return {
    index: item.index,
    total: DEMO_ITEMS.length,
    kind: item.kind,
    stemSv: item.stemSv,
    interaction: item.interaction,
    objectiveTitle: item.objectiveTitle,
  };
}

export type DemoChallenge = ReturnType<typeof sanitizeDemoItem>;
