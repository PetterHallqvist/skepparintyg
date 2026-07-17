import type { DemoItem } from "../../demo";

/**
 * Båtpraktik dag — teoriförberedelse (SPEC §29.1, områden 1–15). En
 * beredskapskamrat inför den handledda praktiken; skärmen bevisar aldrig
 * praktisk förmåga. Draft quality, sources marked unverified.
 */

const SOURCE = "Lektion: Båtpraktik dag — förberedelse (utkast, ej källgranskad)";

export const PASS_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "multiple_select",
    stemSv:
      "Du kontrollerar flytvästarna före avgång. Vad ingår i en rimlig kontroll? Välj alla som stämmer.",
    interaction: {
      kind: "multiple_select",
      options: [
        { key: "a", text_sv: "Rätt storlek och passform för bäraren" },
        { key: "b", text_sv: "Gaspatron och indikator hela (uppblåsbar väst)" },
        { key: "c", text_sv: "Att färgen matchar båtens inredning" },
        { key: "d", text_sv: "Spännen, dragkedjor och grenband fungerar" },
      ],
    },
    answerKey: { correct: ["a", "b", "d"] },
    explanation:
      "Passform, fungerande spännen/grenband och en hel gaspatron avgör om västen fungerar när det gäller. Färgen spelar ingen roll för funktionen.",
    sourceRef: SOURCE,
    objectiveTitle: "Säkerhetsutrustning ombord",
  },
  {
    index: 1,
    kind: "ordering",
    stemSv: "Ordna åtgärderna vid man över bord i rimlig ordning.",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "Larma ”man över bord!” och peka kontinuerligt på personen" },
        { key: "b", text_sv: "Kasta livboj eller annat flytredskap" },
        { key: "c", text_sv: "Tryck MOB på plottern" },
        { key: "d", text_sv: "Manövrera tillbaka enligt inövad metod" },
        { key: "e", text_sv: "Ta upp personen i lä med stoppad propeller" },
      ],
    },
    answerKey: { order: ["a", "b", "c", "d", "e"] },
    explanation:
      "Larm + utpekning säkrar sikten, flytredskap köper tid, MOB-positionen stödjer återgången — och upptagningen sker i lä med propellern stoppad.",
    sourceRef: SOURCE,
    objectiveTitle: "Man över bord",
  },
  {
    index: 2,
    kind: "single_choice",
    stemSv:
      "Du backar med en högergängad propeller. Åt vilket håll vill aktern normalt gå?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Åt babord" },
        { key: "b", text_sv: "Åt styrbord" },
        { key: "c", text_sv: "Rakt bakåt utan sidokraft" },
        { key: "d", text_sv: "Det beror på vindriktningen, inte propellern" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "En högergängad propeller ger vid back ett propellersug som drar aktern åt babord — planera tilläggningen med det.",
    sourceRef: SOURCE,
    objectiveTitle: "Roder, propeller och manöver",
    misconceptionByKey: {
      c: "Alla enpropellerbåtar har sidokraft vid back — den försvinner inte.",
    },
  },
  {
    index: 3,
    kind: "single_choice",
    stemSv:
      "Du styr på en enslinje. Märkena börjar glida isär. Vad betyder det?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Du är kvar på linjen men för nära märkena" },
        { key: "b", text_sv: "Du har drivit av linjen och behöver korrigera kursen" },
        { key: "c", text_sv: "Enslinjen gäller inte längre" },
        { key: "d", text_sv: "Märkena är felplacerade" },
      ],
    },
    answerKey: { correct: "b" },
    explanation:
      "Så länge märkena står i linje är du på enslinjen. När de öppnar sig har du drivit åt sidan — styr tillbaka tills de täcker varandra igen.",
    sourceRef: SOURCE,
    objectiveTitle: "Styra på enslinje",
  },
  {
    index: 4,
    kind: "waypoint_entry",
    stemSv:
      "Mata in waypointens koordinater exakt som de visas på skärmen. Var noga med sifferordningen.",
    interaction: {
      kind: "waypoint_entry",
      stimulus: {
        kind: "plotter",
        plotter: {
          mode: "normal",
          rangeNm: 2,
          waypoint: { x: 150, y: 70, label_sv: "59°20,5'N 018°04,2'E" },
          note_sv: "Waypoint WP2: 59°20,5'N 018°04,2'E",
        },
      },
    },
    answerKey: { lat: "59°20,5'N", lon: "018°04,2'E" },
    explanation:
      "Kontrollera alltid inmatningen mot källan — omkastade siffror är ett av de vanligaste navigationsfelen.",
    sourceRef: SOURCE,
    objectiveTitle: "Elektroniskt sjökort och waypoint",
  },
  {
    index: 5,
    kind: "single_choice",
    stemSv: "Vad används en förspring till vid tilläggning längs kaj?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Hindrar båten att glida framåt längs kajen" },
        { key: "b", text_sv: "Lyfter fören ur vattnet" },
        { key: "c", text_sv: "Ersätter fendrar" },
        { key: "d", text_sv: "Används bara vid ankring" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Förspringet löper från fören och akteröver — det stoppar rörelse framåt och kan användas för att arbeta ut aktern vid avgång.",
    sourceRef: SOURCE,
    objectiveTitle: "Förtöjning och spring",
    misconceptionByKey: {
      d: "Spring är förtöjningslinor vid kaj — inte ankringsutrustning.",
    },
  },
];
