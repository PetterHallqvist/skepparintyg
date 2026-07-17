import type { DemoItem } from "../../demo";

/**
 * Electronic-chart plotter concept trainer (SPEC §21.5). Five task types on a
 * generic, non-trade-dress plotter mock: overzoom awareness, layer/settings
 * check, waypoint entry with transposition risk, MOB, and GNSS cross-checking.
 * Draft quality, sources unverified.
 */

const SOURCE = "Lektion: Elektroniskt sjökort (utkast, ej källgranskad)";

export const PLOTTER_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "single_choice",
    stemSv:
      "Plottern är kraftigt inzoomad (overzoom). Vad är opålitligt i den här vyn?",
    interaction: {
      kind: "single_choice",
      stimulus: {
        kind: "plotter",
        plotter: { mode: "overzoom", rangeNm: 0.1 },
      },
      options: [
        { key: "a", text_sv: "Detaljnivån — kortet visar mer än datan egentligen stödjer" },
        { key: "b", text_sv: "Kompassrosen är felkalibrerad" },
        { key: "c", text_sv: "Färgerna byter betydelse vid overzoom" },
        { key: "d", text_sv: "Ingenting — mer inzoomat är alltid mer exakt" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Vid overzoom förstoras kortet bortom sin egentliga detaljnivå — positioner och djup kan se exaktare ut än de är.",
    sourceRef: SOURCE,
    objectiveTitle: "Plotter — overzoom",
    misconceptionByKey: {
      d: "Mer inzoomat ger inte mer data — bara större pixlar av samma underlag.",
    },
  },
  {
    index: 1,
    kind: "multiple_select",
    stemSv:
      "Vilka inställningar är lämpliga för en säker visning under övning? Välj alla som stämmer.",
    interaction: {
      kind: "multiple_select",
      stimulus: {
        kind: "plotter",
        plotter: { mode: "normal", rangeNm: 1 },
      },
      options: [
        { key: "a", text_sv: "Visa säkerhetskontur (djupgräns)" },
        { key: "b", text_sv: "Visa grundvarningar" },
        { key: "c", text_sv: "Dölj alla djupsiffror för en renare bild" },
        { key: "d", text_sv: "Behåll en rimlig zoomnivå för området" },
      ],
    },
    answerKey: { correct: ["a", "b", "d"] },
    explanation:
      "Säkerhetskontur, grundvarningar och rimlig zoom hör till en säker vy. Att dölja djupsiffror tar bort viktig information.",
    sourceRef: SOURCE,
    objectiveTitle: "Plotter — inställningar",
  },
  {
    index: 2,
    kind: "waypoint_entry",
    stemSv:
      "Mata in waypointens koordinater exakt som de visas på skärmen. Var noga med siffrorna.",
    interaction: {
      kind: "waypoint_entry",
      stimulus: {
        kind: "plotter",
        plotter: {
          mode: "normal",
          rangeNm: 2,
          waypoint: { x: 165, y: 60, label_sv: "59°12,0'N 018°28,0'E" },
          note_sv: "Waypoint WP1: 59°12,0'N 018°28,0'E",
        },
      },
    },
    answerKey: { lat: "59°12,0'N", lon: "018°28,0'E" },
    explanation:
      "Kontrollera alltid inmatade koordinater mot källan — omkastade siffror (t.ex. 12,0 som 21,0) är ett vanligt fel.",
    sourceRef: SOURCE,
    objectiveTitle: "Plotter — waypointinmatning",
  },
  {
    index: 3,
    kind: "single_choice",
    stemSv: "Vad gör MOB-funktionen på en plotter?",
    interaction: {
      kind: "single_choice",
      stimulus: {
        kind: "plotter",
        plotter: { mode: "normal", rangeNm: 1, showMob: true },
      },
      options: [
        { key: "a", text_sv: "Markerar positionen där någon gått överbord och visar bäring/avstånd dit" },
        { key: "b", text_sv: "Stänger av alla larm" },
        { key: "c", text_sv: "Byter sjökort till nästa blad" },
        { key: "d", text_sv: "Startar autopiloten mot hamn" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "MOB (Man Over Board) markerar ögonblickligt positionen och ger bäring och avstånd tillbaka dit.",
    sourceRef: SOURCE,
    objectiveTitle: "Plotter — MOB",
  },
  {
    index: 4,
    kind: "single_choice",
    stemSv:
      "GNSS-positionen (grön) ligger en bit från vad sjömärken och landkonturer visar. Vad gör du?",
    interaction: {
      kind: "single_choice",
      stimulus: {
        kind: "plotter",
        plotter: {
          mode: "normal",
          rangeNm: 1,
          gnssMarker: { x: 150, y: 70 },
          note_sv: "GNSS-position avviker från visuell kontroll.",
        },
      },
      options: [
        { key: "a", text_sv: "Korskolla mot sjömärken och landkänning — lita inte blint på GNSS" },
        { key: "b", text_sv: "Lita på GNSS — den är alltid rätt" },
        { key: "c", text_sv: "Ignorera skillnaden, den spelar ingen roll" },
        { key: "d", text_sv: "Stäng av plottern helt" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "En GNSS-position kan vara fel (fel datum, störning, gammal fix). Korskolla alltid mot visuella referenser.",
    sourceRef: SOURCE,
    objectiveTitle: "Plotter — korskontroll av position",
    misconceptionByKey: {
      b: "GNSS kan avvika av flera skäl — visuell korskontroll är alltid rätt reflex.",
    },
  },
];
