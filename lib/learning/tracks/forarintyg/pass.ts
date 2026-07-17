import type { DemoItem } from "../../demo";

/**
 * Förarintyg mixed daily pass (SPEC §28). Exercises every Phase 2 item
 * renderer + server grading end-to-end without a database. Draft quality,
 * sources marked unverified — same policy as the seed bank (M1).
 */

export const PASS_ITEMS: DemoItem[] = [
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
  {
    index: 5,
    kind: "single_choice",
    stemSv:
      "Ett kardinalmärke har två svarta koner som båda pekar UPPÅT. Var ligger faran — och var passerar du?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Nordmärke — faran ligger söder om märket, passera norr om" },
        { key: "b", text_sv: "Sydmärke — passera söder om" },
        { key: "c", text_sv: "Ostmärke — passera öster om" },
        { key: "d", text_sv: "Västmärke — passera väster om" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Två koner uppåt = nordmärke: gå norr om märket. Konerna är minnesregeln — uppåt nord, nedåt syd, ”ägg” ost (basen mot basen? nej: spetsarna isär), ”timglas” väst.",
    sourceRef: "Lektion: Kardinalmärken",
    objectiveTitle: "Kardinalmärken",
    misconceptionByKey: {
      b: "Märket ANGER den säkra sidan (norr), inte farans sida.",
    },
  },
  {
    index: 6,
    kind: "matching",
    stemSv: "Para ihop kardinalmärkets topptecken med sidan du ska passera på.",
    interaction: {
      kind: "matching",
      left: [
        { key: "l1", text_sv: "Koner spets mot spets (timglas)" },
        { key: "l2", text_sv: "Koner bas mot bas" },
        { key: "l3", text_sv: "Båda konerna nedåt" },
      ],
      right: [
        { key: "r1", text_sv: "Väster om märket" },
        { key: "r2", text_sv: "Öster om märket" },
        { key: "r3", text_sv: "Söder om märket" },
      ],
    },
    answerKey: { pairs: { l1: "r1", l2: "r2", l3: "r3" } },
    explanation:
      "Väst = timglas (spets mot spets), ost = bas mot bas, syd = båda nedåt, nord = båda uppåt. Passera alltid på märkets väderstreckssida.",
    sourceRef: "Lektion: Kardinalmärken",
    objectiveTitle: "Kardinalmärken",
  },
  {
    index: 7,
    kind: "single_choice",
    stemSv: "Vad markerar ett märke med röda och svarta band och två svarta klot i toppen?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Punktmärke — fara av liten utsträckning; passera på valfri sida" },
        { key: "b", text_sv: "Mittledsmärke" },
        { key: "c", text_sv: "Nordmärke" },
        { key: "d", text_sv: "Förbjudet område" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Svart-rött med två klot = punktmärke (isolated danger): märket står PÅ faran — håll avstånd men sidan är valfri.",
    sourceRef: "Lektion: Övriga sjömärken",
    objectiveTitle: "Punkt- och specialmärken",
  },
  {
    index: 8,
    kind: "numeric",
    stemSv:
      "Din kompasskurs är 120° och missvisningen på platsen är +6° (ostlig). Deviationen är 0°. Vilken är din rättvisande kurs?",
    interaction: { kind: "numeric", unit: "grader" },
    answerKey: { value: 126, tolerance: 0 },
    explanation:
      "Rättvisande kurs = kompasskurs + deviation + missvisning = 120 + 0 + 6 = 126°.",
    method:
      "1. Krv = Kk + deviation + missvisning.\n2. 120° + 0° + 6° = 126°.",
    sourceRef: "Lektion: Kompass och missvisning",
    objectiveTitle: "Kompass och missvisning",
  },
  {
    index: 9,
    kind: "numeric",
    stemSv: "Hur långt hinner du på 45 minuter i 8 knop? Svara i distansminuter (M).",
    interaction: { kind: "numeric", unit: "M" },
    answerKey: { value: 6, tolerance: 0 },
    explanation: "Distans = fart × tid = 8 × 0,75 h = 6,0 M.",
    method: "1. 45 min = 0,75 h.\n2. Distans = 8 × 0,75 = 6,0 M.",
    sourceRef: "Lektion: Fart, tid och distans",
    objectiveTitle: "Fart, tid och distans",
  },
  {
    index: 10,
    kind: "single_choice",
    stemSv: "I sjökortet står siffran 3₂ (3 med nedsänkt 2) på en fläck i vattnet. Vad betyder den?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Djupet är 3,2 meter" },
        { key: "b", text_sv: "3 200 meter djupt" },
        { key: "c", text_sv: "3 stenar på 2 meters djup" },
        { key: "d", text_sv: "Farledens bredd är 3,2 m" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Djupsiffror skrivs med decimalen nedsänkt: 3₂ = 3,2 m vid kortets referensnivå. Kontrollera alltid vad små siffror intill symboler betyder.",
    sourceRef: "Lektion: Sjökortets symboler",
    objectiveTitle: "Sjökortssymboler",
  },
  {
    index: 11,
    kind: "single_choice",
    stemSv: "Över hur stor båge lyser ett fartygs sidoljus?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "112,5° — från rätt förut till 22,5° akter om tvärs" },
        { key: "b", text_sv: "135°" },
        { key: "c", text_sv: "225°" },
        { key: "d", text_sv: "360°" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Sidoljus: 112,5° vardera. Toppljus: 225° (summan av sidoljusen). Akterljus: 135°. Tillsammans täcker de horisontens 360°.",
    sourceRef: "Lektion: Fartygsljus",
    objectiveTitle: "Lanternornas bågar",
  },
  {
    index: 12,
    kind: "multiple_select",
    stemSv:
      "Vilken utrustning hör till ett rimligt säkerhetsminimum för en dagstur med öppen motorbåt? Välj alla som stämmer.",
    interaction: {
      kind: "multiple_select",
      options: [
        { key: "a", text_sv: "Flytväst till alla ombord" },
        { key: "b", text_sv: "Öskar/länspump och paddel/åra" },
        { key: "c", text_sv: "Ankare med lina" },
        { key: "d", text_sv: "Vattenskidor" },
      ],
    },
    answerKey: { correct: ["a", "b", "c"] },
    explanation:
      "Flytvästar, länsredskap, reservframdrivning och ankare är kärnan i Sjösäkerhetsrådets rekommendationer för mindre båtar.",
    sourceRef: "Lektion: Säkerhetsutrustning",
    objectiveTitle: "Säkerhetsutrustning",
  },
  {
    index: 13,
    kind: "single_choice",
    stemSv:
      "Två maskindrivna båtar möts på korsande kurser — du har den andra på din STYRBORDSSIDA. Vad gäller?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Du väjer — helst tydligt och i god tid, gärna akter om den andra" },
        { key: "b", text_sv: "Den andra väjer — du håller kurs och fart" },
        { key: "c", text_sv: "Båda girar babord" },
        { key: "d", text_sv: "Den snabbare båten väjer alltid" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Korsande kurser: den som har den andra om styrbord håller undan (Regel 15). Väj tidigt, tydligt och helst akter om den andre.",
    sourceRef: "Lektion: Väjningsregler",
    objectiveTitle: "Korsande kurser",
    misconceptionByKey: {
      d: "Fart avgör inte väjningsplikt vid korsande kurser — sidan gör det.",
    },
  },
];
