import type { DemoItem } from "../../demo";

/**
 * Båtpraktik dag — manövrering: roder/propeller, MOB-manöver, förtöjning
 * (SPEC §29.1 områden 12–14). Draft quality, sources marked unverified.
 */

const SOURCE = "Lektion: Båtpraktik — manövrering (utkast, ej källgranskad)";

export const MANOVRERING_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "single_choice",
    stemSv:
      "Vid låg fart framåt ger du ett kort kraftigt gaspådrag med rodret lagt. Varför fungerar det?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Propellerströmmen träffar rodret och ger styrverkan nästan utan att båten ökar farten",
        },
        { key: "b", text_sv: "Motorljudet skrämmer bort andra båtar" },
        { key: "c", text_sv: "Det fungerar inte — styrverkan kräver hög fart" },
        { key: "d", text_sv: "Bränslet blir varmare" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Ett ”roderkick”: propellerströmmen över roderbladet vrider aktern direkt. Grunden för all trång manövrering med rak axel/drev.",
    sourceRef: SOURCE,
    objectiveTitle: "Roder- och propellereffekt",
  },
  {
    index: 1,
    kind: "single_choice",
    stemSv: "Varför tar man normalt en tilläggning MOT vind eller ström?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Mot-kraften bromsar båten och ger styrfart längre — mer kontroll på lägre fart",
        },
        { key: "b", text_sv: "Det ser bättre ut" },
        { key: "c", text_sv: "Medvind är alltid förbjudet vid kaj" },
        { key: "d", text_sv: "Motorn kyls bättre mot vinden" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Mot vind/ström kan du hålla styrfart in i det sista och stanna på platsen. Med kraften i ryggen kommer du in för fort med sämre kontroll.",
    sourceRef: SOURCE,
    objectiveTitle: "Tilläggning",
  },
  {
    index: 2,
    kind: "ordering",
    stemSv: "Ordna momenten i en tilläggning vid kaj med lätt sidvind FRÅN kajen.",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "Förbered fendrar och förtöjningar, fördela roller" },
        { key: "b", text_sv: "Angör i brantare vinkel än normalt, mot förtöjningsplatsen" },
        { key: "c", text_sv: "Sätt förspringet först när fören är vid kaj" },
        { key: "d", text_sv: "Arbeta in aktern med roder och maskin mot springet" },
      ],
    },
    answerKey: { order: ["a", "b", "c", "d"] },
    explanation:
      "Frånlandsvind blåser av dig — brantare anflygning och ett tidigt förspring ger dig något att arbeta mot när aktern ska in.",
    sourceRef: SOURCE,
    objectiveTitle: "Tilläggning med spring",
  },
  {
    index: 3,
    kind: "single_choice",
    stemSv:
      "Vid avgång med sidvind MOT kajen — vilken metod är standard?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Back mot förspring med fender i fören så aktern arbetar ut — sedan back ut",
        },
        { key: "b", text_sv: "Full fart framåt längs kajen" },
        { key: "c", text_sv: "Skjut ut båten för hand och hoppa i" },
        { key: "d", text_sv: "Vänta tills vinden vänder" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Pålandsvind trycker dig mot kajen. Motorkraft mot ett förspring vippar ut aktern (skydda fören med fender) — sedan backar du fritt ut.",
    sourceRef: SOURCE,
    objectiveTitle: "Avgång med spring",
  },
  {
    index: 4,
    kind: "ordering",
    stemSv:
      "Ordna en enkel MOB-återgång för motorbåt (t.ex. Williamson-liknande i övningsform).",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "Larma, kasta flytredskap, utse pekare, tryck MOB" },
        { key: "b", text_sv: "Gira undan aktern från personen och sväng runt" },
        { key: "c", text_sv: "Närma dig mot vind/sjö i låg fart" },
        { key: "d", text_sv: "Stoppa propellern helt vid upptagning i lä" },
      ],
    },
    answerKey: { order: ["a", "b", "c", "d"] },
    explanation:
      "Första giren skyddar personen från propellern; återkomsten sker långsamt mot vinden och propellern står still vid sidan av personen.",
    sourceRef: SOURCE,
    objectiveTitle: "MOB-manöver",
  },
  {
    index: 5,
    kind: "single_choice",
    stemSv: "Varför tas en person upp i LÄ (skyddade sidan) vid man över bord?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Båten driver mot personen i stället för ifrån, och sidan är skyddad från sjön",
        },
        { key: "b", text_sv: "Det är närmare badstegen" },
        { key: "c", text_sv: "Solen bländar mindre" },
        { key: "d", text_sv: "Det spelar ingen roll vilken sida" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "I lä driver båten ner mot personen och vågorna bryts av skrovet — i lovart driver båten ifrån och sjön slår personen mot skrovet.",
    sourceRef: SOURCE,
    objectiveTitle: "MOB-upptagning",
  },
  {
    index: 6,
    kind: "matching",
    stemSv: "Para ihop förtöjningslinan med dess uppgift vid kaj.",
    interaction: {
      kind: "matching",
      left: [
        { key: "l1", text_sv: "Förtamp" },
        { key: "l2", text_sv: "Akterspring" },
        { key: "l3", text_sv: "Aktertamp" },
      ],
      right: [
        { key: "r1", text_sv: "Håller fören mot kajen" },
        { key: "r2", text_sv: "Hindrar båten att glida akteröver" },
        { key: "r3", text_sv: "Håller aktern mot kajen" },
      ],
    },
    answerKey: { pairs: { l1: "r1", l2: "r2", l3: "r3" } },
    explanation:
      "Tamparna håller båten mot kajen; springen stoppar rörelsen längs den. Fyra linor ger en trygg förtöjning i skiftande vind.",
    sourceRef: SOURCE,
    objectiveTitle: "Förtöjningens delar",
  },
  {
    index: 7,
    kind: "single_choice",
    stemSv:
      "Ni är två ombord vid tilläggning. Vad kännetecknar bra rollkommunikation?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Rollerna och ordningen bestäms FÖRE manövern, med tydliga korta besked under den",
        },
        { key: "b", text_sv: "Den vid rodret ropar instruktioner i sista sekunden" },
        { key: "c", text_sv: "Gasten hoppar i land så tidigt som möjligt" },
        { key: "d", text_sv: "Man improviserar — varje kaj är unik" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Briefa före: vilken lina först, vem gör vad, vad är reservplanen. Ingen hoppar — kliv i land när avståndet är säkert.",
    sourceRef: SOURCE,
    objectiveTitle: "Roller och kommunikation",
    misconceptionByKey: {
      c: "Hopp från båt är en klassisk skadeorsak — vänta in kajen.",
    },
  },
];
