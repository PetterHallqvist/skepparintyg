import type { DemoItem } from "../../demo";

/**
 * Seglarintyg 2 — moderna båtsystem och underhåll (SPEC §33.2). Draft
 * quality, sources marked unverified.
 */

const SOURCE = "Lektion: Seglar 2 — båtsystem (utkast, ej källgranskad)";

export const BATSYSTEM_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "single_choice",
    stemSv:
      "Varför delar moderna segelbåtar upp batterierna i start- och förbrukningsbank?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Så att belysning och kylbox aldrig kan tömma motorns startförmåga",
        },
        { key: "b", text_sv: "För att batterier inte får stå bredvid varandra" },
        { key: "c", text_sv: "Av viktskäl" },
        { key: "d", text_sv: "Det är bara en försäkringsfråga" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Förbrukningen isoleras från startbanken — hur mycket ni än lyssnat på musik ska motorn alltid kunna starta.",
    sourceRef: SOURCE,
    objectiveTitle: "Elsystem",
  },
  {
    index: 1,
    kind: "ordering",
    stemSv: "Ordna den dagliga motorkontrollen (”before start”) på en inombordsdiesel.",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "Kontrollera oljenivå och kylvätska" },
        { key: "b", text_sv: "Titta efter läckage och lösa remmar i motorrummet" },
        { key: "c", text_sv: "Öppna bottenkranen för kylvattnet" },
        { key: "d", text_sv: "Starta och kontrollera kylvattenstrålen" },
      ],
    },
    answerKey: { order: ["a", "b", "c", "d"] },
    explanation:
      "Vätskor → visuell koll → bottenkran → start med kylvattenkontroll. En glömd bottenkran är den klassiska impellerdödaren.",
    sourceRef: SOURCE,
    objectiveTitle: "Motorrutiner",
  },
  {
    index: 2,
    kind: "single_choice",
    stemSv: "Vad gör en självslående fock (självslående skena)?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Förseglet glider själv över vid slag — inga skotbyten behövs",
        },
        { key: "b", text_sv: "Seglet revar sig självt" },
        { key: "c", text_sv: "Seglet hissar sig självt" },
        { key: "d", text_sv: "Skenan låser rodret vid slag" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Skotpunkten löper på en tvärgående skena: vid slag följer focken med utan handgrepp — enklare shorthand-segling, men mindre trimregister.",
    sourceRef: SOURCE,
    objectiveTitle: "Modern rigg och utrustning",
  },
  {
    index: 3,
    kind: "matching",
    stemSv: "Para ihop systemkontrollen med hur ofta den typiskt görs.",
    interaction: {
      kind: "matching",
      left: [
        { key: "l1", text_sv: "Länspump & bottenventiler" },
        { key: "l2", text_sv: "Riggens vantskruvar och sprintar" },
        { key: "l3", text_sv: "Gasolsystemets slangar och läckagetest" },
      ],
      right: [
        { key: "r1", text_sv: "Varje tur — före avgång" },
        { key: "r2", text_sv: "Vår och höst + efter hård segling" },
        { key: "r3", text_sv: "Enligt intervall/årligen och vid minsta misstanke" },
      ],
    },
    answerKey: { pairs: { l1: "r1", l2: "r2", l3: "r3" } },
    explanation:
      "Sjövattensystemen kontrolleras varje tur; riggen säsongsvis; gasol enligt fasta intervall — och alltid vid lukt eller misstanke.",
    sourceRef: SOURCE,
    objectiveTitle: "Underhållsintervall",
  },
  {
    index: 4,
    kind: "single_choice",
    stemSv: "Varför får en vinsch aldrig lindas MOT klockan (på standardvinschar)?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Vinschen är byggd för medurs drag — fel håll ger överhalning och plötsliga kast",
        },
        { key: "b", text_sv: "Linan slits dubbelt så fort" },
        { key: "c", text_sv: "Det är tillåtet åt båda håll" },
        { key: "d", text_sv: "Vinschen rostar" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Standardvinschar arbetar medurs; fellindning gör att linan låser och släpper okontrollerat. Handflatan platt vid avlindning under last.",
    sourceRef: SOURCE,
    objectiveTitle: "Däcksutrustning",
  },
  {
    index: 5,
    kind: "single_choice",
    stemSv: "Vad kontrollerar du på en rullfock inför säsongen?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Att rullinan löper fritt, profilen snurrar lätt och UV-skyddet är helt",
        },
        { key: "b", text_sv: "Bara segeldukens färg" },
        { key: "c", text_sv: "Att focken är fasttejpad" },
        { key: "d", text_sv: "Rullfockar behöver ingen kontroll" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "En rullfock som kärvar i frisk vind är ett säkerhetsproblem — mekanik, lina och UV-skydd kollas i lugnt väder, inte i kulingen.",
    sourceRef: SOURCE,
    objectiveTitle: "Rullsystem",
  },
  {
    index: 6,
    kind: "single_choice",
    stemSv: "Motorn stannar och du misstänker luft i dieselsystemet. Vad är den typiska orsaken och åtgärden?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Tom tank eller läckande anslutning — fyll på, lufta systemet enligt manualen",
        },
        { key: "b", text_sv: "För mycket bränsle — tappa ur hälften" },
        { key: "c", text_sv: "Batteriet är svagt — ladda" },
        { key: "d", text_sv: "Propellern är fellindad" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Diesel förlåter mycket men inte luft: efter torrkörning måste systemet luftas (handpump/avluftningsskruv) innan motorn startar igen.",
    sourceRef: SOURCE,
    objectiveTitle: "Felsökning motor",
  },
  {
    index: 7,
    kind: "multiple_select",
    stemSv:
      "Vilka hör till en klok verktygs-/reservdelslåda för kustsegling? Välj alla som stämmer.",
    interaction: {
      kind: "multiple_select",
      options: [
        { key: "a", text_sv: "Impeller + packning och verktyg för bytet" },
        { key: "b", text_sv: "Säkringar och elkontaktspray" },
        { key: "c", text_sv: "Slangklämmor och tejp/epoxipinne" },
        { key: "d", text_sv: "Reservmast" },
      ],
    },
    answerKey: { correct: ["a", "b", "c"] },
    explanation:
      "Impeller, säkringar och slang-/läckagefix täcker de vanligaste stoppen. Masten får riggaren stå för.",
    sourceRef: SOURCE,
    objectiveTitle: "Reservdelar ombord",
  },
];
