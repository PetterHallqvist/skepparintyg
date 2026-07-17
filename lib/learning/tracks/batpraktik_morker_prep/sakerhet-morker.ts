import type { DemoItem } from "../../demo";

/**
 * Båtpraktik mörker — säkerhet i mörker: nattseende, MOB och beredskap
 * (SPEC §29 i mörkerkontext). Draft quality, sources marked unverified.
 */

const SOURCE =
  "Lektion: Båtpraktik mörker — säkerhet (utkast, ej källgranskad)";

export const SAKERHET_MORKER_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "single_choice",
    stemSv: "Hur länge tar det för ögat att få full mörkeradaption?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Cirka 20–30 minuter" },
        { key: "b", text_sv: "Några sekunder" },
        { key: "c", text_sv: "Flera timmar" },
        { key: "d", text_sv: "Ögat anpassar sig inte till mörker" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Full mörkeradaption tar 20–30 minuter — men förstörs på sekunder av vitt ljus. Därför är belysningsdisciplin en säkerhetsfråga.",
    sourceRef: SOURCE,
    objectiveTitle: "Nattseende",
  },
  {
    index: 1,
    kind: "multiple_select",
    stemSv:
      "Vilka åtgärder minskar risken att någon faller överbord i mörker? Välj alla som stämmer.",
    interaction: {
      kind: "multiple_select",
      options: [
        { key: "a", text_sv: "Flytväst med ljus/reflex på alla på däck" },
        { key: "b", text_sv: "Regeln ”en hand för dig, en för båten” + säkra rörelsevägar" },
        { key: "c", text_sv: "Säg alltid till rorsman innan du lämnar sittbrunnen" },
        { key: "d", text_sv: "Gå barfota för bättre känsla" },
      ],
    },
    answerKey: { correct: ["a", "b", "c"] },
    explanation:
      "Väst med ljus, trepunktsregeln och att aldrig försvinna ur sittbrunnen oanmäld — i mörker upptäcks ett fall annars först långt senare.",
    sourceRef: SOURCE,
    objectiveTitle: "Fallprevention i mörker",
  },
  {
    index: 2,
    kind: "single_choice",
    stemSv: "Vad gör MOB i mörker så mycket allvarligare än på dagen?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Personen försvinner ur sikte nästan omedelbart — utpekning och position blir allt",
        },
        { key: "b", text_sv: "Vattnet är kallare på natten" },
        { key: "c", text_sv: "Motorn är svagare på natten" },
        { key: "d", text_sv: "Ingen skillnad" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "I mörker tappas visuell kontakt på sekunder. MOB-knapp, ljusboj och en pekare som ALDRIG släpper riktningen är nattens livlinor.",
    sourceRef: SOURCE,
    objectiveTitle: "MOB i mörker",
  },
  {
    index: 3,
    kind: "ordering",
    stemSv: "Man över bord i mörker — ordna de första åtgärderna.",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "Larma högt, kasta ljusboj/flytredskap direkt" },
        { key: "b", text_sv: "Tryck MOB och utse en pekare mot ljudet/ljuset" },
        { key: "c", text_sv: "Vänd enligt inövad metod, låg fart tillbaka" },
        { key: "d", text_sv: "Lys upp personen först i slutskedet — utan att blända rorsman" },
      ],
    },
    answerKey: { order: ["a", "b", "c", "d"] },
    explanation:
      "Flytljuset markerar platsen, MOB-positionen styr tillbaka, och strålkastaren används sent och riktat så rorsmannens nattseende överlever.",
    sourceRef: SOURCE,
    objectiveTitle: "MOB-sekvens i mörker",
  },
  {
    index: 4,
    kind: "single_choice",
    stemSv:
      "Varför sitter utkiken i mörker ofta FRAMME i båten på mindre motorbåtar?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Fri sikt utan rutor/reflexer och närmare eventuella hinder i vattnet",
        },
        { key: "b", text_sv: "Det är varmare där" },
        { key: "c", text_sv: "För att styra med fötterna" },
        { key: "d", text_sv: "Utkik behövs inte om plottern är på" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Vindrutor speglar instrumentljus och äter kontrast. En utkik med fri sikt förut ser bojar, timmer och obelysta båtar tidigare.",
    sourceRef: SOURCE,
    objectiveTitle: "Utkiksplacering",
    misconceptionByKey: {
      d: "Plottern ser varken timmer, ankarliggare utan ljus eller en kajak — utkiken är lagkrav och sunt förnuft.",
    },
  },
  {
    index: 5,
    kind: "single_choice",
    stemSv: "Vilken extra personlig utrustning är klok på däck i mörker?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Pannlampa med RÖTT ljus och en liten vit nödblinklampa/reflex på västen",
        },
        { key: "b", text_sv: "Solglasögon" },
        { key: "c", text_sv: "Extra starkt vitt pannljus, alltid tänt" },
        { key: "d", text_sv: "Ingen skillnad mot dagen" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Rött arbetsljus bevarar nattseendet; ljus/reflex på västen gör DIG hittbar om du hamnar i vattnet.",
    sourceRef: SOURCE,
    objectiveTitle: "Personlig mörkerutrustning",
  },
  {
    index: 6,
    kind: "single_choice",
    stemSv:
      "Kylan kommer snabbare nattetid. Vad är rätt klädstrategi för en mörkertur?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Lager på lager med vind-/vattentätt skal — påklädd INNAN du blir kall",
        },
        { key: "b", text_sv: "Samma kläder som på dagen" },
        { key: "c", text_sv: "Ett tjockt lager är bättre än flera tunna" },
        { key: "d", text_sv: "Kläderna spelar ingen roll på korta turer" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "En nedkyld rorsman fattar sämre beslut. Lagerprincipen + skal, och klä på i förväg — värme du tappat är svår att ta tillbaka ombord.",
    sourceRef: SOURCE,
    objectiveTitle: "Kyla och omdöme",
  },
  {
    index: 7,
    kind: "single_choice",
    stemSv:
      "Ni är på väg hem i mörker och tröttheten smyger sig på. Vad är det sjömansmässiga beslutet?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Byt vid rodret, sänk farten — eller lägg till/ankra och vila om det inte räcker",
        },
        { key: "b", text_sv: "Öka farten så ni kommer hem fortare" },
        { key: "c", text_sv: "Fortsätt — trötthet påverkar inte båtkörning" },
        { key: "d", text_sv: "Släck instrumentbelysningen och kör på känsla" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Trötthet i mörker ger tunnelseende och mikrosömn. Avlösning, lägre fart eller en paus i vik — hellre sent hemma än inte alls.",
    sourceRef: SOURCE,
    objectiveTitle: "Trötthet och beslut",
  },
];
