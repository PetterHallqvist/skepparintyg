import type { DemoItem } from "../../demo";

/**
 * Seglarintyg 3 — offshoreplanering, vakter och rutiner (SPEC §33.3).
 * Draft quality, sources marked unverified.
 */

const SOURCE = "Lektion: Seglar 3 — offshore (utkast, ej källgranskad)";

export const OFFSHORE_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "single_choice",
    stemSv: "Vad kännetecknar ett fungerande vaktsystem för en liten besättning (2–4) på överfart?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Fasta pass med skyddad sovtid, tydlig överlämning och anpassning efter väder",
        },
        { key: "b", text_sv: "Alla är vakna tills alla är trötta" },
        { key: "c", text_sv: "Skepparen tar alla nätter själv" },
        { key: "d", text_sv: "Autopiloten tar nattvakten" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "T.ex. 3 h natt / 4 h dag: förutsägbar vila är det enda som håller omdömet intakt dygn två. Skyddad sovtid är helig.",
    sourceRef: SOURCE,
    objectiveTitle: "Vaktsystem",
  },
  {
    index: 1,
    kind: "multiple_select",
    stemSv: "Vad ingår i en bra vaktöverlämning? Välj alla som stämmer.",
    interaction: {
      kind: "multiple_select",
      options: [
        { key: "a", text_sv: "Kurs, fart och nästa girpunkt" },
        { key: "b", text_sv: "Trafik i sikte/på AIS och väderutveckling" },
        { key: "c", text_sv: "Segelföring och när nästa rev tas" },
        { key: "d", text_sv: "Vad som serverades till middag" },
      ],
    },
    answerKey: { correct: ["a", "b", "c"] },
    explanation:
      "Navigationsläge, omvärld och segelplan — pålästa fem minuter som gör att den nya vakten äger läget från minut ett.",
    sourceRef: SOURCE,
    objectiveTitle: "Vaktöverlämning",
  },
  {
    index: 2,
    kind: "ordering",
    stemSv: "Ordna offshore-planeringens huvudsteg inför en 30-timmarsöverfart.",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "Väderfönster: prognoskedja + reservdygn — beslut om avgång" },
        { key: "b", text_sv: "Rutt med waypoints, faror, alternativhamnar längs vägen" },
        { key: "c", text_sv: "Båtförberedelse: rigg-, säkerhets- och proviantgenomgång" },
        { key: "d", text_sv: "Besättningsbrief: vakter, roller, MOB- och nödrutiner" },
      ],
    },
    answerKey: { order: ["a", "b", "c", "d"] },
    explanation:
      "Vädret styr OM, rutten VAR, båten och besättningen HUR. Alternativhamnarna gör planen levande i stället för binär.",
    sourceRef: SOURCE,
    objectiveTitle: "Överfartsplanering",
  },
  {
    index: 3,
    kind: "single_choice",
    stemSv: "Varför är sömnbrist ett sjösäkerhetsproblem snarare än en komfortfråga?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Omdöme, reaktionstid och utkik degraderar som vid berusning — utan att man märker det själv",
        },
        { key: "b", text_sv: "Man blir bara lite gäspig" },
        { key: "c", text_sv: "Sömnbrist påverkar inte vana seglare" },
        { key: "d", text_sv: "Kaffe eliminerar effekten helt" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Efter ~20 vakna timmar presterar hjärnan som vid promillenivå. Vaktsystemet är kuren; koffein bara lånar tid.",
    sourceRef: SOURCE,
    objectiveTitle: "Trötthet offshore",
  },
  {
    index: 4,
    kind: "single_choice",
    stemSv: "Hur hanterar du proviant och mat under längre gång i sjögång?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Förbered enkel varm mat och snacks i förväg — lättåtkomligt utan stort kökarbete",
        },
        { key: "b", text_sv: "Laga trerätters på fast rutin oavsett väder" },
        { key: "c", text_sv: "Ingen mat — fastande besättning är piggare" },
        { key: "d", text_sv: "Bara energidryck" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Termosmat, färdiga mackor och vattenflaskor per person: energi och vätska utan att någon står i pentryt i sjögång.",
    sourceRef: SOURCE,
    objectiveTitle: "Proviantering",
  },
  {
    index: 5,
    kind: "single_choice",
    stemSv: "Vilken roll har loggboken på en modern överfart med plotter?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Regelbundna positioner + händelser på papper — din backup när elektroniken dör och ditt beslutsunderlag",
        },
        { key: "b", text_sv: "Ren nostalgi" },
        { key: "c", text_sv: "Endast juridiskt krav för yrkesfartyg" },
        { key: "d", text_sv: "Plottern loggar allt — papper behövs aldrig" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "En position i timmen på papper gör ett elbortfall till en olägenhet i stället för en kris — död räkning startar från sista raden.",
    sourceRef: SOURCE,
    objectiveTitle: "Loggbok",
  },
  {
    index: 6,
    kind: "single_choice",
    stemSv: "Vad är 'angöring' i offshore-sammanhang och varför planeras den extra noga?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Mötet med kusten efter öppet vatten — tröttheten är störst och farorna tätnar just där",
        },
        { key: "b", text_sv: "Första kaffet på morgonen" },
        { key: "c", text_sv: "Att hissa gästflagg" },
        { key: "d", text_sv: "Ett moment utan särskilda risker" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Flest misstag sker sista timmarna: planera angöringen i förväg (fyrar, leder, plan B), gärna tajmad till dagsljus.",
    sourceRef: SOURCE,
    objectiveTitle: "Angöring",
  },
  {
    index: 7,
    kind: "single_choice",
    stemSv: "Hur håller ni land/anhöriga informerade på ett bra sätt under överfarten?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "En utsedd landkontakt med färdplan och avtalade rapporttider + tydlig larminstruktion",
        },
        { key: "b", text_sv: "Ingen kontakt — det stör friheten" },
        { key: "c", text_sv: "Kontinuerlig videosändning" },
        { key: "d", text_sv: "Bara ett SMS vid framkomst, oavsett längd" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Färdplan + avtalade rapporttider gör att utebliven kontakt ger snabb, riktad hjälp — utan falsklarm för en död telefon.",
    sourceRef: SOURCE,
    objectiveTitle: "Landkontakt",
  },
  {
    index: 8,
    kind: "multiple_select",
    stemSv:
      "Vad hör hemma i en grab bag (nödsäck) inför en överfart? Välj alla som stämmer.",
    interaction: {
      kind: "multiple_select",
      options: [
        { key: "a", text_sv: "Handhållen VHF och nödsändare (PLB/EPIRB)" },
        { key: "b", text_sv: "Vatten, nödraketer och termofilt" },
        { key: "c", text_sv: "Kopior av dokument + telefon i vattentätt fodral" },
        { key: "d", text_sv: "Båtens verktygslåda" },
      ],
    },
    answerKey: { correct: ["a", "b", "c"] },
    explanation:
      "Nödsäcken packas för livflotten: larma (VHF/nödsändare), synas (pyroteknik), överleva (vatten/värme), identifieras (dokument). Verktyg stannar ombord.",
    sourceRef: SOURCE,
    objectiveTitle: "Grab bag",
  },
  {
    index: 9,
    kind: "single_choice",
    stemSv:
      "Varför följer du en PROGNOSKEDJA (flera prognoser över tid) i stället för en enda färsk prognos före avgång?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Stabilitet mellan körningar visar hur säker prognosen är — hoppar den runt är osäkerheten stor",
        },
        { key: "b", text_sv: "Äldre prognoser är alltid bättre" },
        { key: "c", text_sv: "Det är bara en vana utan värde" },
        { key: "d", text_sv: "En prognos i veckan räcker" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Prognosens FÖRÄNDRING är en osäkerhetsmätare: konvergerar körningarna kan du lita på fönstret — spretar de planerar du med större marginal.",
    sourceRef: SOURCE,
    objectiveTitle: "Prognoskedja",
  },
];
