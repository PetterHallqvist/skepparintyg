import type { DemoItem } from "../../demo";

/**
 * Seglarintyg 3 — natt/offshorerutiner, avancerad MOB, underhåll och
 * felscenarier (SPEC §33.3). Draft quality, sources marked unverified.
 */

const SOURCE = "Lektion: Seglar 3 — natt & fel (utkast, ej källgranskad)";

export const NATT_UNDERHALL_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "multiple_select",
    stemSv: "Vad gäller på däck nattetid offshore? Välj alla som stämmer.",
    interaction: {
      kind: "multiple_select",
      options: [
        { key: "a", text_sv: "Livsele påkopplad — även i sittbrunnen" },
        { key: "b", text_sv: "Ingen lämnar sittbrunnen utan att vakthavande vet det" },
        { key: "c", text_sv: "Arbete på fördäck görs i par eller med extra säkring" },
        { key: "d", text_sv: "Selen behövs bara när det blåser" },
      ],
    },
    answerKey: { correct: ["a", "b", "c"] },
    explanation:
      "En nattlig MOB offshore är nära nog ett dödsfall — därför är regeln absolut: sele på, säg till, jobba aldrig ensam på fördäck.",
    sourceRef: SOURCE,
    objectiveTitle: "Nattdisciplin",
    misconceptionByKey: {
      d: "Lugna nätter invaggar — de flesta fall sker i odramatiskt väder.",
    },
  },
  {
    index: 1,
    kind: "single_choice",
    stemSv:
      "Person i vattnet nattetid med AIS-MOB-sändare på västen. Hur ändras sökbilden?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Sändaren ger position på plottern — du navigerar tillbaka på den i stället för på gissning",
        },
        { key: "b", text_sv: "Ingen skillnad mot utan sändare" },
        { key: "c", text_sv: "Sändaren lyfter personen ur vattnet" },
        { key: "d", text_sv: "Sökningen kan avbrytas — sändaren larmar land" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "AIS-MOB ger en levande position i mörkret — men manövern, upptagningen och larmet på VHF är fortfarande besättningens jobb.",
    sourceRef: SOURCE,
    objectiveTitle: "Avancerad MOB — teknik",
  },
  {
    index: 2,
    kind: "ordering",
    stemSv:
      "MOB offshore i sjögång (motorstöd tillgängligt). Ordna huvudmomenten.",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "Larm, flytredskap/ljus i vattnet, pekare, MOB-knapp" },
        { key: "b", text_sv: "Segel ner/motor igång — förbered upptagningssida och lyftmedel" },
        { key: "c", text_sv: "Angör i lä om personen, propeller stoppad vid kontakt" },
        { key: "d", text_sv: "Ta ombord med lyfthjälp (block/fall) — en nedkyld person kan inte klättra" },
      ],
    },
    answerKey: { order: ["a", "b", "c", "d"] },
    explanation:
      "Offshore-MOB:ens svåraste del är ofta LYFTET: förbered fall/talja tidigt — en utmattad person i sjöställ väger dubbelt.",
    sourceRef: SOURCE,
    objectiveTitle: "Avancerad MOB — upptagning",
  },
  {
    index: 3,
    kind: "single_choice",
    stemSv: "Rodret slutar svara mitt i natten. Första kontrollpunkt?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Styrningens mekanik (vajer/länk/autopilotkoppling) — och nödrorkulten fram",
        },
        { key: "b", text_sv: "Byt batteri i plottern" },
        { key: "c", text_sv: "Hissa mer segel" },
        { key: "d", text_sv: "Inget kan göras — invänta bogsering" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Oftast är det länken mellan ratt och hjärtstock — inte roderbladet. Nödrorkulten ger styrning medan felet söks; segeltrim kan grovstyra.",
    sourceRef: SOURCE,
    objectiveTitle: "Roderhaveri",
  },
  {
    index: 4,
    kind: "single_choice",
    stemSv: "Ett vant släpper i frisk vind. Omedelbar åtgärd för att rädda masten?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Gira direkt så det HELA vantparet på andra sidan tar lasten (skadade sidan i lä), avlasta segel",
        },
        { key: "b", text_sv: "Skota hem hårdare" },
        { key: "c", text_sv: "Fortsätt kurs — vant är dubblerade" },
        { key: "d", text_sv: "Släpp alla fall" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Lägg det trasiga vantet i lä (utan last) inom sekunder, ta ner segel och stötta provisoriskt med fall — därefter varsamt mot hamn.",
    sourceRef: SOURCE,
    objectiveTitle: "Riggskada",
  },
  {
    index: 5,
    kind: "single_choice",
    stemSv: "Vatten stiger i kölsvinet under gång. Ordningen på dina tankar?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Var kommer det in? — begränsa (kran/plugg/tätning), pumpa, larma tidigt om osäkert",
        },
        { key: "b", text_sv: "Pumpa först i en timme innan du letar" },
        { key: "c", text_sv: "Hoppa i livflotten direkt" },
        { key: "d", text_sv: "Stäng av länspumpen för att spara ström" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Sök källan (bottenkranar, axelgenomföring, slangar) medan pumpen köper tid. Ett tidigt PAN-PAN är gratis; ett sent MAYDAY är dyrt.",
    sourceRef: SOURCE,
    objectiveTitle: "Läckage",
  },
  {
    index: 6,
    kind: "single_choice",
    stemSv: "Varför öva nödstyrning och segel-utan-roder FÖRE en lång överfart?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "I ett verkligt haveri finns ingen tid att läsa manual — övade rutiner halverar dramatiken",
        },
        { key: "b", text_sv: "Det är ett formellt krav för fritidsbåtar" },
        { key: "c", text_sv: "Det behövs inte med autopilot" },
        { key: "d", text_sv: "Bara kappseglare behöver det" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Trim-styrning (stor = lova, fock = falla) och nödrorkult ska sitta i händerna. En timmes övning i lugnt väder är billig försäkring.",
    sourceRef: SOURCE,
    objectiveTitle: "Övade felscenarier",
  },
  {
    index: 7,
    kind: "matching",
    stemSv: "Para ihop nattrutinen med dess syfte.",
    interaction: {
      kind: "matching",
      left: [
        { key: "l1", text_sv: "Röd belysning nere" },
        { key: "l2", text_sv: "Timvis positionsnotering" },
        { key: "l3", text_sv: "Riggkontroll i gryningen" },
      ],
      right: [
        { key: "r1", text_sv: "Bevarar vaktens mörkerseende" },
        { key: "r2", text_sv: "Backup om elektroniken faller ur" },
        { key: "r3", text_sv: "Fångar nattens skav och sprickor tidigt" },
      ],
    },
    answerKey: { pairs: { l1: "r1", l2: "r2", l3: "r3" } },
    explanation:
      "Små rutiner bär offshore-säkerheten: syn, spårbarhet och daglig teknisk översyn.",
    sourceRef: SOURCE,
    objectiveTitle: "Offshorerutiner",
  },
];
