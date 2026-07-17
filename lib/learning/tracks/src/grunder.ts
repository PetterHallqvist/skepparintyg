import type { DemoItem } from "../../demo";

/**
 * SRC — VHF-grunder och radions reglage (SPEC §31 R2–R3). Draft quality,
 * sources marked unverified.
 */

const SOURCE = "Lektion: SRC — VHF-grunder (utkast, ej källgranskad)";

export const GRUNDER_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "single_choice",
    stemSv: "Ungefär hur långt räcker en VHF-signal till sjöss?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Till strax bortom horisonten — antennhöjden avgör",
        },
        { key: "b", text_sv: "Alltid minst 100 sjömil" },
        { key: "c", text_sv: "Bara inom synhåll för ögat" },
        { key: "d", text_sv: "Obegränsat — signalen studsar mot jonosfären" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "VHF är i praktiken 'radiohorisont': högre antenner (din och motpartens) ger längre räckvidd — typiskt 10–30 M mellan fritidsbåt och kuststation.",
    sourceRef: SOURCE,
    objectiveTitle: "VHF-räckvidd",
    misconceptionByKey: {
      d: "VHF-vågor följer inte jonosfären som kortvåg — räckvidden är horisontbunden.",
    },
  },
  {
    index: 1,
    kind: "single_choice",
    stemSv: "Vad gör squelch-ratten på en VHF-radio?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Tystar bruset genom att sätta en tröskel för hur svaga signaler som släpps igenom",
        },
        { key: "b", text_sv: "Höjer sändareffekten" },
        { key: "c", text_sv: "Byter mellan simplex och duplex" },
        { key: "d", text_sv: "Spelar in inkommande trafik" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Squelch öppnar mottagaren först när signalen är starkare än bruströskeln. För hårt satt squelch kan dölja svaga (avlägsna) anrop.",
    sourceRef: SOURCE,
    objectiveTitle: "Radions reglage",
  },
  {
    index: 2,
    kind: "single_choice",
    stemSv: "När använder du 25 W i stället för 1 W uteffekt?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Bara när låg effekt inte räcker — t.ex. långt avstånd eller nödtrafik",
        },
        { key: "b", text_sv: "Alltid — mer effekt är alltid bättre" },
        { key: "c", text_sv: "Aldrig — 25 W är förbjudet för fritidsbåtar" },
        { key: "d", text_sv: "Bara i hamn" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Grundregeln är lägsta effekt som fungerar — det minskar störningar för andra. Hög effekt hör till långa avstånd och nödsituationer.",
    sourceRef: SOURCE,
    objectiveTitle: "Uteffekt",
    misconceptionByKey: {
      b: "Onödigt hög effekt blockerar kanalen över ett större område — dålig radiodisciplin.",
    },
  },
  {
    index: 3,
    kind: "matching",
    stemSv: "Para ihop kanalen med dess användning.",
    interaction: {
      kind: "matching",
      left: [
        { key: "l1", text_sv: "Kanal 16" },
        { key: "l2", text_sv: "Kanal 70" },
        { key: "l3", text_sv: "Kanal 13" },
      ],
      right: [
        { key: "r1", text_sv: "Nöd, il och anrop (tal)" },
        { key: "r2", text_sv: "Endast DSC — aldrig tal" },
        { key: "r3", text_sv: "Broöppning/fartyg-till-fartyg om navigation" },
      ],
    },
    answerKey: { pairs: { l1: "r1", l2: "r2", l3: "r3" } },
    explanation:
      "16 = nöd/il/anrop, 70 = digital signalering (DSC), 13 = navigationssäkerhet mellan fartyg och t.ex. broar/slussar.",
    sourceRef: SOURCE,
    objectiveTitle: "Kanalplan",
  },
  {
    index: 4,
    kind: "single_choice",
    stemSv: "Vad är dual watch (DW) på en VHF?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Radion passar kanal 16 parallellt med en vald arbetskanal",
        },
        { key: "b", text_sv: "Två personer kan tala samtidigt" },
        { key: "c", text_sv: "Radion sänder på två kanaler samtidigt" },
        { key: "d", text_sv: "En extra handenhet" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Dual watch växlar snabbt mellan kanal 16 och din arbetskanal så att du aldrig missar nöd- eller anropstrafik.",
    sourceRef: SOURCE,
    objectiveTitle: "Radions reglage",
  },
  {
    index: 5,
    kind: "single_choice",
    stemSv: "Vad är MMSI?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Ett niosiffrigt nummer som identifierar din station i DSC-systemet",
        },
        { key: "b", text_sv: "Radions serienummer från fabriken" },
        { key: "c", text_sv: "En krypteringsnyckel för samtal" },
        { key: "d", text_sv: "Ett lösenord till kustradion" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "MMSI (Maritime Mobile Service Identity) programmeras i radion och följer med varje DSC-anrop — den knyter larmet till din båt och dina kontaktuppgifter.",
    sourceRef: SOURCE,
    objectiveTitle: "DSC och MMSI",
  },
  {
    index: 6,
    kind: "multiple_select",
    stemSv:
      "Vilka faktorer förbättrar din VHF-räckvidd i praktiken? Välj alla som stämmer.",
    interaction: {
      kind: "multiple_select",
      options: [
        { key: "a", text_sv: "Högre monterad antenn" },
        { key: "b", text_sv: "Hel, korrosionsfri antennkabel och kontakter" },
        { key: "c", text_sv: "Att tala högre i mikrofonen" },
        { key: "d", text_sv: "Full batterispänning" },
      ],
    },
    answerKey: { correct: ["a", "b", "d"] },
    explanation:
      "Antennhöjd, felfri kabelväg och god spänning gör verklig skillnad. Röststyrkan ändrar inte signalens räckvidd — tala normalt och tydligt.",
    sourceRef: SOURCE,
    objectiveTitle: "Antenn och installation",
  },
  {
    index: 7,
    kind: "single_choice",
    stemSv: "Varför får en vanlig VHF-apparat inte användas på land utan vidare?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Tillståndet gäller sjöradiotrafik — marin VHF är reglerad för användning till sjöss",
        },
        { key: "b", text_sv: "Radion tål inte landklimat" },
        { key: "c", text_sv: "Räckvidden blir för lång på land" },
        { key: "d", text_sv: "Det är tillåtet utan begränsningar" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Marin VHF är en reglerad radiotjänst: frekvenserna och tillståndet är avsedda för sjötrafik, och användningen styrs av tillståndsvillkoren.",
    sourceRef: SOURCE,
    objectiveTitle: "Tillstånd och regler",
  },
  {
    index: 8,
    kind: "single_choice",
    stemSv:
      "Varför ska VHF-radion vara kopplad så att den fungerar även vid huvudströmsbortfall?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Ett elfel får inte tysta din nödkommunikation — direktmatning/reservbatteri och gärna en laddad handburen",
        },
        { key: "b", text_sv: "Radion drar mindre ström då" },
        { key: "c", text_sv: "Det är bara ett krav för yrkesfartyg" },
        { key: "d", text_sv: "Radion mår bra av dubbla kablar" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Samma haveri som skapar nöden (el, brand, vatten) slår ofta ut huvudströmmen. Oberoende matning + handhållen VHF håller larmvägen öppen.",
    sourceRef: SOURCE,
    objectiveTitle: "Strömförsörjning",
  },
  {
    index: 9,
    kind: "single_choice",
    stemSv: "Vilket sammanhang hör kanal 6 klassiskt till?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Fartyg-till-fartyg, bl.a. samordning vid sjöräddningsinsatser (SAR)",
        },
        { key: "b", text_sv: "Endast hamnkontor" },
        { key: "c", text_sv: "DSC-signalering" },
        { key: "d", text_sv: "Väderprognoser" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Kanal 6 är den primära interskeppskanalen och används bl.a. för samordning mellan fartyg och flyg vid räddningsinsatser.",
    sourceRef: SOURCE,
    objectiveTitle: "Kanalkunskap",
  },
];
