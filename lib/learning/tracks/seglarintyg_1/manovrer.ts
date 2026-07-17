import type { DemoItem } from "../../demo";

/**
 * Seglarintyg 1 — manövrar: slag, gipp, tilläggning, MOB (SPEC §33.1
 * moduler 5–6, 9). Draft quality, sources marked unverified.
 */

const SOURCE = "Lektion: Seglar 1 — manövrar (utkast, ej källgranskad)";

export const MANOVRER_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "single_choice",
    stemSv: "Vad är skillnaden mellan stagvändning (slag) och gipp?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Slaget vänder fören genom vindögat, gippen vänder aktern genom vinden",
        },
        { key: "b", text_sv: "De är samma manöver åt olika håll" },
        { key: "c", text_sv: "Gipp görs bara i hamn" },
        { key: "d", text_sv: "Slag görs bara med spinnaker" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Slag: upp genom vinden — seglen fladdrar över. Gipp: bort från vinden — bommen slår över med kraft och kräver mer kontroll.",
    sourceRef: SOURCE,
    objectiveTitle: "Slag och gipp",
  },
  {
    index: 1,
    kind: "ordering",
    stemSv: "Ordna momenten i en kontrollerad gipp.",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "”Klart för gipp?” — besättningen bekräftar och sänker huvudena" },
        { key: "b", text_sv: "Skota hem storen mot mitten under giren" },
        { key: "c", text_sv: "”Gippar!” — gira lugnt genom vindögat akterifrån" },
        { key: "d", text_sv: "Släpp ut storen kontrollerat på nya bogen och räta upp" },
      ],
    },
    answerKey: { order: ["a", "b", "c", "d"] },
    explanation:
      "Hemskotad stor gör bommens överslag kort och ofarligt. En okontrollerad gipp är seglingens vanligaste skadeorsak.",
    sourceRef: SOURCE,
    objectiveTitle: "Kontrollerad gipp",
  },
  {
    index: 2,
    kind: "single_choice",
    stemSv:
      "Du fastnar mitt i ett slag — båten stannar rakt mot vinden och vill inte runt. Vad kallas läget och vad gör du?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Du ligger i vindögat — backa förseglet (håll det på gamla sidan) så fören faller av",
        },
        { key: "b", text_sv: "Motorstopp — starta motorn" },
        { key: "c", text_sv: "Kasta ankaret direkt" },
        { key: "d", text_sv: "Släpp alla skot och vänta" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "”I stå” i vindögat: ett backat försegel trycker fören åt sidan. Nästa gång — mer fart in i slaget och en bestämd gir.",
    sourceRef: SOURCE,
    objectiveTitle: "Misslyckat slag",
  },
  {
    index: 3,
    kind: "single_choice",
    stemSv:
      "Hur närmar du dig en brygga UNDER SEGEL för att kunna stanna?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Angör mot vinden och släpp skoten — seglen tappar kraft och båten bromsar in",
        },
        { key: "b", text_sv: "Med vinden i ryggen för bästa kontroll" },
        { key: "c", text_sv: "Med fulla segel och sista-sekunden-gir" },
        { key: "d", text_sv: "Det går inte att lägga till under segel" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Mot vinden är seglens gasreglage skoten: släpp = broms, skota = fart. Medvind till brygga saknar broms helt.",
    sourceRef: SOURCE,
    objectiveTitle: "Tilläggning under segel",
    misconceptionByKey: {
      b: "Med vinden akterifrån kan seglen inte avlastas — du kan inte stanna.",
    },
  },
  {
    index: 4,
    kind: "single_choice",
    stemSv: "Vad är en uppskjutare (”lova upp i vindögat”) bra till?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Att stanna båten på en förutsägbar plats — t.ex. vid boj, MOB eller tilläggning",
        },
        { key: "b", text_sv: "Att öka farten maximalt" },
        { key: "c", text_sv: "Att torka seglen" },
        { key: "d", text_sv: "Den används inte i praktiken" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Uppskjutaren växlar fart mot avstånd rakt mot vinden och slutar i noll fart — seglarens viktigaste ”broms”.",
    sourceRef: SOURCE,
    objectiveTitle: "Uppskjutare",
  },
  {
    index: 5,
    kind: "ordering",
    stemSv: "Ordna quick stop-manövern vid man över bord under segel.",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "Larma, kasta flytredskap, peka — och gå direkt upp i vind" },
        { key: "b", text_sv: "Gå genom vindögat utan att röra förseglets skot" },
        { key: "c", text_sv: "Cirkla ner runt personen på slör/läns" },
        { key: "d", text_sv: "Lova upp i lä om personen och stanna vid sidan" },
      ],
    },
    answerKey: { order: ["a", "b", "c", "d"] },
    explanation:
      "Quick stop håller båten NÄRA personen: direktslag med backat försegel, cirkel runt, och slutlig uppskjutare intill personen.",
    sourceRef: SOURCE,
    objectiveTitle: "MOB — quick stop",
  },
  {
    index: 6,
    kind: "single_choice",
    stemSv:
      "Vilket kommando-svar-mönster används vid slag för att undvika missförstånd?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "”Klart att vända?” — ”Klart!” — ”Vänder!” — momenten görs först efter svaret",
        },
        { key: "b", text_sv: "Rorsman vänder tyst — besättningen får känna det" },
        { key: "c", text_sv: "Alla ropar samtidigt" },
        { key: "d", text_sv: "Kommandon behövs bara vid kappsegling" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Fråga–bekräftelse–verkställighet gör att ingen står med huvudet i bommens väg eller handen i fel skot.",
    sourceRef: SOURCE,
    objectiveTitle: "Kommandon ombord",
  },
  {
    index: 7,
    kind: "single_choice",
    stemSv:
      "På vilken bog är risken för ofrivillig gipp störst — och varför?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Rak läns — en liten vindvridning eller gir kan föra vinden till fel sida om storen",
        },
        { key: "b", text_sv: "Kryss — vinden är starkast där" },
        { key: "c", text_sv: "Halvvind — båten lutar mest" },
        { key: "d", text_sv: "Ofrivillig gipp kan inte inträffa" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "På läns seglar du på gränsen. Segla hellre bred slör i sicksack, håll koll på vindflöjeln — och kicktaljan hårt an.",
    sourceRef: SOURCE,
    objectiveTitle: "Läns och gipprisk",
  },
];
