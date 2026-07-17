import type { DemoItem } from "../../demo";

/**
 * Seglarintyg 2 — manövrering i trånga vatten, tilläggning och ankring
 * (SPEC §33.2). Draft quality, sources marked unverified.
 */

const SOURCE = "Lektion: Seglar 2 — hamn & ankring (utkast, ej källgranskad)";

export const MANOVRERING_HAMN_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "single_choice",
    stemSv:
      "En segelbåt med foldingpropeller backar sämre än den går fram. Hur planerar du hamnmanövern?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Räkna med svag och sen backverkan — lägg manövern så att framåt-styrfart löser det mesta",
        },
        { key: "b", text_sv: "Backa alltid i hög fart så propellern 'tar'" },
        { key: "c", text_sv: "Undvik att backa någonsin" },
        { key: "d", text_sv: "Foldingpropellrar backar bättre än fasta" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Kända begränsningar planeras bort: ge backen tid att veckla ut bladen, och bygg manövern på det båten gör bra.",
    sourceRef: SOURCE,
    objectiveTitle: "Båtens backegenskaper",
  },
  {
    index: 1,
    kind: "single_choice",
    stemSv: "Hur utnyttjar du propellerns vridningseffekt (propeller walk) vid tilläggning med backslag?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Välj den sida där back-vridningen DRAR aktern IN mot bryggan",
        },
        { key: "b", text_sv: "Den ska alltid motverkas med hög fart" },
        { key: "c", text_sv: "Den finns bara på motorbåtar" },
        { key: "d", text_sv: "Den påverkar bara i medvind" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Vet du åt vilket håll aktern går i back kan du välja tilläggningssida så effekten jobbar FÖR dig i sista metern.",
    sourceRef: SOURCE,
    objectiveTitle: "Propellereffekt i hamn",
  },
  {
    index: 2,
    kind: "ordering",
    stemSv: "Ordna momenten vid tilläggning i Y-bom/boj-plats med sidvind.",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "Rigga fendrar och förbered tampar i båda ändar" },
        { key: "b", text_sv: "Briefa vem som tar bom/boj och vem som tar bryggan" },
        { key: "c", text_sv: "Angör långsamt mot vinden där det går" },
        { key: "d", text_sv: "Säkra lovartssidan först — vinden trycker dig åt lä" },
      ],
    },
    answerKey: { order: ["a", "b", "c", "d"] },
    explanation:
      "Förberedelse, roller, kontrollerad fart — och alltid lovartslinan först: den håller dig kvar medan resten görs i lugn takt.",
    sourceRef: SOURCE,
    objectiveTitle: "Tilläggning i sidvind",
  },
  {
    index: 3,
    kind: "single_choice",
    stemSv: "Hur mycket lina/kätting ger du vid ankring i normala förhållanden?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Minst 3–5 gånger vattendjupet" },
        { key: "b", text_sv: "Exakt lika mycket som djupet" },
        { key: "c", text_sv: "Så lite som möjligt så du svajar mindre" },
        { key: "d", text_sv: "Alltid hela ankarlådan" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Längden gör draget horisontellt så ankaret gräver ner sig. För kort lina lyfter ankarskaften — draggning i första byn.",
    sourceRef: SOURCE,
    objectiveTitle: "Ankringslängd",
    misconceptionByKey: {
      b: "1:1 ger nästan vertikalt drag — ankaret får aldrig fäste.",
    },
  },
  {
    index: 4,
    kind: "single_choice",
    stemSv: "Hur kontrollerar du att ankaret verkligen håller?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Sätt det med back, ta land-/transitmärken eller ankarlarm och kontrollera en stund",
        },
        { key: "b", text_sv: "Om det känns bra håller det" },
        { key: "c", text_sv: "Ankare håller alltid i sand" },
        { key: "d", text_sv: "Genom att dra åt handbromsen" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Back sätter ankaret; märken tvärs (eller plotterns ankarlarm) avslöjar draggning. Kontrollera igen när vinden ökar eller vrider.",
    sourceRef: SOURCE,
    objectiveTitle: "Ankarkontroll",
  },
  {
    index: 5,
    kind: "single_choice",
    stemSv:
      "Ni ligger för ankar och vinden vrider under natten mot en läkust. Vad är rätt beredskap?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Omvärdera platsen — flytta i tid om svajrum eller skydd inte längre räcker",
        },
        { key: "b", text_sv: "Sova vidare — ankare släpper inte i vindvrid" },
        { key: "c", text_sv: "Korta in linan till hälften" },
        { key: "d", text_sv: "Starta motorn och låt den gå hela natten" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "En ankarplats är bara bra i sitt väder. Vrid mot land = ny riskbild: flytta hellre en gång för mycket, i lugnt skede.",
    sourceRef: SOURCE,
    objectiveTitle: "Ankarvakt och omvärdering",
  },
  {
    index: 6,
    kind: "single_choice",
    stemSv:
      "Vid förtöjning mellan boj och brygga — i vilken ordning tar du fast när vinden ligger FRÅN bryggan?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Bojen först — annars blåser du ur läge innan aktern är säkrad" },
        { key: "b", text_sv: "Bryggan först, alltid" },
        { key: "c", text_sv: "Båda samtidigt" },
        { key: "d", text_sv: "Ordningen spelar ingen roll" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Ta först den ände som vinden vill dra dig IFRÅN. Med frånlandsvind: bojen (lovart) först, sedan arbetar du dig in mot bryggan.",
    sourceRef: SOURCE,
    objectiveTitle: "Boj och brygga",
  },
  {
    index: 7,
    kind: "single_choice",
    stemSv: "Vad är fördelen med att lägga en 'slip' (dubblerad tamp) vid avgång?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Tampen kan lossas inifrån båten — ingen behöver stå kvar på bryggan",
        },
        { key: "b", text_sv: "Den håller dubbelt så hårt" },
        { key: "c", text_sv: "Den ser snyggare ut" },
        { key: "d", text_sv: "Den behövs bara vid ankring" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Dubblerad runt ringen och tillbaka: du släpper ena parten och drar hem — hela besättningen är ombord när båten lämnar kajen.",
    sourceRef: SOURCE,
    objectiveTitle: "Avgångsteknik",
  },
];
