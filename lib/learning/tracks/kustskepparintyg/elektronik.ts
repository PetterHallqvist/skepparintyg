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
];
