import type { DemoItem } from "../../demo";

/**
 * Seglarintyg 1 — grund (SPEC §33.1). Rigg, bogar, manövrar och sjövett.
 * Draft quality, sources marked unverified — Förhandsversion pending review.
 */

const SOURCE = "Lektion: Seglarintyg 1 — blandat pass (utkast, ej källgranskad)";

export const PASS_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "matching",
    stemSv: "Para ihop delen med dess funktion ombord på en segelbåt.",
    interaction: {
      kind: "matching",
      left: [
        { key: "l1", text_sv: "Förstag" },
        { key: "l2", text_sv: "Fall" },
        { key: "l3", text_sv: "Skot" },
      ],
      right: [
        { key: "r1", text_sv: "Vajern från masttoppen till fören" },
        { key: "r2", text_sv: "Linan som hissar seglet" },
        { key: "r3", text_sv: "Linan som trimmar seglets vinkel mot vinden" },
      ],
    },
    answerKey: { pairs: { l1: "r1", l2: "r2", l3: "r3" } },
    explanation:
      "Förstaget håller masten framåt, fallet hissar seglet, skotet styr seglets vinkel.",
    sourceRef: SOURCE,
    objectiveTitle: "Båtens och riggens delar",
  },
  {
    index: 1,
    kind: "single_choice",
    stemSv:
      "Vinden kommer in snett bakifrån på babordssidan. Vilken bog seglar du på?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Slör för babords halsar" },
        { key: "b", text_sv: "Kryss för styrbords halsar" },
        { key: "c", text_sv: "Halvvind för babords halsar" },
        { key: "d", text_sv: "Läns" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Vind snett bakifrån = slör; vinden in på babordssidan = babords halsar. Halvvind är vind rakt från sidan, läns är vind rakt akterifrån.",
    sourceRef: SOURCE,
    objectiveTitle: "Segelteori och bogar",
    misconceptionByKey: {
      c: "Halvvind är vind tvärs — snett bakifrån är slör.",
    },
  },
  {
    index: 2,
    kind: "ordering",
    stemSv: "Ordna stegen i en stagvändning (slag) i rätt ordning.",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "Kontrollera fritt vatten och ropa ”klart att vända?”" },
        { key: "b", text_sv: "”Vänder!” — lägg rodret i lä" },
        { key: "c", text_sv: "Släpp det gamla försegelskotet när seglet lyfter" },
        { key: "d", text_sv: "Skota hem på nya läsidan och räta upp på ny kurs" },
      ],
    },
    answerKey: { order: ["a", "b", "c", "d"] },
    explanation:
      "Besked till besättningen först, sedan roder i lä, skotbyte genom vindögat och trim på den nya bogen.",
    sourceRef: SOURCE,
    objectiveTitle: "Stagvändning och gipp",
  },
  {
    index: 3,
    kind: "single_choice",
    stemSv:
      "Två segelbåtar närmar sig varandra med vinden in på olika sidor. Vem ska hålla undan?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Båten med vinden in på babordssidan (babords halsar)" },
        { key: "b", text_sv: "Båten med vinden in på styrbordssidan (styrbords halsar)" },
        { key: "c", text_sv: "Den större båten" },
        { key: "d", text_sv: "Den som seglar fortast" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Olika halsar: båten för babords halsar väjer för båten för styrbords halsar (Regel 12).",
    sourceRef: SOURCE,
    objectiveTitle: "Väjningsregler för segelbåt",
    misconceptionByKey: {
      c: "Storlek avgör inte väjningsplikt mellan segelbåtar — halsarna gör det.",
    },
  },
  {
    index: 4,
    kind: "single_choice",
    stemSv: "När bör du reva seglen?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Vid första tanken på att det kan behövas" },
        { key: "b", text_sv: "När båten inte längre går att styra" },
        { key: "c", text_sv: "Bara om det åskar" },
        { key: "d", text_sv: "Aldrig under gång — bara i hamn" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Tumregeln: reva när tanken först slår dig. Ett tidigt rev är lätt att skaka ut — ett sent rev tas i hårt väder med trött besättning.",
    sourceRef: SOURCE,
    objectiveTitle: "Hissa, bärga och reva",
  },
  {
    index: 5,
    kind: "ordering",
    stemSv: "Ordna åtgärderna vid man över bord under segel.",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "Larma ”man över bord!” och peka kontinuerligt" },
        { key: "b", text_sv: "Kasta flytredskap till personen" },
        { key: "c", text_sv: "Genomför inövad återgångsmanöver (t.ex. quick stop)" },
        { key: "d", text_sv: "Närma dig långsamt i lä och ta upp personen" },
      ],
    },
    answerKey: { order: ["a", "b", "c", "d"] },
    explanation:
      "Larm och utpekning först, flythjälp direkt, sedan den inövade manövern — upptagning sker i lä med låg fart.",
    sourceRef: SOURCE,
    objectiveTitle: "Man över bord under segel",
  },
];
