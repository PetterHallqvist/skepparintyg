import type { DemoItem } from "../../demo";

/**
 * Seglarintyg 1 — rigg, segel och trim (SPEC §33.1 moduler 1–4). Draft
 * quality, sources marked unverified.
 */

const SOURCE = "Lektion: Seglar 1 — rigg & segel (utkast, ej källgranskad)";

export const RIGG_OCH_SEGEL_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "matching",
    stemSv: "Para ihop riggdelen med dess funktion.",
    interaction: {
      kind: "matching",
      left: [
        { key: "l1", text_sv: "Vant" },
        { key: "l2", text_sv: "Akterstag" },
        { key: "l3", text_sv: "Bom" },
      ],
      right: [
        { key: "r1", text_sv: "Stöttar masten i sidled" },
        { key: "r2", text_sv: "Håller masten akteröver" },
        { key: "r3", text_sv: "Sträcker storseglets underlik" },
      ],
    },
    answerKey: { pairs: { l1: "r1", l2: "r2", l3: "r3" } },
    explanation:
      "Vanten tar sidokrafterna, för- och akterstag längskrafterna, och bommen ger storseglet dess nedre fästpunkt.",
    sourceRef: SOURCE,
    objectiveTitle: "Riggens delar",
  },
  {
    index: 1,
    kind: "matching",
    stemSv: "Para ihop segeldetaljerna med rätt plats i seglet.",
    interaction: {
      kind: "matching",
      left: [
        { key: "l1", text_sv: "Fallhorn" },
        { key: "l2", text_sv: "Skothorn" },
        { key: "l3", text_sv: "Akterlik" },
      ],
      right: [
        { key: "r1", text_sv: "Övre hörnet — där fallet fäster" },
        { key: "r2", text_sv: "Nedre aktre hörnet — där skotet verkar" },
        { key: "r3", text_sv: "Seglets bakre kant" },
      ],
    },
    answerKey: { pairs: { l1: "r1", l2: "r2", l3: "r3" } },
    explanation:
      "Horn = hörn, lik = kanter: fallhorn uppe, halshorn förut nere, skothorn akterut nere; för-, akter- och underlik är kanterna.",
    sourceRef: SOURCE,
    objectiveTitle: "Segeldelarnas namn",
  },
  {
    index: 2,
    kind: "single_choice",
    stemSv: "Hur skapar ett segel framdrivande kraft på kryss?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Som en vinge — tryckskillnaden mellan lä- och lovartssida ger lyftkraft snett framåt",
        },
        { key: "b", text_sv: "Vinden trycker bara seglet framåt som en fallskärm" },
        { key: "c", text_sv: "Kölen drar båten framåt" },
        { key: "d", text_sv: "Det går inte att segla mot vinden alls" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "På kryss arbetar seglet som en vingprofil; kölen omvandlar den sneda kraften till fart framåt och motverkar avdrift. Ren ”fallskärmssegling” gäller bara på läns.",
    sourceRef: SOURCE,
    objectiveTitle: "Segelteori",
  },
  {
    index: 3,
    kind: "single_choice",
    stemSv: "Vad använder du telltails (trimtrådar) på förseglet till?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Att se om luftströmmen ligger an — båda sidors trådar ska strömma jämnt akteröver",
        },
        { key: "b", text_sv: "Att se vindriktningen vid masttoppen" },
        { key: "c", text_sv: "Dekoration" },
        { key: "d", text_sv: "Att mäta vindstyrkan" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Fladdrar lovartstrådarna: styr ned eller skota hem. Fladdrar lätrådarna: styr upp eller släpp. Jämn strömning = rätt trim.",
    sourceRef: SOURCE,
    objectiveTitle: "Segeltrim — grunder",
  },
  {
    index: 4,
    kind: "ordering",
    stemSv: "Ordna momenten när du hissar storseglet vid mastfoten.",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "Gå upp mot vinden så seglet kan lyfta fritt" },
        { key: "b", text_sv: "Lossa kicktalja/skot så bommen är fri" },
        { key: "c", text_sv: "Hissa på fallet tills förliket är sträckt" },
        { key: "d", text_sv: "Skota hem och fall av på kurs" },
      ],
    },
    answerKey: { order: ["a", "b", "c", "d"] },
    explanation:
      "Mot vinden fladdrar seglet fritt under hissningen; med skot och kick lossade går det lätt — sedan trimmas och kursen sätts.",
    sourceRef: SOURCE,
    objectiveTitle: "Hissa segel",
  },
  {
    index: 5,
    kind: "single_choice",
    stemSv: "Vad gör ett rev i storseglet?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Minskar segelytan så båten seglar mer upprätt och lättstyrd i hård vind",
        },
        { key: "b", text_sv: "Gör seglet större för mer fart" },
        { key: "c", text_sv: "Flyttar seglet högre upp" },
        { key: "d", text_sv: "Skyddar seglet mot regn" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Mindre yta = mindre kränghet och roderttryck. En revad båt seglar ofta lika fort men mycket tryggare i frisk vind.",
    sourceRef: SOURCE,
    objectiveTitle: "Revning",
  },
  {
    index: 6,
    kind: "single_choice",
    stemSv:
      "Storseglet fladdrar (lever) längs förliket på kryss trots hemskotat. Vad är trolig orsak?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Du pekar för högt mot vinden — faller du av fylls seglet" },
        { key: "b", text_sv: "För mycket vind" },
        { key: "c", text_sv: "Fel färg på seglet" },
        { key: "d", text_sv: "Kölen är för tung" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Ett levande förlik på hemskotad kryss betyder oftast att du seglar högre än seglets vinkel klarar — fall av några grader.",
    sourceRef: SOURCE,
    objectiveTitle: "Kryssteknik",
  },
  {
    index: 7,
    kind: "single_choice",
    stemSv: "Vilken uppgift har kicktaljan (bomnedhalet)?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Håller ner bommen så akterliket inte öppnar sig — särskilt på slör och läns",
        },
        { key: "b", text_sv: "Hissar bommen vid tilläggning" },
        { key: "c", text_sv: "Sträcker förstaget" },
        { key: "d", text_sv: "Är en reservlina för fallet" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Utan kick lyfter bommen på undanvind, seglet vrider ur sig och båten rullar. Kicken låser bomhöjden och håller profilen.",
    sourceRef: SOURCE,
    objectiveTitle: "Trimredskap",
  },
];
