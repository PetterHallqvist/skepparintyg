import type { DemoItem } from "../../demo";

/**
 * Knot trainer content (SPEC §26). Two knots, each with an ordering task and a
 * spot-the-error task. A screen can't prove physical competence, so status
 * stays "teoretiskt förberedd" (§26.2). Draft quality, sources unverified.
 */

const SOURCE = "Lektion: Knopar (utkast, ej källgranskad)";

const RABAND_STEPS = [
  { key: "s1", text_sv: "Lägg de två tampändarna omlott — vänster över höger." },
  { key: "s2", text_sv: "För den undre tampen runt och upp." },
  { key: "s3", text_sv: "Lägg omlott igen — nu höger över vänster." },
  { key: "s4", text_sv: "Dra åt jämnt så knopen blir symmetrisk." },
];

const PALSTEK_STEPS = [
  { key: "s1", text_sv: "Gör en liten ögla på den fasta parten." },
  { key: "s2", text_sv: "För tampänden upp genom öglan." },
  { key: "s3", text_sv: "För tampen bakom den fasta parten." },
  { key: "s4", text_sv: "För tampen ner genom öglan igen och dra åt." },
];

export const KNOP_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "ordering",
    stemSv: "Ordna stegen för att slå en råbandsknop i rätt följd.",
    interaction: {
      kind: "ordering",
      // Presented scrambled — the learner must recall the sequence.
      items: [RABAND_STEPS[2], RABAND_STEPS[0], RABAND_STEPS[3], RABAND_STEPS[1]],
    },
    answerKey: { order: ["s1", "s2", "s3", "s4"] },
    explanation:
      "Råbandsknopen slås vänster över höger, sedan höger över vänster — annars blir det en kärringknop som glider.",
    sourceRef: SOURCE,
    objectiveTitle: "Knopar — råbandsknop",
  },
  {
    index: 1,
    kind: "single_choice",
    stemSv:
      "Titta på stegen i knopvyn. Ett av stegen är felaktigt beskrivet — vilket?",
    interaction: {
      kind: "single_choice",
      stimulus: {
        kind: "knot_frames",
        knot: {
          name_sv: "Råbandsknop (med ett fel)",
          steps: [
            { caption_sv: "Steg 1: Lägg tamparna omlott — vänster över höger." },
            { caption_sv: "Steg 2: För den undre tampen runt och upp." },
            { caption_sv: "Steg 3: Lägg omlott igen — vänster över höger (samma håll)." },
            { caption_sv: "Steg 4: Dra åt jämnt." },
          ],
        },
      },
      options: [
        { key: "s1", text_sv: "Steg 1" },
        { key: "s2", text_sv: "Steg 2" },
        { key: "s3", text_sv: "Steg 3" },
        { key: "s4", text_sv: "Steg 4" },
      ],
    },
    answerKey: { correct: "s3" },
    explanation:
      "Steg 3 ska vara höger över vänster. Görs det åt samma håll som steg 1 blir det en kärringknop som glider.",
    sourceRef: SOURCE,
    objectiveTitle: "Knopar — råbandsknop",
    misconceptionByKey: {
      s1: "Steg 1 är rätt — felet ligger i att andra omtaget görs åt samma håll.",
    },
  },
  {
    index: 2,
    kind: "ordering",
    stemSv: "Ordna stegen för att slå en pålstek i rätt följd.",
    interaction: {
      kind: "ordering",
      items: [PALSTEK_STEPS[1], PALSTEK_STEPS[3], PALSTEK_STEPS[0], PALSTEK_STEPS[2]],
    },
    answerKey: { order: ["s1", "s2", "s3", "s4"] },
    explanation:
      "Pålsteken: gör öglan, upp genom öglan, bakom fasta parten, ner genom öglan igen. Ger en fast ögla som inte löper.",
    sourceRef: SOURCE,
    objectiveTitle: "Knopar — pålstek",
  },
  {
    index: 3,
    kind: "single_choice",
    stemSv: "Vilket påstående om pålsteken stämmer?",
    interaction: {
      kind: "single_choice",
      stimulus: {
        kind: "knot_frames",
        knot: {
          name_sv: "Pålstek",
          steps: [
            { caption_sv: "Steg 1: Gör en liten ögla på fasta parten." },
            { caption_sv: "Steg 2: För tampänden upp genom öglan." },
            { caption_sv: "Steg 3: Bakom fasta parten." },
            { caption_sv: "Steg 4: Ner genom öglan och dra åt." },
          ],
        },
      },
      options: [
        { key: "a", text_sv: "Den ger en fast ögla som inte löper ihop under belastning." },
        { key: "b", text_sv: "Den är en glidknop som drar åt runt lasten." },
        { key: "c", text_sv: "Den används främst för att skarva två linor." },
        { key: "d", text_sv: "Den lossnar inte ens efter hård belastning." },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Pålsteken ger en fast (icke löpande) ögla — bra för förtöjning. Den går att lossa även efter belastning.",
    sourceRef: SOURCE,
    objectiveTitle: "Knopar — pålstek",
    misconceptionByKey: {
      b: "Pålsteken löper inte — öglan behåller sin storlek under belastning.",
      c: "För att skarva två linor används t.ex. råbandsknop eller skotstek.",
    },
  },
];
