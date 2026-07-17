import type { DemoItem } from "../../demo";

/**
 * Kustskeppar — navigation & passageplanering (SPEC §30 K2–K4). Draft
 * quality, sources marked unverified.
 */

const SOURCE = "Lektion: Kustskeppar — navigation (utkast, ej källgranskad)";

export const NAVIGATION_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "numeric",
    stemSv:
      "Rättvisande kurs är 210°. Missvisningen är −4° och deviationen −2°. Vilken kompasskurs ska du styra?",
    interaction: { kind: "numeric", unit: "grader" },
    answerKey: { value: 216, tolerance: 0 },
    explanation:
      "Baklänges genom kedjan: rättvisande − missvisning = magnetisk (210 − (−4) = 214); magnetisk − deviation = kompasskurs (214 − (−2) = 216).",
    method:
      "1. Km(magnetisk) = Krv − missvisning = 210° − (−4°) = 214°.\n2. Kk = Kmagnetisk − deviation = 214° − (−2°) = 216°.",
    sourceRef: SOURCE,
    objectiveTitle: "Kursomvandling",
  },
  {
    index: 1,
    kind: "numeric",
    stemSv:
      "En etapp är 27 M och du planerar 6 knops fart. Du vill vara framme kl. 17:30. När senast bör du avgå (svara i hela minuter efter kl. 12:00 — t.ex. 60 för kl. 13:00)?",
    interaction: { kind: "numeric", unit: "minuter efter 12:00" },
    answerKey: { value: 60, tolerance: 0 },
    explanation:
      "Gångtid = 27 / 6 = 4,5 h = 4 h 30 min. 17:30 − 4:30 = 13:00, dvs. 60 minuter efter 12:00.",
    method:
      "1. Tid = distans / fart = 27 / 6 = 4,5 h.\n2. Avgång = 17:30 − 4 h 30 min = 13:00.",
    sourceRef: SOURCE,
    objectiveTitle: "Distans, fart och tid",
  },
  {
    index: 2,
    kind: "single_choice",
    stemSv: "Vad är en enslinje och varför är den värdefull vid kustnavigering?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Två fasta objekt i linje — en exakt ledningslinje som inte kräver instrument",
        },
        { key: "b", text_sv: "En linje mellan två waypoints i plottern" },
        { key: "c", text_sv: "Gränsen mellan två sjökortsblad" },
        { key: "d", text_sv: "En kurslinje som alltid pekar mot nord" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "När två kända, fasta objekt står i linje ligger du exakt på deras förlängning — ett instrumentfritt och mycket noggrant positionsbesked.",
    sourceRef: SOURCE,
    objectiveTitle: "Position och ledningslinjer",
  },
  {
    index: 3,
    kind: "ordering",
    stemSv:
      "Ordna momenten när du tar en krysspejling för att bestämma din position.",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "Välj två–tre identifierbara objekt med god vinkelspridning" },
        { key: "b", text_sv: "Pejla objekten snabbt efter varandra och notera tiderna" },
        { key: "c", text_sv: "Rätta pejlingarna till rättvisande bäring" },
        { key: "d", text_sv: "Rita bäringslinjerna i kortet och läs av skärningen" },
      ],
    },
    answerKey: { order: ["a", "b", "c", "d"] },
    explanation:
      "Objektval (spridning ≈ 60–120°) → snabba pejlingar → rättning → plottning. Skärningstriangelns storlek antyder osäkerheten.",
    sourceRef: SOURCE,
    objectiveTitle: "Krysspejling",
  },
  {
    index: 4,
    kind: "single_choice",
    stemSv:
      "Vid passageplanering över öppet vatten planerar du 'alternativhamnar'. Vad är huvudsyftet?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Att alltid ha en förberedd väg ut om väder, teknik eller besättning kräver det",
        },
        { key: "b", text_sv: "Att kunna handla proviant billigare" },
        { key: "c", text_sv: "Att undvika att betala hamnavgift i målhamnen" },
        { key: "d", text_sv: "De krävs bara för yrkessjöfart" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "En bra plan har redan svaret på ”vad gör vi om…?” — alternativhamnar med kända angöringar gör beslutet enkelt när det behövs.",
    sourceRef: SOURCE,
    objectiveTitle: "Passageplanering",
  },
  {
    index: 5,
    kind: "matching",
    stemSv: "Para ihop kortbegreppet med dess innebörd.",
    interaction: {
      kind: "matching",
      left: [
        { key: "l1", text_sv: "Kabellängd" },
        { key: "l2", text_sv: "Distansminut (M)" },
        { key: "l3", text_sv: "Latitudskalan" },
      ],
      right: [
        { key: "r1", text_sv: "En tiondels distansminut, ca 185 m" },
        { key: "r2", text_sv: "1 852 m — en breddminut" },
        { key: "r3", text_sv: "Kortets distansskala — aldrig longitudskalan" },
      ],
    },
    answerKey: { pairs: { l1: "r1", l2: "r2", l3: "r3" } },
    explanation:
      "Distans mäts alltid på latitudskalan vid aktuell bredd; longitudminuter krymper mot polerna.",
    sourceRef: SOURCE,
    objectiveTitle: "Kortets skala och enheter",
  },
  {
    index: 6,
    kind: "numeric",
    stemSv:
      "Du loggar 6,0 knop genom vattnet på kurs 090°. En ström sätter rakt med dig (medström) med 1,5 knop. Vilken blir din fart över grund i knop?",
    interaction: { kind: "numeric", unit: "knop" },
    answerKey: { value: 7.5, tolerance: 0.01 },
    explanation:
      "Med rak medström adderas farterna: 6,0 + 1,5 = 7,5 knop över grund. Mot- eller tvärström kräver vektorräkning.",
    method: "1. FÖG = fart genom vattnet + medström = 6,0 + 1,5 = 7,5 knop.",
    sourceRef: SOURCE,
    objectiveTitle: "Ström och fart över grund",
  },
  {
    index: 7,
    kind: "multiple_select",
    stemSv:
      "Vilka hör hemma i en skriftlig färdplan som lämnas till någon i land? Välj alla som stämmer.",
    interaction: {
      kind: "multiple_select",
      options: [
        { key: "a", text_sv: "Planerad rutt och beräknad ankomsttid" },
        { key: "b", text_sv: "Antal personer ombord" },
        { key: "c", text_sv: "Vad kontakten ska göra om ni inte hört av er" },
        { key: "d", text_sv: "Besättningens personnummer" },
      ],
    },
    answerKey: { correct: ["a", "b", "c"] },
    explanation:
      "Rutt, ETA, antal ombord och en tydlig larminstruktion är kärnan. Känsliga personuppgifter hör inte hemma i färdplanen.",
    sourceRef: SOURCE,
    objectiveTitle: "Färdplan",
  },
];
