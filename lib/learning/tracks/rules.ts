import type { DemoItem } from "../demo";
import type { Scene } from "@/lib/trainers/rules-schema";

/**
 * Rules-of-the-road scenario trainer (SPEC §24, §28.8). Each item is a
 * rules_scenario graded stage-by-stage, so a lucky final action never hides a
 * conceptual error. Draft quality, sources unverified.
 */

const SOURCE = "Lektion: Väjningsregler (utkast, ej källgranskad)";

const CLASS = [
  { key: "mote", text_sv: "Möte (stäv mot stäv)" },
  { key: "korsande", text_sv: "Korsande kurser" },
  { key: "upphinnande", text_sv: "Upphinnande" },
  { key: "ej_avgorbar", text_sv: "Går inte att avgöra av tillgänglig information" },
];
const RULE = [
  { key: "give_way", text_sv: "Jag är väjningsskyldig" },
  { key: "stand_on", text_sv: "Jag är kurshållande" },
  { key: "both_alter", text_sv: "Båda ska vika åt styrbord" },
  { key: "cannot_conclude", text_sv: "Kan inte avgöras säkert — agera försiktigt" },
];
const ACTION = [
  { key: "starboard", text_sv: "Gira åt styrbord i god tid" },
  { key: "hold_course", text_sv: "Behåll kurs och fart" },
  { key: "keep_clear", text_sv: "Håll väl undan, passera på säkert avstånd" },
  { key: "slow", text_sv: "Sakta ner / stanna och håll noggrann uppsikt" },
];

const own = (over: Partial<Scene["vessels"][number]> = {}) => ({
  id: "own",
  kind: "power" as const,
  label_sv: "Du",
  x: 100,
  y: 165,
  headingDeg: 0,
  speed: 8,
  isOwn: true,
  status: "underway" as const,
  ...over,
});

function scenario(
  index: number,
  stemSv: string,
  scene: Scene,
  stages: { key: string; prompt_sv: string; options: { key: string; text_sv: string }[] }[],
  correct: Record<string, string>,
  explanation: string,
  objectiveTitle: string,
  stageMisconceptionBySt?: Record<string, string>,
): DemoItem {
  return {
    index,
    kind: "rules_scenario",
    stemSv,
    interaction: { kind: "rules_scenario", stimulus: { kind: "vessel_scene", scene }, stages },
    answerKey: { stages: correct },
    explanation,
    sourceRef: SOURCE,
    objectiveTitle,
    stageMisconceptionBySt,
  };
}

const classStage = {
  key: "classification",
  prompt_sv: "Vilken typ av situation är detta?",
  options: CLASS,
};
const ruleStage = {
  key: "rule",
  prompt_sv: "Vilken skyldighet har du?",
  options: RULE,
};
const actionStage = {
  key: "action",
  prompt_sv: "Vad gör du?",
  options: ACTION,
};

export const RULES_ITEMS: DemoItem[] = [
  scenario(
    0,
    "Ett maskindrivet fartyg kommer rakt emot dig, stäv mot stäv.",
    {
      environment: "day",
      vessels: [own(), { id: "a", kind: "power", label_sv: "M/S Nord", x: 100, y: 45, headingDeg: 180, speed: 8, status: "underway" }],
    },
    [classStage, ruleStage, actionStage],
    { classification: "mote", rule: "both_alter", action: "starboard" },
    "Vid möte stäv mot stäv ska båda fartygen vika åt styrbord och passera babord mot babord.",
    "Väjningsregler — möte",
    { rule: "Vid möte är ingen kurshållande — båda är skyldiga att vika åt styrbord." },
  ),
  scenario(
    1,
    "Ett maskindrivet fartyg närmar sig från din styrbordssida på korsande kurs.",
    {
      environment: "day",
      vessels: [own(), { id: "a", kind: "power", label_sv: "M/S Öst", x: 182, y: 85, headingDeg: 262, speed: 8, status: "underway" }],
    },
    [classStage, ruleStage, actionStage],
    { classification: "korsande", rule: "give_way", action: "starboard" },
    "Vid korsande kurser är fartyget som har det andra om styrbord väjningsskyldigt — gira styrbord och gå akter om.",
    "Väjningsregler — korsande (väjningsskyldig)",
    { action: "Gira styrbord och gå akter om — gira aldrig babord framför ett fartyg som kommer från styrbord." },
  ),
  scenario(
    2,
    "Ett maskindrivet fartyg närmar sig från din babordssida på korsande kurs.",
    {
      environment: "day",
      vessels: [own(), { id: "a", kind: "power", label_sv: "M/S Väst", x: 20, y: 85, headingDeg: 98, speed: 8, status: "underway" }],
    },
    [classStage, ruleStage, actionStage],
    { classification: "korsande", rule: "stand_on", action: "hold_course" },
    "Fartyget som har det andra om babord är kurshållande — behåll kurs och fart, men var beredd att agera om det andra inte viker.",
    "Väjningsregler — korsande (kurshållande)",
    { rule: "När det andra fartyget är om babord är du kurshållande, inte väjningsskyldig." },
  ),
  scenario(
    3,
    "Du kör om ett långsammare fartyg som håller samma kurs som du, rakt förut.",
    {
      environment: "day",
      vessels: [own({ speed: 14 }), { id: "a", kind: "power", label_sv: "M/S Trög", x: 100, y: 95, headingDeg: 0, speed: 5, status: "underway" }],
    },
    [classStage, ruleStage, actionStage],
    { classification: "upphinnande", rule: "give_way", action: "keep_clear" },
    "Den som kör om ska hålla undan för det upphinnade fartyget tills man är väl förbi och klar.",
    "Väjningsregler — upphinnande",
    { classification: "Samma kurs och du kommer ifatt bakifrån — det är upphinnande, inte korsande." },
  ),
  scenario(
    4,
    "Du framförs för motor. Ett segelfartyg närmar sig från styrbord på korsande kurs.",
    {
      environment: "day",
      vessels: [own(), { id: "a", kind: "sailing", label_sv: "S/Y Vind", x: 180, y: 82, headingDeg: 255, speed: 6, status: "underway" }],
    },
    [
      { key: "perception", prompt_sv: "Vilken typ av fartyg är det andra?", options: [
        { key: "segel", text_sv: "Ett segelfartyg" },
        { key: "motor", text_sv: "Ett maskindrivet fartyg" },
        { key: "ankrat", text_sv: "Ett ankrat fartyg" },
      ] },
      ruleStage,
      actionStage,
    ],
    { perception: "segel", rule: "give_way", action: "keep_clear" },
    "Ett maskindrivet fartyg ska normalt hålla undan för ett segelfartyg — håll väl undan.",
    "Väjningsregler — segel och motor",
    { rule: "Maskindrivet fartyg viker för segelfartyg (med undantag som trång farled och upphinnande)." },
  ),
  scenario(
    5,
    "Mörker. Rakt förut ser du både ett rött och ett grönt sidoljus i linje, med vita ljus över.",
    {
      environment: "night",
      vessels: [own(), { id: "a", kind: "power", label_sv: "Okänt", x: 100, y: 45, headingDeg: 180, speed: 8, status: "underway" }],
    },
    [
      { key: "perception", prompt_sv: "Vad visar ljusbilden?", options: [
        { key: "mote_bada", text_sv: "Både rött och grönt förut — stäv mot stäv" },
        { key: "korsande_gron", text_sv: "Bara grönt — det korsar från babord" },
        { key: "upphinnande", text_sv: "Bara ett vitt akterljus — jag kör om" },
      ] },
      ruleStage,
      actionStage,
    ],
    { perception: "mote_bada", rule: "both_alter", action: "starboard" },
    "Ser du både rött och grönt sidoljus samtidigt är fartyget stäv mot stäv — båda viker åt styrbord.",
    "Väjningsregler — natt och ljusbild",
    { perception: "Både rött och grönt sidoljus samtidigt betyder att du ser fartyget rakt förifrån." },
  ),
  scenario(
    6,
    "Tät dimma. Du hör en lång mistlur om babord men ser inget fartyg.",
    {
      environment: "restricted",
      seaRoom_sv: "Öppet vatten, tät dimma.",
      vessels: [own({ speed: 6 })],
    },
    [
      { key: "perception", prompt_sv: "Vad kan du avgöra om det andra fartyget?", options: [
        { key: "inget", text_sv: "Att det finns ett fartyg — inte typ eller exakt position" },
        { key: "motor_styrbord", text_sv: "Att det är ett maskindrivet fartyg om styrbord" },
        { key: "segel", text_sv: "Att det är ett segelfartyg som viker" },
      ] },
      { key: "classification", prompt_sv: "Hur klassar du situationen?", options: CLASS },
      { key: "rule", prompt_sv: "Vilken slutsats om väjning kan du dra?", options: RULE },
      actionStage,
    ],
    { perception: "inget", classification: "ej_avgorbar", rule: "cannot_conclude", action: "slow" },
    "I nedsatt sikt kan du inte avgöra typ eller möte enbart av ljudet — sakta ner till säker fart och var beredd att stanna.",
    "Väjningsregler — nedsatt sikt",
    { classification: "Enbart en ljudsignal räcker inte för att avgöra möte eller korsande — situationen är inte avgörbar." },
  ),
  scenario(
    7,
    "Rakt förut ligger ett fartyg för ankar (visar en runtlysande vit lykta).",
    {
      environment: "day",
      vessels: [own(), { id: "a", kind: "power", label_sv: "M/S Ankar", x: 100, y: 70, headingDeg: 0, speed: 0, status: "anchored" }],
    },
    [
      { key: "perception", prompt_sv: "Vad är det andra fartyget?", options: [
        { key: "ankrat", text_sv: "Ett fartyg för ankar" },
        { key: "motor", text_sv: "Ett maskindrivet fartyg med gång" },
        { key: "segel", text_sv: "Ett segelfartyg med gång" },
      ] },
      actionStage,
    ],
    { perception: "ankrat", action: "keep_clear" },
    "Ett ankrat fartyg ligger stilla — det är inte ett möte i vanlig mening. Håll undan och passera på säkert avstånd.",
    "Väjningsregler — ankrat fartyg",
  ),
];
