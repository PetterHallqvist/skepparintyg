import type { DemoItem } from "../../demo";

/**
 * Seglarintyg 1 — sjövett: väjning under segel, knopar, väder och omdöme
 * (SPEC §33.1 moduler 7–8, 10). Draft quality, sources marked unverified.
 */

const SOURCE = "Lektion: Seglar 1 — sjövett (utkast, ej källgranskad)";

export const SJOVETT_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "single_choice",
    stemSv:
      "Två segelbåtar på SAMMA halsar närmar sig varandra. Vem håller undan?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Lovartsbåten väjer för läbåten" },
        { key: "b", text_sv: "Läbåten väjer för lovartsbåten" },
        { key: "c", text_sv: "Den mindre båten" },
        { key: "d", text_sv: "Den som kommer söderifrån" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Samma halsar: lovart väjer för lä (Regel 12). Olika halsar: babords halsar väjer för styrbords.",
    sourceRef: SOURCE,
    objectiveTitle: "Väjning segel mot segel",
  },
  {
    index: 1,
    kind: "single_choice",
    stemSv:
      "Du seglar och en motorbåt närmar sig från styrbord. Vem väjer i normalfallet?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Motorbåten — maskindrivet väjer för segelfartyg (med kända undantag)",
        },
        { key: "b", text_sv: "Du — allt från styrbord har företräde" },
        { key: "c", text_sv: "Den största båten" },
        { key: "d", text_sv: "Ingen behöver väja" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Maskindrivet håller undan för segel (Regel 18) — men undantagen finns: du får inte hindra fartyg i trång farled, fiskande eller upphinnbara du själv hinner upp.",
    sourceRef: SOURCE,
    objectiveTitle: "Segel mot maskindrivet",
    misconceptionByKey: {
      b: "Styrbordsregeln gäller mellan maskindrivna — segel/motor styrs av Regel 18.",
    },
  },
  {
    index: 2,
    kind: "single_choice",
    stemSv:
      "En seglande båt hinner upp en långsammare motorbåt akterifrån. Vem väjer?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Segelbåten — upphinnande fartyg väjer alltid, även under segel",
        },
        { key: "b", text_sv: "Motorbåten — motor väjer alltid för segel" },
        { key: "c", text_sv: "Båda ska stanna" },
        { key: "d", text_sv: "Den som är närmast land" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Upphinnanderegeln (Regel 13) slår segelprivilegiet: den som hinner upp håller undan, oavsett framdrivning.",
    sourceRef: SOURCE,
    objectiveTitle: "Upphinnande",
  },
  {
    index: 3,
    kind: "matching",
    stemSv: "Para ihop knopen med dess klassiska användning ombord.",
    interaction: {
      kind: "matching",
      left: [
        { key: "l1", text_sv: "Pålstek" },
        { key: "l2", text_sv: "Skotstek" },
        { key: "l3", text_sv: "Dubbelt halvslag om egen part" },
      ],
      right: [
        { key: "r1", text_sv: "Fast ögla som inte glider — t.ex. i förtöjning" },
        { key: "r2", text_sv: "Sammanfogar två tampar, även olika grova" },
        { key: "r3", text_sv: "Gör fast en tamp runt påle eller ring" },
      ],
    },
    answerKey: { pairs: { l1: "r1", l2: "r2", l3: "r3" } },
    explanation:
      "Pålstekens ögla låser utan att glida, skotsteken binder tampar ihop, och dubbla halvslaget är den snabba fästknopen.",
    sourceRef: SOURCE,
    objectiveTitle: "Knopar",
  },
  {
    index: 4,
    kind: "ordering",
    stemSv: "Ordna stegen i ett råbandsknop (två tampändar).",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "Höger ände över och under vänster" },
        { key: "b", text_sv: "Vänster ände över och under höger" },
        { key: "c", text_sv: "Dra åt jämnt — ändarna ska ligga parallellt med sin egen part" },
      ],
    },
    answerKey: { order: ["a", "b", "c"] },
    explanation:
      "Höger-över, vänster-över — ligger ändarna korsade blev det en ”käringknut” som glider.",
    sourceRef: SOURCE,
    objectiveTitle: "Råbandsknop",
  },
  {
    index: 5,
    kind: "single_choice",
    stemSv:
      "Vinden ökar och gastarna börjar se oroliga ut. Vilket är förarens bästa FÖRSTA drag?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Reva/minska segel och välj en lugnare kurs — trygg besättning seglar bättre",
        },
        { key: "b", text_sv: "Fortsätt oförändrat — de vänjer sig" },
        { key: "c", text_sv: "Skota hem allt hårdare" },
        { key: "d", text_sv: "Be alla gå under däck" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Besättningens trygghet är en säkerhetsparameter. Mindre segel och mindre kränghet gör alla — inklusive båten — mer kontrollerade.",
    sourceRef: SOURCE,
    objectiveTitle: "Omdöme och besättning",
  },
  {
    index: 6,
    kind: "single_choice",
    stemSv: "Varför är byiga fralandsvindar (från land) förrädiska för seglare?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Nära land känns det lugnt — längre ut står sjö och hårdare vind du inte ser därifrån",
        },
        { key: "b", text_sv: "De byter alltid till pålandsvind vid lunch" },
        { key: "c", text_sv: "De innehåller mindre syre" },
        { key: "d", text_sv: "De är inte förrädiska" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Frånlandsvind döljer sin styrka i lä av land och blåser dig UT från skydd. Bedöm vinden längre ut — inte vid bryggan.",
    sourceRef: SOURCE,
    objectiveTitle: "Väder för seglare",
  },
  {
    index: 7,
    kind: "single_choice",
    stemSv: "Vilken kurs är oftast bekvämast att INLEDA en segeltur med i frisk vind — och varför?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Kryss ut, slör hem — motvinden tas med utvilad besättning och hemresan blir lätt",
        },
        { key: "b", text_sv: "Läns ut, kryss hem" },
        { key: "c", text_sv: "Spelar ingen roll" },
        { key: "d", text_sv: "Alltid rakt mot målet oavsett vind" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Klassisk planering: ta det jobbiga (kryssen) först. Om något händer eller alla tröttnar är hemvägen då den snabba och enkla.",
    sourceRef: SOURCE,
    objectiveTitle: "Turplanering",
  },
];
