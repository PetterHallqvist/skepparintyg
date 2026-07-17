import type { DemoItem } from "../../demo";

/**
 * Båtpraktik dag — praktisk navigation: kort mot verklighet, enslinjer,
 * farled, position, plotter (SPEC §29.1 områden 3–11). Draft quality,
 * sources marked unverified.
 */

const SOURCE =
  "Lektion: Båtpraktik — praktisk navigation (utkast, ej källgranskad)";

export const NAVIGATION_PRAKTIK_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "single_choice",
    stemSv:
      "Du ska relatera kortet till verkligheten. Vilket arbetssätt är rätt?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Orientera kortet efter färdriktningen, identifiera 2–3 objekt i verkligheten och hitta dem i kortet",
        },
        { key: "b", text_sv: "Titta bara i kortet — verkligheten stämmer ändå" },
        { key: "c", text_sv: "Titta bara på plottern" },
        { key: "d", text_sv: "Vänta tills du är osäker och orientera dig då" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Kort-mot-verklighet är en kontinuerlig loop: identifiera framåt, bekräfta i kortet, förutse nästa märke — inte något du börjar med när du redan är vilse.",
    sourceRef: SOURCE,
    objectiveTitle: "Kort mot verklighet",
  },
  {
    index: 1,
    kind: "single_choice",
    stemSv:
      "Du styr mot ett landmärke rakt föröver men märker att ett närmare objekt 'vandrar' åt höger relativt landmärket. Vad betyder det?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Du driver åt vänster av kurslinjen (t.ex. av vind/ström)" },
        { key: "b", text_sv: "Du är exakt på linjen" },
        { key: "c", text_sv: "Landmärket flyttar sig" },
        { key: "d", text_sv: "Det säger inget om din rörelse" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Relativ rörelse mellan två objekt i din siktlinje avslöjar avdrift: håll märkena stilla i förhållande till varandra så går du rakt.",
    sourceRef: SOURCE,
    objectiveTitle: "Styra på landmärke",
  },
  {
    index: 2,
    kind: "single_choice",
    stemSv:
      "Vid kompasstyrning i sjögång — vad är rätt teknik?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Styr på medelkursen med små roderutslag — jaga inte varje svängning på rosen",
        },
        { key: "b", text_sv: "Korrigera med stora utslag så fort rosen rör sig" },
        { key: "c", text_sv: "Titta på kompassen hela tiden, aldrig ut" },
        { key: "d", text_sv: "Kompassen fungerar inte i sjögång" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Rosen pendlar i sjögång. Håll medelkursen, para kompassen med ett moln/märke föröver och kontrollera regelbundet — små, lugna korrektioner.",
    sourceRef: SOURCE,
    objectiveTitle: "Styra efter kompass",
  },
  {
    index: 3,
    kind: "multiple_select",
    stemSv:
      "Du går i en trafikerad farled med fritidsbåt. Vad gäller? Välj alla som stämmer.",
    interaction: {
      kind: "multiple_select",
      options: [
        { key: "a", text_sv: "Håll till styrbordssidan av farleden" },
        { key: "b", text_sv: "Stör inte större fartyg som är hänvisade till leden" },
        { key: "c", text_sv: "Korsning av leden görs snabbt och i så rät vinkel som möjligt" },
        { key: "d", text_sv: "Fritidsbåtar har alltid företräde i farleder" },
      ],
    },
    answerKey: { correct: ["a", "b", "c"] },
    explanation:
      "Styrbordssida, respekt för djupgåendebundna fartyg och snabb tvär korsning är farledsdisciplinens ABC — företräde har du inte.",
    sourceRef: SOURCE,
    objectiveTitle: "Navigation i farled",
    misconceptionByKey: {
      d: "Stora fartyg kan inte väja i leden — fritidsbåten anpassar sig.",
    },
  },
  {
    index: 4,
    kind: "single_choice",
    stemSv:
      "Enklaste sättet att snabbt bestämma en ungefärlig position visuellt?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Notera när du passerar tvärs ett känt märke på känt avstånd",
        },
        { key: "b", text_sv: "Gissa utifrån hur länge du kört" },
        { key: "c", text_sv: "Det kräver alltid sextant" },
        { key: "d", text_sv: "Position går bara att få från GPS" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "”Tvärs märket X, ca 1 kabellängd av” är en fullt användbar praktisk position — snabb att ta och lätt att pricka i kortet.",
    sourceRef: SOURCE,
    objectiveTitle: "Positionsbestämning",
  },
  {
    index: 5,
    kind: "single_choice",
    stemSv:
      "Sidvind gör att båten driver av kursen (avdrift). Hur kompenserar du praktiskt?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Styr några grader upp mot vinden tills märket ligger stilla i sikten",
        },
        { key: "b", text_sv: "Öka farten tills vinden inte märks" },
        { key: "c", text_sv: "Ignorera det — avdrift jämnar ut sig" },
        { key: "d", text_sv: "Styr rakt mot målet hela tiden (hundkurva)" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Ligg upp i vinden med en avdriftsvinkel i stället för att låta båten gå hundkurva — enslinje eller akterriktmärke visar när du håller linjen.",
    sourceRef: SOURCE,
    objectiveTitle: "Vind- och strömpåverkan",
  },
  {
    index: 6,
    kind: "waypoint_entry",
    stemSv:
      "Instruktören läser upp en waypoint: mata in den exakt. Kontrollera sifferordningen innan du bekräftar.",
    interaction: {
      kind: "waypoint_entry",
      stimulus: {
        kind: "plotter",
        plotter: {
          mode: "normal",
          rangeNm: 2,
          waypoint: { x: 140, y: 90, label_sv: "58°54,3'N 017°33,6'E" },
          note_sv: "Waypoint ANKR: 58°54,3'N 017°33,6'E",
        },
      },
    },
    answerKey: { lat: "58°54,3'N", lon: "017°33,6'E" },
    explanation:
      "Läs tillbaka koordinaten högt före bekräftelse — transponerade siffror är det klassiska waypointfelet.",
    sourceRef: SOURCE,
    objectiveTitle: "Waypointhantering",
  },
  {
    index: 7,
    kind: "single_choice",
    stemSv: "Vad gör plotterns MOB-knapp — och vad gör den INTE?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Sparar positionen och ger styrledning tillbaka — men ersätter inte utkik och manöver",
        },
        { key: "b", text_sv: "Larmar sjöräddningen automatiskt" },
        { key: "c", text_sv: "Stoppar motorn" },
        { key: "d", text_sv: "Kastar i livbojen" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "MOB-knappen fryser positionen där personen föll i — ovärderligt om sikten tappas. Larm, flytredskap och manövern är fortfarande dina uppgifter.",
    sourceRef: SOURCE,
    objectiveTitle: "MOB-funktionen",
  },
];
