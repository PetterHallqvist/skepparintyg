import type { DemoItem } from "../../demo";

/**
 * Båtpraktik dag — säkerhetsutrustning och förberedelser (SPEC §29.1
 * områden 1–2, 15). Draft quality, sources marked unverified.
 */

const SOURCE = "Lektion: Båtpraktik — säkerhet (utkast, ej källgranskad)";

export const SAKERHET_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "multiple_select",
    stemSv:
      "Vilket hör till den säkerhetsutrustning du bör kunna LOKALISERA blint ombord? Välj alla som stämmer.",
    interaction: {
      kind: "multiple_select",
      options: [
        { key: "a", text_sv: "Brandsläckare" },
        { key: "b", text_sv: "Livboj med lina" },
        { key: "c", text_sv: "Bränsleavstängning" },
        { key: "d", text_sv: "Kaffekokaren" },
      ],
    },
    answerKey: { correct: ["a", "b", "c"] },
    explanation:
      "I ett skarpt läge finns ingen tid att leta: släckare, livboj och bränsleavstängning ska sitta i ryggmärgen — gå igenom placeringen med alla ombord.",
    sourceRef: SOURCE,
    objectiveTitle: "Säkerhetsutrustning ombord",
  },
  {
    index: 1,
    kind: "single_choice",
    stemSv: "Hur kontrollerar du en brandsläckare inför säsongen?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Tryckindikator i grönt, plombering hel, rätt datum — och pulversläckare vänds/skakas enligt anvisning",
        },
        { key: "b", text_sv: "Provsprutar en kort stöt" },
        { key: "c", text_sv: "Väger den på badrumsvåg" },
        { key: "d", text_sv: "Ingen kontroll behövs före utgångsdatum" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Indikator, plomb och datum är den snabba kontrollen. En provsprutad släckare kan tappa trycket och svika när det gäller.",
    sourceRef: SOURCE,
    objectiveTitle: "Brandsäkerhet",
    misconceptionByKey: {
      b: "Provsprutning kan förstöra ventilens tätning — släckaren blir opålitlig.",
    },
  },
  {
    index: 2,
    kind: "single_choice",
    stemSv: "När ska flytväst bäras enligt god praxis på en mindre motorbåt?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Av alla, hela tiden under gång" },
        { key: "b", text_sv: "Bara av den som inte kan simma" },
        { key: "c", text_sv: "Bara i hårt väder" },
        { key: "d", text_sv: "Bara av barn" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "En väst i stuven räddar ingen. På mindre öppna båtar är normen väst på alla under gång — kallt vatten gör simkunnighet irrelevant på minuter.",
    sourceRef: SOURCE,
    objectiveTitle: "Personlig utrustning",
  },
  {
    index: 3,
    kind: "ordering",
    stemSv: "Ordna säkerhetsgenomgången för nya gäster ombord, före avgång.",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "Prova ut och justera flytvästar" },
        { key: "b", text_sv: "Visa var livboj, släckare och första hjälpen finns" },
        { key: "c", text_sv: "Visa hur motorn stoppas och VHF/telefon används" },
        { key: "d", text_sv: "Gå igenom rollerna vid tilläggning och man-över-bord" },
      ],
    },
    answerKey: { order: ["a", "b", "c", "d"] },
    explanation:
      "Personligt skydd först, sedan utrustningens platser, sedan ”stoppa och larma”, sist rollfördelningen — en genomgång tar tre minuter och kan vara skillnaden.",
    sourceRef: SOURCE,
    objectiveTitle: "Säkerhetsgenomgång",
  },
  {
    index: 4,
    kind: "single_choice",
    stemSv: "Varför ventilerar du motorrummet FÖRE start på en bensinbåt?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Bensinångor är tyngre än luft och kan antändas av startgnistan",
        },
        { key: "b", text_sv: "Motorn startar lättare med syre" },
        { key: "c", text_sv: "Det är bara nödvändigt på våren" },
        { key: "d", text_sv: "För att kylvattnet ska cirkulera" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Bensinångor samlas i kölsvinet. Fläkt/ventilation några minuter före start — och luktkontroll — förebygger explosionsrisken.",
    sourceRef: SOURCE,
    objectiveTitle: "Bränslesäkerhet",
  },
  {
    index: 5,
    kind: "multiple_select",
    stemSv:
      "Vad hör till klok personlig utrustning för en heldag på sjön, även när det är sol på morgonen? Välj alla som stämmer.",
    interaction: {
      kind: "multiple_select",
      options: [
        { key: "a", text_sv: "Vind-/vattentätt skalplagg" },
        { key: "b", text_sv: "Halksäkra skor med ljus sula" },
        { key: "c", text_sv: "Keps/solskydd och vatten" },
        { key: "d", text_sv: "Strandsandaler med lös häl" },
      ],
    },
    answerKey: { correct: ["a", "b", "c"] },
    explanation:
      "Vädret på sjön skiftar snabbare än i land. Skal, riktiga skor och solskydd täcker de vanliga lägena; lösa sandaler är en halkrisk på däck.",
    sourceRef: SOURCE,
    objectiveTitle: "Personlig utrustning",
  },
  {
    index: 6,
    kind: "single_choice",
    stemSv: "Vad innebär miljöhänsyn kring svall (vågor från din båt)?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Anpassa farten så svallet inte skadar stränder, bryggor eller stör andra",
        },
        { key: "b", text_sv: "Svall är alltid förbjudet" },
        { key: "c", text_sv: "Svall spelar bara roll i hamnar" },
        { key: "d", text_sv: "Snabbare gång ger alltid mindre svall" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Du ansvarar för ditt svall. Halvplanande fart ger ofta störst svall — antingen deplacementfart eller ordentligt i plan, och sakta nära känsliga stränder.",
    sourceRef: SOURCE,
    objectiveTitle: "Miljö och hänsyn",
  },
  {
    index: 7,
    kind: "single_choice",
    stemSv: "Varför kontrollerar du länspumpen före avgång?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Ett läckage upptäcks ofta sent — pumpen är din tid att hinna åtgärda och nå land",
        },
        { key: "b", text_sv: "Den håller däcket torrt från regn" },
        { key: "c", text_sv: "Försäkringen kräver dagligt prov" },
        { key: "d", text_sv: "Den kyler motorn" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Länspumpen köper tid vid inläckage. Testa att den går och att backventil/slang inte är igensatta — och vet var den manuella finns.",
    sourceRef: SOURCE,
    objectiveTitle: "Kontroller före avgång",
  },
  {
    index: 8,
    kind: "single_choice",
    stemSv: "När är en brandfilt bättre än pulversläckaren ombord?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Vid mindre bränder i pentryt (kastrull/spritkök) och brinnande kläder — kväver utan att förstöra allt",
        },
        { key: "b", text_sv: "Vid motorrumsbrand" },
        { key: "c", text_sv: "Aldrig — pulver är alltid bäst" },
        { key: "d", text_sv: "Vid elbrand i instrumentpanelen" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Filten kväver små bränder vid källan utan pulvrets sanering. Motorrum släcks utan att luckan öppnas (släckport/gasol- eller pulversystem).",
    sourceRef: SOURCE,
    objectiveTitle: "Brandredskap",
  },
  {
    index: 9,
    kind: "single_choice",
    stemSv:
      "Före avgång kontrollerar ni kommunikationen. Vad hör till en rimlig rutin?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Mobil laddad i vattentätt fodral + VHF-funktionskontroll om sådan finns ombord",
        },
        { key: "b", text_sv: "Det räcker att någon i land har telefon" },
        { key: "c", text_sv: "Kommunikation behövs bara till havs" },
        { key: "d", text_sv: "Brevduva" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "En våt telefon är ingen telefon: vattentätt fodral med rem, laddad, och VHF:n provad. Larmvägen ska fungera när du är blöt och stressad.",
    sourceRef: SOURCE,
    objectiveTitle: "Kommunikationsberedskap",
  },
];
