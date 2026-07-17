import type { DemoItem } from "../../demo";

/**
 * SRC — nöd-, il- och varningstrafik + GMDSS (SPEC §31 R5–R7). Draft
 * quality, sources marked unverified.
 */

const SOURCE = "Lektion: SRC — nödtrafik (utkast, ej källgranskad)";

export const NOD_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "single_choice",
    stemSv: "När får du sända MAYDAY?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "När fartyg eller människoliv är i allvarlig och överhängande fara och omedelbar hjälp behövs",
        },
        { key: "b", text_sv: "När motorn stannat men läget är lugnt" },
        { key: "c", text_sv: "När du vill nå kustradion snabbt" },
        { key: "d", text_sv: "Vid alla sjukdomsfall ombord" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "MAYDAY är reserverat för allvarlig, överhängande fara. Motorstopp i lugnt väder är typisk PAN-PAN- eller assistanssituation.",
    sourceRef: SOURCE,
    objectiveTitle: "Nöd — kriterier",
    misconceptionByKey: {
      b: "Motorstopp utan fara är inte nöd — överväg PAN-PAN eller assistans.",
    },
  },
  {
    index: 1,
    kind: "matching",
    stemSv: "Para ihop signalordet med situationen.",
    interaction: {
      kind: "matching",
      left: [
        { key: "l1", text_sv: "MAYDAY" },
        { key: "l2", text_sv: "PAN-PAN" },
        { key: "l3", text_sv: "SÉCURITÉ" },
      ],
      right: [
        { key: "r1", text_sv: "Överhängande fara för liv eller fartyg" },
        { key: "r2", text_sv: "Brådskande läge — men inte omedelbar livsfara" },
        { key: "r3", text_sv: "Varning: navigations- eller vädermeddelande" },
      ],
    },
    answerKey: { pairs: { l1: "r1", l2: "r2", l3: "r3" } },
    explanation:
      "Tre nivåer: nöd (MAYDAY), il (PAN-PAN), varning (SÉCURITÉ) — valet styr vilken prioritet trafiken får.",
    sourceRef: SOURCE,
    objectiveTitle: "Nöd, il och varning",
  },
  {
    index: 2,
    kind: "single_choice",
    stemSv: "Vad betyder ”MAYDAY RELAY”?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "En station vidarebefordrar någon annans nödmeddelande",
        },
        { key: "b", text_sv: "Nöden är över" },
        { key: "c", text_sv: "Ett test av nödkanalen" },
        { key: "d", text_sv: "Nödanropet upprepas var femte minut" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Hör du en nöd som ingen besvarar — eller ser en nöd utan egen radio inblandad — sänder du MAYDAY RELAY och för nöden vidare.",
    sourceRef: SOURCE,
    objectiveTitle: "Nöd — vidarebefordran",
  },
  {
    index: 3,
    kind: "single_choice",
    stemSv: "Vem leder nödtrafiken efter ett MAYDAY?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Sjöräddningscentralen (eller nödställd/annan station tills den tar över)",
        },
        { key: "b", text_sv: "Den som har starkast sändare" },
        { key: "c", text_sv: "Närmaste handelsfartyg, alltid" },
        { key: "d", text_sv: "Ingen — alla sänder fritt" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Nödtrafiken har en ledande station — normalt sjöräddningscentralen (JRCC). Övriga håller radiotystnad tills de kallas in (SEELONCE MAYDAY).",
    sourceRef: SOURCE,
    objectiveTitle: "Nödtrafikens ledning",
  },
  {
    index: 4,
    kind: "ordering",
    stemSv:
      "Du trycker DSC-nödknappen. Ordna vad som händer/vad du gör därefter.",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "Radion sänder nödlarmet (MMSI + position) på kanal 70" },
        { key: "b", text_sv: "Radion går själv till kanal 16" },
        { key: "c", text_sv: "Du sänder talat MAYDAY på kanal 16" },
        { key: "d", text_sv: "Du inväntar kvittens och svarar på frågor" },
      ],
    },
    answerKey: { order: ["a", "b", "c", "d"] },
    explanation:
      "DSC-larmet är dörrknackningen; själva nödmeddelandet lämnar du med tal på 16, och sedan leder kvittensen trafiken vidare.",
    sourceRef: SOURCE,
    objectiveTitle: "DSC-nödlarm",
  },
  {
    index: 5,
    kind: "single_choice",
    stemSv: "Du råkar sända ett falskt DSC-nödlarm. Vad ska du göra?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Avbryt enligt radions rutin och annullera med tal på kanal 16: ”annullera mitt nödlarm” + MMSI/namn",
        },
        { key: "b", text_sv: "Stänga av radion och hoppas att ingen såg" },
        { key: "c", text_sv: "Ingenting — systemet filtrerar bort misstag" },
        { key: "d", text_sv: "Sända ett nytt larm som tar ut det första" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Ett oannullerat falsklarm kan dra igång en verklig räddningsinsats. Annullera direkt — misstag är förlåtligt, tystnad är det inte.",
    sourceRef: SOURCE,
    objectiveTitle: "Falsklarm",
    misconceptionByKey: {
      b: "Larmet bär din MMSI — att tiga binder räddningsresurser i onödan.",
    },
  },
  {
    index: 6,
    kind: "matching",
    stemSv: "Para ihop GMDSS-utrustningen med dess funktion.",
    interaction: {
      kind: "matching",
      left: [
        { key: "l1", text_sv: "EPIRB" },
        { key: "l2", text_sv: "SART" },
        { key: "l3", text_sv: "NAVTEX" },
      ],
      right: [
        { key: "r1", text_sv: "Nödsändare via satellit — larmar med position" },
        { key: "r2", text_sv: "Radartransponder som syns på räddarens radar" },
        { key: "r3", text_sv: "Mottagare för navigations- och vädervarningar i text" },
      ],
    },
    answerKey: { pairs: { l1: "r1", l2: "r2", l3: "r3" } },
    explanation:
      "EPIRB larmar globalt via satellit, SART gör dig synlig för räddaren på radar, NAVTEX levererar varningar till mottagaren.",
    sourceRef: SOURCE,
    objectiveTitle: "GMDSS-utrustning",
  },
  {
    index: 7,
    kind: "single_choice",
    stemSv:
      "Vilken uppgift är VIKTIGAST att få med om ett nödmeddelande måste kortas?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Positionen" },
        { key: "b", text_sv: "Båtens färg" },
        { key: "c", text_sv: "Försäkringsbolag" },
        { key: "d", text_sv: "Hemmahamn" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Utan position ingen räddning. Identitet + position är nödmeddelandets kärna — allt annat kan kompletteras i efterhand.",
    sourceRef: SOURCE,
    objectiveTitle: "Nödmeddelandets innehåll",
  },
];
