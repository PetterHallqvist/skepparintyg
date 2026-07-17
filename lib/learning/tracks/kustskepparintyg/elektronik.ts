import type { DemoItem } from "../../demo";

/**
 * Kustskeppar — elektronik och korskontroll (SPEC §30 K5). Draft quality,
 * sources marked unverified.
 */

const SOURCE = "Lektion: Kustskeppar — elektronik (utkast, ej källgranskad)";

export const ELEKTRONIK_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "single_choice",
    stemSv:
      "Plottern visar din båt mitt i farleden, men enslinjen akteröver visar tydligt att du ligger söder om leden. Vad gör du?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Litar på det visuella beskedet, korrigerar kursen och utreder plotterns fel efteråt",
        },
        { key: "b", text_sv: "Litar på plottern — GPS är noggrannare än ögat" },
        { key: "c", text_sv: "Tar medelvärdet av de två positionerna" },
        { key: "d", text_sv: "Stannar och startar om plottern direkt" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "En verifierad visuell referens (enslinje) slår en elektronisk position — kortdatum, offset eller GNSS-fel kan alla flytta plotterbilden.",
    sourceRef: SOURCE,
    objectiveTitle: "Korskontroll — elektronik mot verklighet",
    misconceptionByKey: {
      b: "GNSS är oftast bra men inte ofelbar — och kortet under positionen kan också ha fel.",
    },
  },
  {
    index: 1,
    kind: "single_choice",
    stemSv: "Vad är risken med overzoom i ett elektroniskt sjökort?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Bilden ser detaljerad ut fast underlaget inte har mer data — falsk precision",
        },
        { key: "b", text_sv: "Skärmen drar mer ström" },
        { key: "c", text_sv: "Kortet uppdateras långsammare" },
        { key: "d", text_sv: "Positionen försvinner" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Vid overzoom ritas samma grova data större. Grund och stenar mellan djupkurvorna syns inte bättre för att du zoomar.",
    sourceRef: SOURCE,
    objectiveTitle: "Overzoom",
  },
  {
    index: 2,
    kind: "multiple_select",
    stemSv:
      "Vilka inställningar bör du kontrollera på plottern före en mörkerpassage? Välj alla som stämmer.",
    interaction: {
      kind: "multiple_select",
      options: [
        { key: "a", text_sv: "Nattläge/dämpad belysning" },
        { key: "b", text_sv: "Säkerhetsdjup/djupskuggning för din båt" },
        { key: "c", text_sv: "Att alla AIS- och fyrlager är tända" },
        { key: "d", text_sv: "Skalberoende detaljnivå (inte avstängda lager av misstag)" },
      ],
    },
    answerKey: { correct: ["a", "b", "d"] },
    explanation:
      "Nattläge bevarar mörkerseendet; säkerhetsdjupet färgar farligt vatten; och släckta lager har orsakat verkliga grundstötningar. ”Alla lager på” är däremot inte ett mål i sig — röran kan dölja det viktiga.",
    sourceRef: SOURCE,
    objectiveTitle: "Plotterinställningar",
  },
  {
    index: 3,
    kind: "single_choice",
    stemSv: "Vilken är ekolodets viktigaste roll vid kustnavigering?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "En oberoende rimlighetskontroll — stämmer djupet med kortet där jag tror att jag är?",
        },
        { key: "b", text_sv: "Att hitta fisk" },
        { key: "c", text_sv: "Att mäta farten genom vattnet" },
        { key: "d", text_sv: "Att ersätta sjökortet i trånga vatten" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Djupet är en positionssignal: om ekolodet visar 4 m där kortet säger 20 m är något fel — position, kort eller båda. Reagera direkt.",
    sourceRef: SOURCE,
    objectiveTitle: "Ekolod som korskontroll",
  },
  {
    index: 4,
    kind: "single_choice",
    stemSv: "Vad är radarns största styrka för en fritidsskeppare — och dess klassiska fälla?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Ser trafik och land i mörker/dimma — men små träbåtar, regn och sjöeko kan dölja mål",
        },
        { key: "b", text_sv: "Den visar alltid allt — inga begränsningar" },
        { key: "c", text_sv: "Den fungerar bara i dagsljus" },
        { key: "d", text_sv: "Den ersätter utkiken helt" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Radarn är suverän i nedsatt sikt men har skuggor: svaga radarmål, sjö- och regnekon. Den kompletterar utkiken — aldrig tvärtom.",
    sourceRef: SOURCE,
    objectiveTitle: "Radar",
  },
  {
    index: 5,
    kind: "single_choice",
    stemSv: "Varför syns inte alla båtar på AIS?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "AIS är frivilligt för fritidsbåtar och många mindre fartyg saknar eller stänger av sändare",
        },
        { key: "b", text_sv: "AIS visar bara båtar över 100 m" },
        { key: "c", text_sv: "AIS fungerar inte i skärgård" },
        { key: "d", text_sv: "Alla båtar syns alltid på AIS" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Sändningsplikten gäller yrkessjöfart (klass A). En tom AIS-bild betyder inte tomt vatten — utkik och radar täcker resten.",
    sourceRef: SOURCE,
    objectiveTitle: "AIS begränsningar",
  },
  {
    index: 6,
    kind: "multiple_select",
    stemSv:
      "Elförsörjningen viker under gång. Vilka åtgärder är rimliga för att skydda navigationsförmågan? Välj alla som stämmer.",
    interaction: {
      kind: "multiple_select",
      options: [
        { key: "a", text_sv: "Prioritera lanternor och VHF, släck komfortförbrukare" },
        { key: "b", text_sv: "Notera position på papper innan skärmarna dör" },
        { key: "c", text_sv: "Ha handhållen GPS/telefon med sjökortsapp som reserv" },
        { key: "d", text_sv: "Stäng av lanternorna först — de drar mest" },
      ],
    },
    answerKey: { correct: ["a", "b", "c"] },
    explanation:
      "Syns + hörs + vet var du är: lanternor och VHF sist av allt att offra; papperslogg och en oberoende reservkälla räddar navigationen.",
    sourceRef: SOURCE,
    objectiveTitle: "Elberedskap",
  },
  {
    index: 7,
    kind: "single_choice",
    stemSv: "Vilken referensnivå anges djupen i moderna svenska sjökort mot?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Medelvattenstånd (ungefär) — verkligt djup varierar med vattenståndet" },
        { key: "b", text_sv: "Högsta högvatten" },
        { key: "c", text_sv: "Kölens djupgående" },
        { key: "d", text_sv: "Djupen är exakta i alla lägen" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Kortdjup är relativa en referensnivå (i Östersjön nära medelvattenstånd). Lågt vattenstånd kan ge betydligt mindre vatten än siffran — räkna med marginal.",
    sourceRef: SOURCE,
    objectiveTitle: "Djupreferens",
  },
];
