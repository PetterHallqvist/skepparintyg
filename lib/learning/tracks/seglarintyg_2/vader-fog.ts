import type { DemoItem } from "../../demo";

/**
 * Seglarintyg 2 — dimma, lokalväder och prognos (SPEC §33.2). Draft
 * quality, sources marked unverified.
 */

const SOURCE = "Lektion: Seglar 2 — väder & sikt (utkast, ej källgranskad)";

export const VADER_FOG_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "single_choice",
    stemSv:
      "Varm fuktig luft strömmar in över kall vårsjö. Vilken dimtyp riskerar du?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Advektionsdimma — kan ligga tät och länge över öppet vatten" },
        { key: "b", text_sv: "Strålningsdimma — bara över land om natten" },
        { key: "c", text_sv: "Ingen — dimma bildas inte på våren" },
        { key: "d", text_sv: "Åskdimma" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Sjörök/advektionsdimma uppstår när mild luft kyls av kall vattenyta — klassisk försommarfälla som inte 'bränns bort' som landdimma.",
    sourceRef: SOURCE,
    objectiveTitle: "Dimtyper",
  },
  {
    index: 1,
    kind: "ordering",
    stemSv: "Dimman tätnar under segling. Ordna åtgärderna.",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "Flytväst på alla, sänk farten till säker fart" },
        { key: "b", text_sv: "Sätt lanternor och börja avge ljudsignal (segelfartyg: lång + två korta)" },
        { key: "c", text_sv: "Fastställ position och lägg en plan bort från trafikstråk" },
        { key: "d", text_sv: "Sätt extra utkik/lyssnare i fören" },
      ],
    },
    answerKey: { order: ["a", "b", "c", "d"] },
    explanation:
      "Skydd och fart först, hörs och syns, sedan positionsplan och ökad utkik — örat är ditt bästa instrument i dimma.",
    sourceRef: SOURCE,
    objectiveTitle: "Dimrutin",
  },
  {
    index: 2,
    kind: "single_choice",
    stemSv: "Hur påverkar en sjöbris-cykel dagens seglingsplanering vid kusten?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Svag morgon, ökande pålandsvind under eftermiddagen som dör mot kvällen — planera distanser efter det",
        },
        { key: "b", text_sv: "Sjöbrisen blåser hela dygnet konstant" },
        { key: "c", text_sv: "Sjöbris finns bara på hösten" },
        { key: "d", text_sv: "Sjöbrisen påverkar inte segling" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Solvärmd land drar in havsluft: brisen växer till eftermiddagen (ofta 5–10 m/s) och lägger sig vid solnedgång — lägg långa ben mitt på dagen.",
    sourceRef: SOURCE,
    objectiveTitle: "Sjöbris",
  },
  {
    index: 3,
    kind: "single_choice",
    stemSv: "Vad säger vindökning + vindvrid MOTURS (backning) på norra halvklotet ofta om vädret?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Ett lågtryck/front närmar sig — räkna med försämring" },
        { key: "b", text_sv: "Stabilt högtryck är på väg" },
        { key: "c", text_sv: "Vindriktning säger inget om vädret" },
        { key: "d", text_sv: "Det blir garanterat åska" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Backande, ökande vind + fallande tryck är den klassiska frontsignaturen. Med prognos + barometer + himlen har du tre samstämmiga källor.",
    sourceRef: SOURCE,
    objectiveTitle: "Fronttecken",
  },
  {
    index: 4,
    kind: "single_choice",
    stemSv: "Ett kraftigt bymoln (cumulonimbus) närmar sig under segling. Vad gör du?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Reva i förväg, säkra löst, räkna med kraftiga vindkast och vindvrid när byn passerar",
        },
        { key: "b", text_sv: "Sätter mer segel för att hinna undan" },
        { key: "c", text_sv: "Ingenting — byar syns men känns inte" },
        { key: "d", text_sv: "Går rakt in i molnets centrum där det är lugnast" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Byfronten kan dubbla vindstyrkan på sekunder och vrida 90°. Möt den med litet segel och beredskap — inte med full rigg.",
    sourceRef: SOURCE,
    objectiveTitle: "Byar och åska",
  },
  {
    index: 5,
    kind: "multiple_select",
    stemSv:
      "Vilka källor hör till en bra väderbrief före dagens segling? Välj alla som stämmer.",
    interaction: {
      kind: "multiple_select",
      options: [
        { key: "a", text_sv: "Sjöväderprognos med varningar för området" },
        { key: "b", text_sv: "Prognosens vindstyrka OCH byvind" },
        { key: "c", text_sv: "Egen barometer/observation som referens" },
        { key: "d", text_sv: "Gårdagens väder — det upprepar sig alltid" },
      ],
    },
    answerKey: { correct: ["a", "b", "c"] },
    explanation:
      "Områdesprognos + byvinden (den du seglar i!) + egen observation. Medelvinden ensam underskattar vad riggen möter.",
    sourceRef: SOURCE,
    objectiveTitle: "Väderbrief",
    misconceptionByKey: {
      b: "Byvinden är ofta 30–50 % över medelvinden — det är den som fäller båtar.",
    },
  },
  {
    index: 6,
    kind: "single_choice",
    stemSv: "Du hör en mistlur för om tvärs i dimman men ser inget på plottern (ingen AIS). Vad gör du?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Saktar till styrfart eller stoppar, lyssnar och är beredd att väja — allt har inte AIS",
        },
        { key: "b", text_sv: "Fortsätter — plottern är tom, alltså är sjön tom" },
        { key: "c", text_sv: "Svarar med tre korta" },
        { key: "d", text_sv: "Ökar farten ur området" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "AIS är frivilligt för fritidsbåtar och fiskebåtar kan ha den avstängd. Öron + försiktig fart trumfar en tom skärm (Regel 19).",
    sourceRef: SOURCE,
    objectiveTitle: "Dimma och elektronik",
  },
  {
    index: 7,
    kind: "single_choice",
    stemSv: "Varför ska du veta din exakta position INNAN sikten försvinner?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "I dimman är det för sent att orientera sig visuellt — positionen är din utgångspunkt för allt",
        },
        { key: "b", text_sv: "Det är bara viktigt för loggboken" },
        { key: "c", text_sv: "GPS slutar fungera i dimma" },
        { key: "d", text_sv: "Man behöver ingen position i dimma" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Ser du dimbanken komma: pricka positionen, notera kurs/logg. Därifrån kan du navigera på död räkning + GPS med förtroende.",
    sourceRef: SOURCE,
    objectiveTitle: "Position före sikt",
  },
];
