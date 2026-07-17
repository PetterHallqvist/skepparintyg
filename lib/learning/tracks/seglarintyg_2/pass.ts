import type { DemoItem } from "../../demo";

/**
 * Seglarintyg 2 — fortsättning (SPEC §33.2). Båtsystem, precisionsmanöver,
 * ankring och prognos. Draft quality, sources marked unverified.
 */

const SOURCE = "Lektion: Seglarintyg 2 — blandat pass (utkast, ej källgranskad)";

export const PASS_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "single_choice",
    stemSv: "Vad kontrollerar du direkt efter motorstart i en modern segelbåt?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Att kylvatten strömmar ut med avgaserna" },
        { key: "b", text_sv: "Att stereon fungerar" },
        { key: "c", text_sv: "Att seglen är hissade" },
        { key: "d", text_sv: "Att ankaret är ombord" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Inget kylvatten = igensatt intag eller trasig impeller — motorn överhettar snabbt. Kontrollen tar två sekunder och görs vid varje start.",
    sourceRef: SOURCE,
    objectiveTitle: "Moderna båtsystem",
  },
  {
    index: 1,
    kind: "ordering",
    stemSv: "Ordna stegen vid ankring i rimlig ordning.",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "Välj plats med skydd, rätt djup och svajrum" },
        { key: "b", text_sv: "Gå upp mot vinden och stoppa båten" },
        { key: "c", text_sv: "Fira ut ankaret kontrollerat mot botten" },
        { key: "d", text_sv: "Ge lina/kätting 3–5 × djupet och sätt ankaret med back" },
        { key: "e", text_sv: "Ta märken eller bäringar och håll ankarvakt" },
      ],
    },
    answerKey: { order: ["a", "b", "c", "d", "e"] },
    explanation:
      "Plats → uppstoppning mot vind → kontrollerad utfirning → rätt längd och sättning → kontroll att ankaret håller.",
    sourceRef: SOURCE,
    objectiveTitle: "Tilläggning och ankring",
  },
  {
    index: 2,
    kind: "single_choice",
    stemSv:
      "Du ska vända i en trång hamnbassäng med frisk sidvind. Vad är klokast?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Planera vändningen så att fören går upp mot vinden, med korta bestämda gaspådrag",
        },
        { key: "b", text_sv: "Vänd med hög fart så att vinden inte hinner påverka" },
        { key: "c", text_sv: "Låt vinden driva båten runt utan gas" },
        { key: "d", text_sv: "Vänd alltid med aktern mot vinden" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Fören faller av snabbast — planera så vinden hjälper vändningen, och använd korta gaspådrag för styrfart utan att bygga fart.",
    sourceRef: SOURCE,
    objectiveTitle: "Manövrering i trånga vatten",
    misconceptionByKey: {
      b: "Hög fart i trång bassäng ger stora konsekvenser vid minsta fel — styrfart räcker.",
    },
  },
  {
    index: 3,
    kind: "matching",
    stemSv: "Para ihop komponenten med dess roll i båtens underhåll.",
    interaction: {
      kind: "matching",
      left: [
        { key: "l1", text_sv: "Impeller" },
        { key: "l2", text_sv: "Offeranod" },
        { key: "l3", text_sv: "Vantskruv" },
      ],
      right: [
        { key: "r1", text_sv: "Gummihjul som pumpar kylvatten" },
        { key: "r2", text_sv: "Zink/aluminium som korroderar i stället för drev och axel" },
        { key: "r3", text_sv: "Justerar vantens spänning i riggen" },
      ],
    },
    answerKey: { pairs: { l1: "r1", l2: "r2", l3: "r3" } },
    explanation:
      "Impellern byts regelbundet, anoderna kontrolleras varje säsong och vantskruvarna säkras efter riggtrim.",
    sourceRef: SOURCE,
    objectiveTitle: "Underhåll och kontroller",
  },
  {
    index: 4,
    kind: "single_choice",
    stemSv: "Du seglar och tät dimma rullar in. Vad gör du först?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Sätter lanternor, saktar till säker fart och börjar avge ljudsignal",
        },
        { key: "b", text_sv: "Ökar farten för att hinna ur dimbanken" },
        { key: "c", text_sv: "Fortsätter som förut — GPS:en visar ju vägen" },
        { key: "d", text_sv: "Ankrar omedelbart oavsett var du är" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Nedsatt sikt: säker fart, lanternor, föreskrivna ljudsignaler och skärpt utkik. Flytväst på alla är god praxis.",
    sourceRef: SOURCE,
    objectiveTitle: "Dimma och lokalväder",
    misconceptionByKey: {
      c: "GPS:en ser inte andra båtar — sikt och ljud är fortfarande dina verktyg.",
    },
  },
  {
    index: 5,
    kind: "multiple_select",
    stemSv:
      "Vilka rutiner hör till gott sjömanskap på en längre segling? Välj alla som stämmer.",
    interaction: {
      kind: "multiple_select",
      options: [
        { key: "a", text_sv: "Regelbunden, aktiv utkik" },
        { key: "b", text_sv: "Positionsnotering i loggbok med jämna mellanrum" },
        { key: "c", text_sv: "Alltid full segelföring för bästa fart" },
        { key: "d", text_sv: "Väderuppdatering på fasta tider" },
      ],
    },
    answerKey: { correct: ["a", "b", "d"] },
    explanation:
      "Utkik, loggförd position och färska prognoser är rutinerna som håller marginalerna. Segelföringen anpassas efter förhållandena — inte tvärtom.",
    sourceRef: SOURCE,
    objectiveTitle: "Sjömanskapsrutiner",
  },
];
