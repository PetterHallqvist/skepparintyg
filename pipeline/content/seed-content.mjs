#!/usr/bin/env node
/**
 * Seed-content generator (Phase 1 sample content, SPEC M1).
 *
 * Emits supabase/seed_content.sql from the data below. Regenerate after edits:
 *   node pipeline/content/seed-content.mjs
 *
 * ALL content here is DRAFT (`status='review'`): Claude-drafted against
 * well-established maritime facts, pending human domain review (SPEC §39.3 —
 * AI drafts; experts approve). Sources reference a PLACEHOLDER NFB document
 * until the real kunskapsfordringar are registered (HUMAN_VERIFY #8).
 * Item-writing rules: SPEC §19.3.
 */

const SYLLABUS_ID = "20000000-0000-0000-0000-000000000001";
const SOURCE_ID = "10000000-0000-0000-0000-000000000001";

// --- helpers ---------------------------------------------------------------

const sq = (s) =>
  s === null || s === undefined
    ? "null"
    : `'${String(s).replaceAll("'", "''")}'`;
const js = (o) => `'${JSON.stringify(o).replaceAll("'", "''")}'::jsonb`;

let out = [];
const emit = (sql) => out.push(sql);

// --- certifications (§7.1) ---------------------------------------------------

const CERTIFICATIONS = [
  [
    "forarintyg",
    "Förarintyg",
    "Förar",
    "Grundintyget för fritidsbåt.",
    true,
    false,
  ],
  [
    "batpraktik_dag_prep",
    "Båtpraktik dag — förberedelse",
    "Båtpraktik dag",
    "Förberedelse inför det handledda praktikpasset (dag).",
    false,
    true,
  ],
  [
    "batpraktik_morker_prep",
    "Båtpraktik mörker — förberedelse",
    "Båtpraktik mörker",
    "Förberedelse inför det handledda praktikpasset (mörker).",
    false,
    true,
  ],
  [
    "kustskepparintyg",
    "Kustskepparintyg",
    "Kustskeppar",
    "Fördjupad navigation och planering.",
    false,
    false,
  ],
  [
    "src",
    "SRC (VHF-certifikat)",
    "SRC",
    "Marin radiokommunikation.",
    false,
    true,
  ],
  [
    "seglarintyg_1",
    "Seglarintyg 1 — förberedelse",
    "Seglar 1",
    "Grundläggande segling, teori och praktisk beredskap.",
    false,
    true,
  ],
  [
    "seglarintyg_2",
    "Seglarintyg 2 — förberedelse",
    "Seglar 2",
    "Fortsättningssegling.",
    false,
    true,
  ],
  [
    "seglarintyg_3",
    "Seglarintyg 3 — förberedelse",
    "Seglar 3",
    "Avancerad segling.",
    false,
    true,
  ],
];

// --- objectives (10, SPEC §14) ----------------------------------------------

const OBJECTIVES = [
  [
    "forar.f2.enheter-distans",
    "F2",
    1,
    "Nautiska enheter",
    "Använda nautisk mil och knop samt omvandla mellan enheter.",
    "fact",
    "standard",
  ],
  [
    "forar.f2.koordinater",
    "F2",
    2,
    "Latitud och longitud",
    "Läsa och ange en position i latitud och longitud.",
    "concept",
    "standard",
  ],
  [
    "forar.f4.laterala-marken",
    "F4",
    1,
    "Laterala sjömärken",
    "Identifiera babords- och styrbordsmärken och välja rätt passagesida.",
    "perceptual",
    "important",
  ],
  [
    "forar.f4.kardinalmarken",
    "F4",
    2,
    "Kardinalmärken",
    "Identifiera kardinalmärken och förklara på vilken sida de ska passeras.",
    "perceptual",
    "important",
  ],
  [
    "forar.f4.fyrkaraktarer",
    "F4",
    3,
    "Fyrkaraktärer",
    "Tolka en fyrkaraktärs beteckning: typ, färg och rytm.",
    "perceptual",
    "standard",
  ],
  [
    "forar.f7.fart-tid-distans",
    "F7",
    1,
    "Fart, tid och distans",
    "Beräkna fart, tid eller distans när de två andra är kända.",
    "procedure",
    "important",
  ],
  [
    "forar.f8.vajning-motor",
    "F8",
    1,
    "Väjning mellan motorbåtar",
    "Välja korrekt väjningsåtgärd vid möte, korsande kurs och upphinnande.",
    "rule",
    "safety_critical",
  ],
  [
    "forar.f8.segel-motor",
    "F8",
    2,
    "Segel och motor",
    "Tillämpa väjningsreglerna mellan segelfartyg och maskindrivna fartyg.",
    "rule",
    "safety_critical",
  ],
  [
    "forar.f9.sakerhet-ombord",
    "F9",
    1,
    "Säkerhet ombord",
    "Välja rätt säkerhetsutrustning och förberedelser inför en färd.",
    "fact",
    "safety_critical",
  ],
  [
    "forar.f9.nodsignaler",
    "F9",
    2,
    "Nödsignaler",
    "Känna igen vedertagna nödsignaler och agera korrekt vid nöd.",
    "perceptual",
    "safety_critical",
  ],
];

// prerequisite edges (DAG, §14.3)
const OBJECTIVE_PREREQS = [
  ["forar.f7.fart-tid-distans", "forar.f2.enheter-distans", "required"],
  ["forar.f4.kardinalmarken", "forar.f4.laterala-marken", "recommended"],
  ["forar.f8.segel-motor", "forar.f8.vajning-motor", "required"],
];

// --- misconceptions (§13.6 taxonomy applied) ---------------------------------

const MISCONCEPTIONS = [
  [
    "mc.lateral-fargforvaxling",
    "Förväxlar lateralmärkenas färger",
    "Blandar ihop babords (röd) och styrbords (grön) sida i IALA A vid ingående från sjön.",
    "high_risk",
  ],
  [
    "mc.kardinal-riktning",
    "Tolkar kardinalmärkets riktning fel",
    "Tror att märkets namn anger var faran ligger i stället för på vilken sida man ska passera.",
    "high_risk",
  ],
  [
    "mc.std-enhetsfel",
    "Enhetsfel i fart–tid–distans",
    "Blandar timmar och minuter eller glömmer omvandla vid beräkning.",
    "standard",
  ],
  [
    "mc.vajning-babord",
    "Väjer åt fel håll vid möte",
    "Girar babord vid möte i stället för styrbord.",
    "safety_critical",
  ],
  [
    "mc.segel-alltid-foretrade",
    "Segel har alltid företräde",
    "Tror att segelfartyg alltid har företräde — även när det går för motor.",
    "safety_critical",
  ],
  [
    "mc.knop-per-timme",
    "Säger knop per timme",
    "Tror att knop behöver kompletteras med 'per timme' — knop är redan NM per timme.",
    "standard",
  ],
];

// --- lessons (5, §38) --------------------------------------------------------

const LESSONS = [
  {
    slug: "enheter-och-distans",
    title: "Distans och fart till sjöss",
    lead: "Varför sjön räknar i nautiska mil och knop — och hur du växlar mellan enheterna utan att tveka.",
    minutes: 8,
    objectives: [["forar.f2.enheter-distans", "primary"]],
    blocks: [
      {
        type: "markdown",
        body_sv:
          "## Nautisk mil och knop\n\nEn **nautisk mil (M)** är 1 852 meter och motsvarar en latitudminut. En **knop** är en nautisk mil per timme.\n\nAtt enheterna hänger ihop med sjökortets gradnät är ingen slump: det är därför distanser alltid mäts mot latitudskalan i kortets kant.",
      },
      {
        type: "callout",
        tone: "info",
        body_sv:
          "Knop är redan 'per timme'. Att säga 'knop per timme' är alltså dubbelt — och ett vanligt nybörjarfel.",
      },
      {
        type: "worked_example",
        body_sv:
          "**Exempel.** Du läser av 2,5 latitudminuter mellan två punkter.\n\n1. 1 latitudminut = 1 M.\n2. Distansen är alltså 2,5 M.\n3. I meter: 2,5 × 1 852 m = 4 630 m.",
      },
    ],
  },
  {
    slug: "laterala-marken",
    title: "Laterala sjömärken",
    lead: "Röd eller grön, kon eller cylinder — så väljer du rätt sida varje gång.",
    minutes: 10,
    objectives: [["forar.f4.laterala-marken", "primary"]],
    blocks: [
      {
        type: "markdown",
        body_sv:
          "## Systemet IALA A\n\nI Sverige gäller IALA-system A. Vid **ingående från sjön** (mot hamn):\n\n- **Babordsmärken** är **röda** med **cylinderformat** topptecken — håll dem om **babord**.\n- **Styrbordsmärken** är **gröna** med **konformat** topptecken (spets upp) — håll dem om **styrbord**.",
      },
      {
        type: "callout",
        tone: "warning",
        body_sv:
          "Riktningen räknas vid ingående från sjön. På väg ut gäller det omvända — kontrollera alltid färdriktningen i förhållande till farleden.",
      },
      {
        type: "markdown",
        body_sv:
          "## Ljus i mörker\n\nBabordsmärken lyser rött och styrbordsmärken grönt. Rytmen kan variera, men färgen följer alltid sidan.",
      },
    ],
  },
  {
    slug: "fart-tid-distans",
    title: "Fart, tid och distans",
    lead: "En formel, tre varianter — grunden för all planering ombord.",
    minutes: 12,
    objectives: [
      ["forar.f7.fart-tid-distans", "primary"],
      ["forar.f2.enheter-distans", "prerequisite"],
    ],
    blocks: [
      {
        type: "markdown",
        body_sv:
          "## Sambandet\n\n**Distans = fart × tid.** Ur samma samband följer:\n\n- Tid = distans / fart\n- Fart = distans / tid\n\nHåll enheterna rena: distans i nautiska mil, fart i knop, tid i timmar. Minuter räknas om: minuter = timmar × 60.",
      },
      {
        type: "worked_example",
        body_sv:
          "**Exempel.** 6,0 M med farten 5,0 knop.\n\n1. Tid = 6,0 / 5,0 = 1,2 timmar.\n2. 1,2 × 60 = **72 minuter**.",
      },
      {
        type: "callout",
        tone: "info",
        body_sv:
          "Snabbkontroll: vid 6 knop går båten 1 M på 10 minuter. Vid 12 knop: 1 M på 5 minuter.",
      },
    ],
  },
  {
    slug: "vajningsregler-grunder",
    title: "Väjningsreglernas grunder",
    lead: "Möte, korsande kurs och upphinnande — de tre situationer du måste kunna i sömnen.",
    minutes: 14,
    objectives: [
      ["forar.f8.vajning-motor", "primary"],
      ["forar.f8.segel-motor", "secondary"],
    ],
    blocks: [
      {
        type: "markdown",
        body_sv:
          "## Tre grundsituationer för maskindrivna fartyg\n\n1. **Möte stäv mot stäv:** båda girar **styrbord** och passerar babord mot babord.\n2. **Korsande kurser:** den som har den andra på sin **styrbordssida** väjer.\n3. **Upphinnande:** den som hinner upp väjer — alltid, oavsett fartygstyp.",
      },
      {
        type: "markdown",
        body_sv:
          "## Segel och motor\n\nEtt maskindrivet fartyg väjer normalt för ett segelfartyg. Men ett segelfartyg som går **för motor** räknas som maskindrivet — även med seglen uppe.",
      },
      {
        type: "callout",
        tone: "warning",
        body_sv:
          "En väjning ska vara **tydlig och göras i god tid**. Små, sena kursändringar skapar osäkerhet och farliga situationer.",
      },
    ],
  },
  {
    slug: "sakerhet-och-nod",
    title: "Säkerhet ombord och nödsignaler",
    lead: "Utrustningen som räddar liv och signalerna som kallar på hjälp.",
    minutes: 12,
    objectives: [
      ["forar.f9.sakerhet-ombord", "primary"],
      ["forar.f9.nodsignaler", "secondary"],
    ],
    blocks: [
      {
        type: "markdown",
        body_sv:
          "## Före avgång\n\n- Flytväst till alla ombord — buren väst räddar liv, stuvad gör det inte.\n- Kontrollera väderprognos, bränsle och länspump.\n- Berätta för någon i land vart ni ska och när ni väntas tillbaka.",
      },
      {
        type: "markdown",
        body_sv:
          "## Vedertagna nödsignaler\n\n- Röd fallskärmsraket eller rött handbloss\n- Orange rök\n- MAYDAY på VHF kanal 16\n- Långsamma upprepade höjningar och sänkningar av utsträckta armar\n\nNödsignaler får bara användas vid verklig nöd.",
      },
      {
        type: "callout",
        tone: "danger",
        body_sv:
          "Utlöst nödsignal av misstag? Kontakta omedelbart sjöräddningen och återkalla larmet — sök aldrig dölja ett falsklarm.",
      },
    ],
  },
];

// --- items (40, §19) ---------------------------------------------------------
// builders

let itemSeq = 0;
const ITEMS = [];

function baseItem(
  objectiveId,
  kind,
  criticality,
  stem,
  interaction,
  answerKey,
  gradingPolicy,
  explanation,
  opts = {},
) {
  itemSeq += 1;
  ITEMS.push({
    n: itemSeq,
    key: `${objectiveId.split(".").slice(1).join("-")}-${String(itemSeq).padStart(3, "0")}`,
    objectiveId,
    kind,
    criticality,
    stem,
    interaction,
    answerKey,
    gradingPolicy,
    explanation,
    misconceptions: opts.misconceptions ?? {},
    secondaryObjective: opts.secondaryObjective,
  });
}

const sc = (
  obj,
  crit,
  stem,
  options,
  correctKey,
  explanation,
  misconceptions = {},
) =>
  baseItem(
    obj,
    "single_choice",
    crit,
    stem,
    {
      kind: "single_choice",
      shuffle: true,
      options: options.map(([key, text_sv]) => ({ key, text_sv })),
    },
    { correct: correctKey },
    { mode: "single_choice" },
    explanation,
    { misconceptions },
  );

const ms = (
  obj,
  crit,
  stem,
  options,
  correctKeys,
  explanation,
  misconceptions = {},
) =>
  baseItem(
    obj,
    "multiple_select",
    crit,
    stem,
    {
      kind: "multiple_select",
      shuffle: true,
      options: options.map(([key, text_sv]) => ({ key, text_sv })),
    },
    { correct: correctKeys },
    { mode: "exact_set" },
    explanation,
    { misconceptions },
  );

const num = (
  obj,
  crit,
  stem,
  unit,
  value,
  tolerance,
  explanation,
  misconceptions = {},
) =>
  baseItem(
    obj,
    "numeric",
    crit,
    stem,
    { kind: "numeric", unit },
    { value, tolerance },
    { mode: "exact_with_tolerance" },
    explanation,
    { misconceptions },
  );

const ord = (obj, crit, stem, items, order, explanation) =>
  baseItem(
    obj,
    "ordering",
    crit,
    stem,
    {
      kind: "ordering",
      items: items.map(([key, text_sv]) => ({ key, text_sv })),
    },
    { order },
    { mode: "exact_order" },
    explanation,
  );

const match = (obj, crit, stem, left, right, pairs, explanation) =>
  baseItem(
    obj,
    "matching",
    crit,
    stem,
    {
      kind: "matching",
      left: left.map(([key, text_sv]) => ({ key, text_sv })),
      right: right.map(([key, text_sv]) => ({ key, text_sv })),
    },
    { pairs },
    { mode: "exact_pairs" },
    explanation,
  );

// F2 — enheter (4)
sc(
  "forar.f2.enheter-distans",
  "standard",
  "Hur lång är en nautisk mil?",
  [
    ["a", "1 000 meter"],
    ["b", "1 852 meter"],
    ["c", "1 609 meter"],
    ["d", "2 000 meter"],
  ],
  "b",
  "En nautisk mil är 1 852 meter och motsvarar en latitudminut.",
  { a: "mc.std-enhetsfel", c: "mc.std-enhetsfel" },
);

sc(
  "forar.f2.enheter-distans",
  "standard",
  "Vad betyder farten 6 knop?",
  [
    ["a", "6 nautiska mil per timme"],
    ["b", "6 kilometer per timme"],
    ["c", "6 nautiska mil per timme och timme"],
    ["d", "6 meter per sekund"],
  ],
  "a",
  "En knop är en nautisk mil per timme. Enheten innehåller redan 'per timme'.",
  { c: "mc.knop-per-timme" },
);

num(
  "forar.f2.enheter-distans",
  "standard",
  "Hur många meter är 2,5 nautiska mil? Svara i hela meter.",
  "meter",
  4630,
  0,
  "2,5 × 1 852 m = 4 630 m.",
);

match(
  "forar.f2.enheter-distans",
  "standard",
  "Para ihop varje enhet med sin definition.",
  [
    ["l1", "Nautisk mil"],
    ["l2", "Knop"],
    ["l3", "Latitudminut"],
  ],
  [
    ["r1", "1 852 meter"],
    ["r2", "1 nautisk mil per timme"],
    ["r3", "Motsvarar 1 nautisk mil på sjökortet"],
  ],
  { l1: "r1", l2: "r2", l3: "r3" },
  "Nautisk mil = 1 852 m; knop = M/timme; en latitudminut motsvarar en nautisk mil.",
);

// F2 — koordinater (4)
sc(
  "forar.f2.koordinater",
  "standard",
  "En position anges som N 58° 10,5′ E 011° 20,0′. Vad anger den första delen?",
  [
    ["a", "Longituden — avståndet öst–väst"],
    ["b", "Latituden — avståndet norr–söder"],
    ["c", "Kursen mot nästa punkt"],
    ["d", "Distansen till land"],
  ],
  "b",
  "Latitud (N/S) anges först och beskriver läget norr–söder; longitud (E/W) beskriver öst–väst.",
);

sc(
  "forar.f2.koordinater",
  "standard",
  "Var på sjökortet läser du av distans?",
  [
    ["a", "På longitudskalan i över- och underkant"],
    ["b", "På latitudskalan i sidokanterna"],
    ["c", "I kompassrosen"],
    ["d", "Var som helst i gradnätet"],
  ],
  "b",
  "Distans mäts alltid mot latitudskalan i kortets sidokant, där en minut motsvarar en nautisk mil.",
);

sc(
  "forar.f2.koordinater",
  "standard",
  "Hur många bågminuter går det på en grad?",
  [
    ["a", "10"],
    ["b", "60"],
    ["c", "100"],
    ["d", "360"],
  ],
  "b",
  "En grad delas i 60 minuter. Minuterna kan i sin tur delas i decimaler.",
);

ord(
  "forar.f2.koordinater",
  "standard",
  "Ordna delarna så att de bildar en korrekt skriven position.",
  [
    ["a", "N 58°"],
    ["b", "10,5′"],
    ["c", "E 011°"],
    ["d", "20,0′"],
  ],
  ["a", "b", "c", "d"],
  "Latitud skrivs först (grader, sedan minuter), därefter longitud (grader, sedan minuter).",
);

// F4 — laterala (4)
sc(
  "forar.f4.laterala-marken",
  "important",
  "Du går in mot hamn från sjön och möter ett rött märke med cylinderformat topptecken. På vilken sida ska du hålla märket?",
  [
    ["a", "Om babord"],
    ["b", "Om styrbord"],
    ["c", "Valfri sida"],
    ["d", "Märket ska inte passeras alls"],
  ],
  "a",
  "Röda babordsmärken hålls om babord vid ingående från sjön (IALA A).",
  { b: "mc.lateral-fargforvaxling" },
);

sc(
  "forar.f4.laterala-marken",
  "important",
  "Vilken färg har ett styrbordsmärkes ljus i mörker?",
  [
    ["a", "Rött"],
    ["b", "Vitt"],
    ["c", "Grönt"],
    ["d", "Gult"],
  ],
  "c",
  "Styrbordsmärken är gröna och lyser grönt; babordsmärken är röda och lyser rött.",
  { a: "mc.lateral-fargforvaxling" },
);

sc(
  "forar.f4.laterala-marken",
  "important",
  "Vilket topptecken har ett styrbordsmärke?",
  [
    ["a", "Cylinder"],
    ["b", "Kon med spetsen uppåt"],
    ["c", "Klot"],
    ["d", "Kryss"],
  ],
  "b",
  "Styrbordsmärken har konformat topptecken med spetsen uppåt; babordsmärken har cylinder.",
  { a: "mc.lateral-fargforvaxling" },
);

ms(
  "forar.f4.laterala-marken",
  "important",
  "Vilka påståenden om laterala märken i IALA A stämmer vid ingående från sjön? Välj alla som stämmer.",
  [
    ["a", "Babordsmärken är röda"],
    ["b", "Styrbordsmärken är gröna"],
    ["c", "Babordsmärken hålls om styrbord"],
    ["d", "Färgerna gäller oberoende av färdriktning"],
  ],
  ["a", "b"],
  "Rött = babordssida, grönt = styrbordssida vid ingående från sjön. Riktningen är avgörande — på utgående gäller det omvända.",
  { c: "mc.lateral-fargforvaxling" },
);

// F4 — kardinaler (4)
sc(
  "forar.f4.kardinalmarken",
  "important",
  "Hur passerar du ett nordmärke?",
  [
    ["a", "Norr om märket"],
    ["b", "Söder om märket"],
    ["c", "Så nära märket som möjligt"],
    ["d", "Valfritt — märket är bara en upplysning"],
  ],
  "a",
  "Kardinalmärkets namn anger den sida där det är säkert att passera: nordmärke passeras norr om.",
  { b: "mc.kardinal-riktning" },
);

sc(
  "forar.f4.kardinalmarken",
  "important",
  "Vilket topptecken har ett sydmärke?",
  [
    ["a", "Två koner med spetsarna uppåt"],
    ["b", "Två koner med spetsarna nedåt"],
    ["c", "Två koner bas mot bas"],
    ["d", "Två koner spets mot spets"],
  ],
  "b",
  "Sydmärket har två koner med spetsarna nedåt. Minnesregel: konerna pekar mot syd på kompassen.",
);

match(
  "forar.f4.kardinalmarken",
  "important",
  "Para ihop kardinalmärke med rätt passagesida.",
  [
    ["l1", "Nordmärke"],
    ["l2", "Ostmärke"],
    ["l3", "Sydmärke"],
    ["l4", "Västmärke"],
  ],
  [
    ["r1", "Passera norr om"],
    ["r2", "Passera öster om"],
    ["r3", "Passera söder om"],
    ["r4", "Passera väster om"],
  ],
  { l1: "r1", l2: "r2", l3: "r3", l4: "r4" },
  "Namnet anger den fria sidan: passera på den sida som märket är uppkallat efter.",
);

sc(
  "forar.f4.kardinalmarken",
  "important",
  "Vad markerar ett kardinalmärke i praktiken?",
  [
    ["a", "Farledens mitt"],
    ["b", "En fara — och på vilken sida faran kan passeras säkert"],
    ["c", "Hamnens inlopp"],
    ["d", "Ankringsplats"],
  ],
  "b",
  "Kardinalmärken ställs vid faror (t.ex. grund) och visar med sitt väderstreck var det är säkert att passera.",
  { a: "mc.kardinal-riktning" },
);

// F4 — fyrkaraktärer (4)
sc(
  "forar.f4.fyrkaraktarer",
  "standard",
  "Vad betyder fyrkaraktären Fl(2) 10s?",
  [
    ["a", "Två blixtar som upprepas var tionde sekund"],
    ["b", "Tio blixtar varannan sekund"],
    ["c", "Fast sken i tio sekunder"],
    ["d", "Två sekunders sken, tio sekunders mörker"],
  ],
  "a",
  "Fl(2) 10s = gruppblixt med två blixtar per period om tio sekunder.",
);

sc(
  "forar.f4.fyrkaraktarer",
  "standard",
  "Vad kännetecknar ett intermittent sken (Oc)?",
  [
    ["a", "Ljusperioden är längre än mörkerperioden"],
    ["b", "Mörkerperioden är längre än ljusperioden"],
    ["c", "Ljus och mörker är exakt lika långa"],
    ["d", "Ljuset är alltid rött"],
  ],
  "a",
  "Intermittent (Oc) = mestadels ljus som bryts av kortare förmörkelser. Motsatsen till blixt/blänk.",
);

sc(
  "forar.f4.fyrkaraktarer",
  "standard",
  "Vad innebär det att ett sken är Iso?",
  [
    ["a", "Ljus och mörker är lika långa"],
    ["b", "Ljuset visas bara vid nedsatt sikt"],
    ["c", "Skenet är alltid grönt"],
    ["d", "Fyren är släckt"],
  ],
  "a",
  "Isofas (Iso) betyder lika lång ljus- och mörkerperiod.",
);

match(
  "forar.f4.fyrkaraktarer",
  "standard",
  "Para ihop beteckning med beskrivning.",
  [
    ["l1", "F"],
    ["l2", "Fl"],
    ["l3", "Iso"],
    ["l4", "Q"],
  ],
  [
    ["r1", "Fast sken"],
    ["r2", "Blixt/blänk — kort ljus, längre mörker"],
    ["r3", "Lika lång ljus- och mörkerperiod"],
    ["r4", "Snabblixt — mycket täta blixtar"],
  ],
  { l1: "r1", l2: "r2", l3: "r3", l4: "r4" },
  "F = fast, Fl = blixt, Iso = isofas, Q = snabblixt.",
);

// F7 — STD (4)
num(
  "forar.f7.fart-tid-distans",
  "important",
  "Du ska gå 6,0 M och håller 5,0 knop. Hur lång blir gångtiden i minuter?",
  "minuter",
  72,
  0,
  "Tid = distans / fart = 6,0 / 5,0 = 1,2 timmar = 72 minuter.",
  {},
);

num(
  "forar.f7.fart-tid-distans",
  "important",
  "Du håller 8,0 knop i 45 minuter. Hur långt hinner du? Svara i nautiska mil med en decimal.",
  "M",
  6,
  0.05,
  "45 minuter = 0,75 timmar. Distans = fart × tid = 8,0 × 0,75 = 6,0 M.",
  {},
);

num(
  "forar.f7.fart-tid-distans",
  "important",
  "Du loggar 9,0 M på 1 timme och 30 minuter. Vilken fart har du hållit i knop?",
  "knop",
  6,
  0.05,
  "1 h 30 min = 1,5 timmar. Fart = distans / tid = 9,0 / 1,5 = 6,0 knop.",
  {},
);

num(
  "forar.f7.fart-tid-distans",
  "important",
  "Du lämnar bryggan kl. 09:40 och har 7,5 M till gästhamnen. Farten är 5,0 knop. När är du framme? Svara som klockslag HHMM.",
  "klockslag",
  1110,
  0,
  "Tid = 7,5 / 5,0 = 1,5 h = 90 minuter. 09:40 + 1:30 = 11:10.",
  {},
);

// F8 — väjning motor (4)
sc(
  "forar.f8.vajning-motor",
  "safety_critical",
  "Två motorbåtar möts stäv mot stäv. Vad är rätt?",
  [
    ["a", "Båda girar styrbord och passerar babord mot babord"],
    ["b", "Båda girar babord"],
    ["c", "Den snabbare båten väjer"],
    ["d", "Den större båten väjer"],
  ],
  "a",
  "Vid möte stäv mot stäv girar båda styrbord så att passagen sker babord mot babord.",
  { b: "mc.vajning-babord" },
);

sc(
  "forar.f8.vajning-motor",
  "safety_critical",
  "Två motorbåtar närmar sig på korsande kurser. Du har den andra båten på din styrbordssida. Vad gäller?",
  [
    ["a", "Du ska väja — helst genom att gå akter om den andra"],
    ["b", "Den andra båten ska väja"],
    ["c", "Den som är snabbast väjer"],
    ["d", "Båda håller kurs och fart"],
  ],
  "a",
  "Den som har den andra på sin styrbordssida är väjningsskyldig. Väj tydligt, gärna akter om.",
  {},
);

sc(
  "forar.f8.vajning-motor",
  "safety_critical",
  "Du hinner upp en långsammare båt. Vem ska väja?",
  [
    ["a", "Du som hinner upp — oavsett fartygstyp"],
    ["b", "Den upphunna"],
    ["c", "Den mindre båten"],
    ["d", "Ingen — den upphunna ska öka farten"],
  ],
  "a",
  "Upphinnande fartyg väjer alltid, oavsett fartygstyp — även en segelbåt som hinner upp en motorbåt.",
  { mc: {} },
);

ms(
  "forar.f8.vajning-motor",
  "safety_critical",
  "Vad kännetecknar en korrekt väjning? Välj alla som stämmer.",
  [
    ["a", "Den görs i god tid"],
    ["b", "Den är så liten att den knappt märks"],
    ["c", "Den är tydlig för den andra båten"],
    ["d", "Den kombineras vid behov med fartminskning"],
  ],
  ["a", "c", "d"],
  "Väj tidigt, tydligt och vid behov med sänkt fart. Små sena justeringar skapar osäkerhet.",
  {},
);

// F8 — segel/motor (4)
sc(
  "forar.f8.segel-motor",
  "safety_critical",
  "En motorbåt möter en segelbåt som seglar. Vem väjer normalt?",
  [
    ["a", "Motorbåten"],
    ["b", "Segelbåten"],
    ["c", "Den som ligger norrut"],
    ["d", "Ingen av dem"],
  ],
  "a",
  "Maskindrivna fartyg väjer normalt för segelfartyg under segel.",
  {},
);

sc(
  "forar.f8.segel-motor",
  "safety_critical",
  "En segelbåt går för motor med seglen uppe. Hur räknas den i väjningsreglerna?",
  [
    ["a", "Som segelfartyg"],
    ["b", "Som maskindrivet fartyg"],
    ["c", "Som fiskefartyg"],
    ["d", "Som fartyg som inte kan manövrera"],
  ],
  "b",
  "Ett segelfartyg som går för motor räknas som maskindrivet — seglen ändrar inte det.",
  { a: "mc.segel-alltid-foretrade" },
);

sc(
  "forar.f8.segel-motor",
  "safety_critical",
  "En segelbåt under segel hinner upp en motorbåt. Vem väjer?",
  [
    ["a", "Segelbåten — upphinnande väjer alltid"],
    ["b", "Motorbåten — motor väjer alltid för segel"],
    ["c", "Båda"],
    ["d", "Ingen"],
  ],
  "a",
  "Upphinnanderegeln går före segel/motor-regeln: den som hinner upp väjer.",
  { b: "mc.segel-alltid-foretrade" },
);

sc(
  "forar.f8.segel-motor",
  "safety_critical",
  "Varför kan en liten fritidsbåt inte kräva väjning av ett stort handelsfartyg inne i en trång farled?",
  [
    ["a", "Stora fartyg har alltid företräde överallt"],
    [
      "b",
      "Fartyg som bara kan framföras säkert i farleden ska inte hindras av småbåtar",
    ],
    ["c", "Handelsfartyg ser inte småbåtar"],
    ["d", "Det stämmer inte — fritidsbåten har rätt till väjning"],
  ],
  "b",
  "Småbåtar får inte försvåra passagen för fartyg som är hänvisade till farleden. Håll undan och visa tydligt vad du gör.",
  { d: "mc.segel-alltid-foretrade" },
);

// F9 — säkerhet (4)
ms(
  "forar.f9.sakerhet-ombord",
  "safety_critical",
  "Vad bör du alltid göra före avgång? Välj alla som stämmer.",
  [
    ["a", "Kontrollera väderprognosen"],
    ["b", "Se till att alla ombord har flytväst"],
    ["c", "Meddela någon i land färdplan och beräknad återkomst"],
    ["d", "Stänga av VHF:n för att spara batteri"],
  ],
  ["a", "b", "c"],
  "Väder, flytvästar och en enkel färdplan till någon i land är grunden. Kommunikationsutrustning ska vara PÅ, inte av.",
  {},
);

sc(
  "forar.f9.sakerhet-ombord",
  "safety_critical",
  "Varför ska flytvästen vara PÅ — inte stuvad i ett fack?",
  [
    ["a", "Den tar mindre plats så"],
    [
      "b",
      "Vid en plötslig fallolycka finns ingen tid att ta fram och ta på den",
    ],
    ["c", "Det är bara ett modeval"],
    ["d", "Den håller värmen bättre i facket"],
  ],
  "b",
  "De flesta drunkningsolyckor sker plötsligt. En väst du inte bär hjälper dig inte i vattnet.",
  {},
);

sc(
  "forar.f9.sakerhet-ombord",
  "safety_critical",
  "Vad är den största omedelbara risken när en person hamnar i kallt vatten?",
  [
    ["a", "Hajar"],
    ["b", "Köldchock med okontrollerad andning de första minuterna"],
    ["c", "Solbränna"],
    ["d", "Att kläderna krymper"],
  ],
  "b",
  "Köldchocken de första minuterna ger flämtande andning och panik — flytväst håller huvudet över ytan tills andningen lugnat sig.",
  {},
);

ord(
  "forar.f9.sakerhet-ombord",
  "safety_critical",
  "Ordna åtgärderna i rimlig ordning inför en dagstur.",
  [
    ["a", "Kontrollera väderprognos"],
    ["b", "Gå igenom säkerhetsutrustningen"],
    ["c", "Meddela färdplan till någon i land"],
    ["d", "Lägga ut från bryggan"],
  ],
  ["a", "b", "c", "d"],
  "Väder först (avgör om turen blir av), sedan utrustning, sedan färdplan — sist avgång.",
);

// F9 — nödsignaler (4)
ms(
  "forar.f9.nodsignaler",
  "safety_critical",
  "Vilka är vedertagna nödsignaler? Välj alla som stämmer.",
  [
    ["a", "Röd fallskärmsraket"],
    ["b", "Orange rök"],
    ["c", "MAYDAY på VHF kanal 16"],
    ["d", "Grönt handbloss"],
  ],
  ["a", "b", "c"],
  "Röda raketer/bloss, orange rök och MAYDAY på kanal 16 är nödsignaler. Gröna ljus används inte som nödsignal.",
  {},
);

sc(
  "forar.f9.nodsignaler",
  "safety_critical",
  "På vilken VHF-kanal sänds nödanropet MAYDAY?",
  [
    ["a", "Kanal 16"],
    ["b", "Kanal 9"],
    ["c", "Kanal 72"],
    ["d", "Valfri kanal"],
  ],
  "a",
  "Kanal 16 är nöd-, il- och anropskanalen. MAYDAY sänds där.",
  {},
);

sc(
  "forar.f9.nodsignaler",
  "safety_critical",
  "Vilken armsignal är en vedertagen nödsignal?",
  [
    ["a", "Vinka snabbt med en arm"],
    [
      "b",
      "Långsamma upprepade höjningar och sänkningar av båda utsträckta armarna",
    ],
    ["c", "Peka mot land"],
    ["d", "Knäppta händer över huvudet"],
  ],
  "b",
  "Långsamma upprepade höjningar/sänkningar av utsträckta armar åt sidorna är en internationell nödsignal.",
  {},
);

sc(
  "forar.f9.nodsignaler",
  "safety_critical",
  "Du råkar avfyra en nödraket av misstag. Vad gör du?",
  [
    ["a", "Inget — det ordnar sig"],
    ["b", "Kontaktar omedelbart sjöräddningen och återkallar larmet"],
    ["c", "Skjuter en till för att 'ta ut' den första"],
    ["d", "Lämnar platsen snabbt"],
  ],
  "b",
  "Ett falsklarm ska genast återkallas till sjöräddningen så att ingen riskerar liv i onödan — att låta bli kan vara straffbart.",
  {},
);

// --- emit SQL ----------------------------------------------------------------

emit(`-- GENERATED by pipeline/content/seed-content.mjs — do not edit by hand.
-- Sample Phase 1 content: DRAFT quality, status='review' pending human
-- domain review (SPEC §39.3). Source document is a PLACEHOLDER (HUMAN_VERIFY #8).
`);

emit(
  `insert into public.certifications (id, name_sv, short_name_sv, description_sv, active, practical_component) values`,
);
emit(
  CERTIFICATIONS.map(
    ([id, n, s, d, a, p]) =>
      `  (${sq(id)}, ${sq(n)}, ${sq(s)}, ${sq(d)}, ${a}, ${p})`,
  ).join(",\n") + "\n  on conflict (id) do nothing;",
);

emit(`
insert into public.source_documents
  (id, source_key, title, issuer, canonical_url, retrieved_at, last_checked_at,
   copyright_notes, status, metadata)
values
  (${sq(SOURCE_ID)}, 'nfb-forar-kunskapsfordringar-PLACEHOLDER',
   'NFB kunskapsfordringar Förarintyg (PLATSHÅLLARE — ej verifierad)',
   'NFB', 'https://www.batlivsutbildning.se/', now(), now(),
   'PLATSHÅLLARE: riktigt källdokument måste registreras och verifieras (HUMAN_VERIFY #8).',
   'active', '{"placeholder": true}'::jsonb)
  on conflict (source_key) do nothing;

insert into public.syllabus_versions
  (id, certification_id, source_document_id, name, status, change_summary)
values
  (${sq(SYLLABUS_ID)}, 'forarintyg', ${sq(SOURCE_ID)},
   'Förarintyg — arbetsutkast 2026', 'draft',
   'Initial taxonomi i väntan på verifierade kunskapsfordringar.')
  on conflict (id) do nothing;
`);

emit(`insert into public.objectives
  (id, syllabus_version_id, section_key, order_index, title_sv, outcome_sv,
   objective_type, criticality, status) values`);
emit(
  OBJECTIVES.map(
    ([id, sec, ord2, title, outcome, type, crit]) =>
      `  (${sq(id)}, ${sq(SYLLABUS_ID)}, ${sq(sec)}, ${ord2}, ${sq(title)}, ${sq(outcome)}, ${sq(type)}, ${sq(crit)}, 'review')`,
  ).join(",\n") + "\n  on conflict (id) do nothing;",
);

emit(`
insert into public.objective_sources (objective_id, source_document_id, locator) values`);
emit(
  OBJECTIVES.map(
    ([id, sec]) =>
      `  (${sq(id)}, ${sq(SOURCE_ID)}, ${sq("avsnitt " + sec + " (platshållare)")})`,
  ).join(",\n") + "\n  on conflict do nothing;",
);

emit(`
insert into public.objective_prerequisites (objective_id, prerequisite_objective_id, strength) values`);
emit(
  OBJECTIVE_PREREQS.map(([a, b, s]) => `  (${sq(a)}, ${sq(b)}, ${sq(s)})`).join(
    ",\n",
  ) + "\n  on conflict do nothing;",
);

emit(`
insert into public.misconceptions (id, certification_id, title_sv, explanation_sv, severity) values`);
emit(
  MISCONCEPTIONS.map(
    ([id, title, expl, sev]) =>
      `  (${sq(id)}, 'forarintyg', ${sq(title)}, ${sq(expl)}, ${sq(sev)})`,
  ).join(",\n") + "\n  on conflict (id) do nothing;",
);

// lessons
LESSONS.forEach((lesson, i) => {
  const lessonId = `50000000-0000-0000-0000-0000000000${String(i + 1).padStart(2, "0")}`;
  const versionId = `51000000-0000-0000-0000-0000000000${String(i + 1).padStart(2, "0")}`;
  emit(`
insert into public.lessons (id, certification_id, slug, status)
values (${sq(lessonId)}, 'forarintyg', ${sq(lesson.slug)}, 'review')
on conflict (certification_id, slug) do nothing;

insert into public.lesson_versions
  (id, lesson_id, version, title_sv, lead_sv, estimated_minutes, content_blocks, status)
values
  (${sq(versionId)}, ${sq(lessonId)}, 1, ${sq(lesson.title)}, ${sq(lesson.lead)},
   ${lesson.minutes}, ${js(lesson.blocks)}, 'review')
on conflict (lesson_id, version) do nothing;

update public.lessons set current_version_id = ${sq(versionId)} where id = ${sq(lessonId)};

insert into public.lesson_sources (lesson_version_id, source_document_id, locator)
values (${sq(versionId)}, ${sq(SOURCE_ID)}, 'platshållare')
on conflict do nothing;
`);
  emit(
    `insert into public.lesson_objectives (lesson_version_id, objective_id, role) values`,
  );
  emit(
    lesson.objectives
      .map(([obj, role]) => `  (${sq(versionId)}, ${sq(obj)}, ${sq(role)})`)
      .join(",\n") + "\n  on conflict do nothing;",
  );
});

// items
ITEMS.forEach((item) => {
  const templateId = `60000000-0000-0000-0000-0000000000${String(item.n).padStart(2, "0")}`;
  const versionId = `61000000-0000-0000-0000-0000000000${String(item.n).padStart(2, "0")}`;
  emit(`
insert into public.item_templates (id, stable_key, certification_id, item_kind, status)
values (${sq(templateId)}, ${sq(item.key)}, 'forarintyg', ${sq(item.kind)}, 'review')
on conflict (stable_key) do nothing;

insert into public.item_versions
  (id, template_id, version, syllabus_version_id, stem_sv, interaction, answer_key,
   grading_policy, explanation_sv, criticality, status, generation_provenance)
values
  (${sq(versionId)}, ${sq(templateId)}, 1, ${sq(SYLLABUS_ID)}, ${sq(item.stem)},
   ${js(item.interaction)}, ${js(item.answerKey)}, ${js(item.gradingPolicy)},
   ${sq(item.explanation)}, ${sq(item.criticality)}, 'review',
   '{"method":"ai_draft","model":"claude","needs_domain_review":true}'::jsonb)
on conflict (template_id, version) do nothing;

update public.item_templates set current_version_id = ${sq(versionId)} where id = ${sq(templateId)};

insert into public.item_objectives (item_version_id, objective_id, role)
values (${sq(versionId)}, ${sq(item.objectiveId)}, 'primary')
on conflict do nothing;

insert into public.item_sources (item_version_id, source_document_id, locator)
values (${sq(versionId)}, ${sq(SOURCE_ID)}, 'platshållare')
on conflict do nothing;`);

  const mcEntries = Object.entries(item.misconceptions).filter(
    ([, v]) => typeof v === "string",
  );
  if (mcEntries.length > 0) {
    emit(
      `insert into public.item_misconceptions (item_version_id, answer_key, misconception_id) values`,
    );
    emit(
      mcEntries
        .map(
          ([optKey, mcId]) =>
            `  (${sq(versionId)}, ${sq(optKey)}, ${sq(mcId)})`,
        )
        .join(",\n") + "\n  on conflict do nothing;",
    );
  }
});

// free pool (draft until items are live)
emit(`
insert into public.public_item_pools (id, pool_key, status)
values ('70000000-0000-0000-0000-000000000001', 'gratis-diagnos-forar-v1', 'draft')
on conflict (pool_key) do nothing;
`);

// --- write file ---------------------------------------------------------------

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const target = join(root, "supabase", "seed_content.sql");
writeFileSync(target, out.join("\n") + "\n");
console.log(
  `wrote ${target}: ${ITEMS.length} items, ${OBJECTIVES.length} objectives, ${LESSONS.length} lessons`,
);
