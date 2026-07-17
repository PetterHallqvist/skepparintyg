import type { DemoItem } from "../../demo";

/**
 * Kustskeppar — väder och sjömanskap på öppet vatten (SPEC §30 K7–K8).
 * Draft quality, sources marked unverified.
 */

const SOURCE =
  "Lektion: Kustskeppar — väder & sjömanskap (utkast, ej källgranskad)";

export const VADER_SJOMANSKAP_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "single_choice",
    stemSv:
      "Prognosen anger 'kuling 14 m/s i eftermiddag'. Din planerade öppna passage tar 5 timmar och det är förmiddag. Vad är det sjömansmässiga beslutet?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Skjut upp passagen eller välj en skyddad alternativväg — marginalen är för liten",
        },
        { key: "b", text_sv: "Gå — prognoser överdriver oftast" },
        { key: "c", text_sv: "Gå men dubbla farten" },
        { key: "d", text_sv: "Gå och besluta till havs när vinden ökar" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Beslut fattas i hamn, inte när det redan blåser. En passage som slutar samtidigt som kulingen börjar har noll marginal för fel.",
    sourceRef: SOURCE,
    objectiveTitle: "Väderfönster och beslut",
    misconceptionByKey: {
      d: "”Vi ser till havs” är den klassiska vägen in i problem — där är alternativen färre.",
    },
  },
  {
    index: 1,
    kind: "matching",
    stemSv: "Para ihop molntecknet/observationen med vad den ofta signalerar.",
    interaction: {
      kind: "matching",
      left: [
        { key: "l1", text_sv: "Snabbt fallande barometer" },
        { key: "l2", text_sv: "Växande cumulonimbus (bymoln)" },
        { key: "l3", text_sv: "Halofenomen kring solen" },
      ],
      right: [
        { key: "r1", text_sv: "Annalkande lågtryck — hårdare vind" },
        { key: "r2", text_sv: "Byar, åska och plötsliga vindkast" },
        { key: "r3", text_sv: "Cirrusslöjor — front kan närma sig inom ett dygn" },
      ],
    },
    answerKey: { pairs: { l1: "r1", l2: "r2", l3: "r3" } },
    explanation:
      "Barometern, bymolnen och slöjmolnen är tre klassiska tidiga varningar som kompletterar prognosen med det du faktiskt ser.",
    sourceRef: SOURCE,
    objectiveTitle: "Vädertecken",
  },
  {
    index: 2,
    kind: "single_choice",
    stemSv: "Varför blir vågorna brantare och farligare i uppgrundande vatten och mot ström?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Vågenergin trycks ihop — våglängden kortas och höjden växer",
        },
        { key: "b", text_sv: "Vattnet är kallare där" },
        { key: "c", text_sv: "Det är en synvilla" },
        { key: "d", text_sv: "Salthalten ändras" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Grund och motström bromsar vågens fart; energin bevaras genom brantare, ibland brytande sjö. Undvik grunda bankar i pålandsvind.",
    sourceRef: SOURCE,
    objectiveTitle: "Sjöhävning och grunt vatten",
  },
  {
    index: 3,
    kind: "multiple_select",
    stemSv:
      "Vilka förberedelser hör till gott sjömanskap före en längre öppen passage? Välj alla som stämmer.",
    interaction: {
      kind: "multiple_select",
      options: [
        { key: "a", text_sv: "Säkra rutiner för flytväst/livsele på däck" },
        { key: "b", text_sv: "Kontrollera bränsle med reservmarginal (t.ex. 1/3-regeln)" },
        { key: "c", text_sv: "Planera vem som avlöser vid rodret" },
        { key: "d", text_sv: "Stänga av VHF:n för att spara ström" },
      ],
    },
    answerKey: { correct: ["a", "b", "c"] },
    explanation:
      "Sele-/västrutin, bränslemarginal och avlösning håller passagen säker. VHF:n ska tvärtom passa kanal 16 under gång.",
    sourceRef: SOURCE,
    objectiveTitle: "Passageförberedelser",
    misconceptionByKey: {
      d: "Passning på kanal 16 är en del av sjösäkerheten — radion är inte en strömtjuv att stänga av.",
    },
  },
  {
    index: 4,
    kind: "ordering",
    stemSv:
      "En besättningsmedlem visar tecken på svår sjösjuka och nedkylning under passage. Ordna åtgärderna.",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "Sätt personen i skydd, i lä och med varma, torra kläder" },
        { key: "b", text_sv: "Ge något varmt/sött om personen kan ta emot det" },
        { key: "c", text_sv: "Omvärdera planen — kortaste säkra vägen till skydd" },
        { key: "d", text_sv: "Håll personen under uppsikt och omfördela arbetsuppgifterna" },
      ],
    },
    answerKey: { order: ["a", "b", "c", "d"] },
    explanation:
      "Skydda och värm först, sedan energi, sedan planbeslut — och personen lämnas aldrig utan uppsikt. En försvagad besättning är ett sjösäkerhetsproblem.",
    sourceRef: SOURCE,
    objectiveTitle: "Besättningens säkerhet",
  },
  {
    index: 5,
    kind: "single_choice",
    stemSv:
      "Vad innebär tumregeln att 'alltid ha en tredjedel av bränslet kvar i reserv'?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "En tredjedel ut, en tredjedel hem, en tredjedel för oförutsett",
        },
        { key: "b", text_sv: "Tanken ska aldrig fyllas mer än 2/3" },
        { key: "c", text_sv: "Motorn går bäst på en tredjedels gas" },
        { key: "d", text_sv: "Reservdunken ska rymma en tredjedel av tanken" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "1/3-regeln bygger in marginal för motvind, omvägar och missbedömningar — bränslebrist till sjöss är ett helt onödigt nödläge.",
    sourceRef: SOURCE,
    objectiveTitle: "Bränsleplanering",
  },
  {
    index: 6,
    kind: "single_choice",
    stemSv:
      "Vad är kallvattenchock (köldchock) och varför dödar den före nedkylningen?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Reflexmässig gasping och panikandning första minuterna i kallt vatten — flytväst och att flyta stilla räddar",
        },
        { key: "b", text_sv: "Ett tillstånd som uppstår först efter en timme" },
        { key: "c", text_sv: "En myt — kallt vatten är bara obehagligt" },
        { key: "d", text_sv: "Det drabbar bara icke-simkunniga" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Första 1–3 minuterna är farligast: kippandning kan dra ner vatten i luftvägarna. Flytväst håller huvudet uppe medan reflexen klingar av — ligg stilla, andas kontrollerat.",
    sourceRef: SOURCE,
    objectiveTitle: "Sjukvård — kallvattenchock",
  },
  {
    index: 7,
    kind: "ordering",
    stemSv:
      "En person ombord blir plötsligt medvetslös men andas. Ordna åtgärderna under gång.",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "Kontrollera andning och lägg i stabilt sidoläge" },
        { key: "b", text_sv: "Larma — VHF kanal 16 / 112, begär medicinsk hjälp (PAN-PAN)" },
        { key: "c", text_sv: "Håll personen varm och övervaka andningen kontinuerligt" },
        { key: "d", text_sv: "Planera om: kortaste säkra väg mot möte med sjukvård" },
      ],
    },
    answerKey: { order: ["a", "b", "c", "d"] },
    explanation:
      "Fria luftvägar först, sedan larm — sjöräddningen kan möta eller helikoptra. Övervakning och värme tills hjälpen tar över.",
    sourceRef: SOURCE,
    objectiveTitle: "Sjukvård — medvetslöshet",
  },
];
