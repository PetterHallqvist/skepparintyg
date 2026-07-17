import type { DemoItem } from "../../demo";

/**
 * Weather & decision trainer (SPEC §27). Fictional forecast/observation cards;
 * tasks are existing choice kinds — interpret trend, choose the conservative
 * action, detect insufficient information, distinguish forecast from
 * observation. No live weather. Draft quality, sources unverified.
 */

const SOURCE = "Lektion: Väder och beslut (utkast, ej källgranskad)";

export const VADER_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "single_choice",
    stemSv: "Vad tyder prognosen på för de närmaste timmarna?",
    interaction: {
      kind: "single_choice",
      stimulus: {
        kind: "weather_card",
        weather: {
          area_sv: "Övningsfjärden",
          windFromDeg: 225,
          windDir_sv: "SV",
          windMs: 8,
          trend: "falling",
          seaState_sv: "Krabb sjö, växande.",
          note_sv: "Fallande lufttryck, tilltagande vind.",
        },
      },
      options: [
        { key: "a", text_sv: "Försämring — det blåser upp" },
        { key: "b", text_sv: "Förbättring — vinden mojnar" },
        { key: "c", text_sv: "Oförändrat väder" },
        { key: "d", text_sv: "Går inte att säga något alls" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Fallande lufttryck tillsammans med tilltagande vind och växande sjö tyder på försämring.",
    sourceRef: SOURCE,
    objectiveTitle: "Väder — tendens",
    misconceptionByKey: {
      b: "Fallande tryck och tilltagande vind pekar mot försämring, inte förbättring.",
    },
  },
  {
    index: 1,
    kind: "single_choice",
    stemSv: "Vad är det mest omdömesgilla valet inför turen?",
    interaction: {
      kind: "single_choice",
      stimulus: {
        kind: "weather_card",
        weather: {
          area_sv: "Yttre skärgården",
          windFromDeg: 270,
          windDir_sv: "V",
          windMs: 13,
          trend: "falling",
          seaState_sv: "Grov sjö på öppna sträckor.",
          route_sv: "Planerad rutt går över en öppen fjärd.",
        },
      },
      options: [
        { key: "a", text_sv: "Vänta eller välj en skyddad rutt innanför öarna" },
        { key: "b", text_sv: "Köra som planerat — det brukar lugna ner sig" },
        { key: "c", text_sv: "Öka farten för att hinna före vädret" },
        { key: "d", text_sv: "Strunta i sjörapporten, känn efter på plats" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Vid grov sjö på öppet vatten är det försiktiga valet att vänta eller välja en skyddad rutt.",
    sourceRef: SOURCE,
    objectiveTitle: "Väder — konservativt beslut",
  },
  {
    index: 2,
    kind: "single_choice",
    stemSv:
      "Prognosen anger vindstyrka men inget om sikt. Vad kan du avgöra om sikten?",
    interaction: {
      kind: "single_choice",
      stimulus: {
        kind: "weather_card",
        weather: {
          area_sv: "Övningsfjärden",
          windFromDeg: 180,
          windDir_sv: "S",
          windMs: 6,
          trend: "steady",
          seaState_sv: "Måttlig sjö.",
          note_sv: "Ingen uppgift om sikt eller dimma.",
        },
      },
      options: [
        { key: "a", text_sv: "Ingenting säkert — sikt saknas i underlaget" },
        { key: "b", text_sv: "Att sikten är god eftersom vinden är svag" },
        { key: "c", text_sv: "Att det kommer dimma" },
        { key: "d", text_sv: "Att sikten är dålig eftersom trycket är stabilt" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Saknas uppgift om sikt kan du inte dra någon slutsats om den — hämta mer information.",
    sourceRef: SOURCE,
    objectiveTitle: "Väder — otillräcklig information",
    misconceptionByKey: {
      b: "Svag vind säger inget om sikt — dimma kan förekomma i svag vind.",
    },
  },
  {
    index: 3,
    kind: "single_choice",
    stemSv:
      "Prognosen sa svag vind, men just nu ser du vita gäss och känner byar. Vad väger tyngst för ditt beslut?",
    interaction: {
      kind: "single_choice",
      stimulus: {
        kind: "weather_card",
        weather: {
          area_sv: "Övningsfjärden",
          windFromDeg: 315,
          windDir_sv: "NV",
          windMs: 4,
          trend: "falling",
          seaState_sv: "Prognos: liten sjö.",
          observation_sv: "Nu: vita gäss, byiga vindstötar.",
        },
      },
      options: [
        { key: "a", text_sv: "Din egen aktuella observation" },
        { key: "b", text_sv: "Prognosen — den är officiell" },
        { key: "c", text_sv: "Gårdagens väder" },
        { key: "d", text_sv: "Vad andra båtar gör" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "En prognos är en förutsägelse; den aktuella observationen är verkligheten just nu och väger tyngst.",
    sourceRef: SOURCE,
    objectiveTitle: "Väder — prognos vs observation",
  },
  {
    index: 4,
    kind: "multiple_select",
    stemSv:
      "Vilka tecken tyder på att vädret håller på att försämras? Välj alla som stämmer.",
    interaction: {
      kind: "multiple_select",
      stimulus: {
        kind: "weather_card",
        weather: {
          area_sv: "Övningsfjärden",
          windFromDeg: 225,
          windDir_sv: "SV",
          windMs: 10,
          trend: "falling",
          seaState_sv: "Tilltagande.",
        },
      },
      options: [
        { key: "a", text_sv: "Snabbt fallande lufttryck" },
        { key: "b", text_sv: "Tilltagande vind" },
        { key: "c", text_sv: "Stigande lufttryck och mojnande vind" },
        { key: "d", text_sv: "Molnbank som byggs upp i väster" },
      ],
    },
    answerKey: { correct: ["a", "b", "d"] },
    explanation:
      "Fallande tryck, tilltagande vind och en uppbyggande molnbank tyder på försämring. Stigande tryck med mojnande vind är tvärtom.",
    sourceRef: SOURCE,
    objectiveTitle: "Väder — varningstecken",
  },
  {
    index: 5,
    kind: "single_choice",
    stemSv:
      "Vinden ligger på från land (frånlandsvind). Vad är särskilt att tänka på nära stranden?",
    interaction: {
      kind: "single_choice",
      stimulus: {
        kind: "weather_card",
        weather: {
          area_sv: "Läsidan av en ö",
          windFromDeg: 0,
          windDir_sv: "N (från land)",
          windMs: 9,
          trend: "steady",
          seaState_sv: "Lugnt nära land, växande längre ut.",
        },
      },
      options: [
        { key: "a", text_sv: "Det kan vara lugnt vid stranden men betydligt hårdare en bit ut" },
        { key: "b", text_sv: "Sjön är alltid grövst precis vid stranden" },
        { key: "c", text_sv: "Frånlandsvind gör alltid vattnet becksvart" },
        { key: "d", text_sv: "Vinden påverkar inte förhållandena till sjöss" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Vid frånlandsvind är det ofta bedrägligt lugnt vid stranden medan det blåser och byggs sjö längre ut.",
    sourceRef: SOURCE,
    objectiveTitle: "Väder — lokala effekter",
  },
];
