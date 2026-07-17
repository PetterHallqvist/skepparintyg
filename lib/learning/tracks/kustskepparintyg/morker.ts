import type { DemoItem } from "../../demo";

/**
 * Kustskeppar — mörker och nedsatt sikt (SPEC §30 K6). Draft quality,
 * sources marked unverified.
 */

const SOURCE = "Lektion: Kustskeppar — mörker (utkast, ej källgranskad)";

export const MORKER_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "single_choice",
    stemSv:
      "I mörker ser du ett rött ljus över ett vitt ljus, båda runtlysande. Vad kan det vara?",
    interaction: {
      kind: "single_choice",
      stimulus: { kind: "light_scene", config: "pilot_vessel", animated: false },
      options: [
        { key: "a", text_sv: "Ett lotsfartyg i tjänst" },
        { key: "b", text_sv: "Ett fartyg på ingående i hamn" },
        { key: "c", text_sv: "Ett ankrat fartyg över 50 m" },
        { key: "d", text_sv: "En fiskebåt som trålar" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Vitt över rött, runtlysande — lotsfartyg i tjänst (minnesregel: ”white over red, pilot ahead”). Trålare visar grönt över vitt.",
    sourceRef: SOURCE,
    objectiveTitle: "Ljusbilder — särskilda fartyg",
    misconceptionByKey: {
      d: "Trålande fartyg visar grönt över vitt — inte rött över vitt.",
    },
  },
  {
    index: 1,
    kind: "matching",
    stemSv: "Para ihop ljuskombinationen med fartyget (runtlysande ljus).",
    interaction: {
      kind: "matching",
      left: [
        { key: "l1", text_sv: "Grönt över vitt" },
        { key: "l2", text_sv: "Rött över rött" },
        { key: "l3", text_sv: "Rött–vitt–rött" },
      ],
      right: [
        { key: "r1", text_sv: "Fartyg som trålar" },
        { key: "r2", text_sv: "Ej manöverfärdigt fartyg" },
        { key: "r3", text_sv: "Fartyg med begränsad manöverförmåga" },
      ],
    },
    answerKey: { pairs: { l1: "r1", l2: "r2", l3: "r3" } },
    explanation:
      "Grön/vit = trål; röd/röd = ej manöverfärdig (”red over red, the captain is dead”); röd/vit/röd = begränsad manöverförmåga.",
    sourceRef: SOURCE,
    objectiveTitle: "Ljusbilder — särskilda fartyg",
  },
  {
    index: 2,
    kind: "single_choice",
    stemSv:
      "Du närmar dig en farled i mörker och ska identifiera en fyr med karaktären Fl(2) WRG 10s. Vad betyder WRG?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Fyren har vit, röd och grön sektor" },
        { key: "b", text_sv: "Fyren blinkar växelvis vitt, rött och grönt" },
        { key: "c", text_sv: "Fyren är släckt vid gryning" },
        { key: "d", text_sv: "Fyren har tre ljuskällor på olika höjd" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "WRG anger sektorfärgerna: vilken färg DU ser beror på var du befinner dig — karaktären (Fl(2) 10s) är densamma i alla sektorer.",
    sourceRef: SOURCE,
    objectiveTitle: "Fyrsektorer",
    misconceptionByKey: {
      b: "Fyren växlar inte färg i tiden — färgen beror på din position i sektorerna.",
    },
  },
  {
    index: 3,
    kind: "single_choice",
    stemSv:
      "I nedsatt sikt hör du ETT långt + TVÅ korta ljud snett om babord. Vad kan det vara?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Bl.a. ett segelfartyg, fiskefartyg eller fartyg med begränsad manöverförmåga",
        },
        { key: "b", text_sv: "Ett maskindrivet fartyg med fart i vattnet" },
        { key: "c", text_sv: "Ett ankrat fartyg" },
        { key: "d", text_sv: "En fyr med mistlur" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Lång + två korta är samlingssignalen för bl.a. segelfartyg, fiskefartyg, ej manöverfärdiga och fartyg med begränsad manöverförmåga (Regel 35).",
    sourceRef: SOURCE,
    objectiveTitle: "Ljudsignaler i nedsatt sikt",
  },
  {
    index: 4,
    kind: "ordering",
    stemSv:
      "Sikten faller snabbt till under 100 m i skärgårdstrafik. Ordna åtgärderna.",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "Sänk till säker fart och sätt lanternor" },
        { key: "b", text_sv: "Börja avge föreskriven ljudsignal och skärp utkiken" },
        { key: "c", text_sv: "Fastställ positionen och notera den" },
        { key: "d", text_sv: "Överväg att gå ur farleden och ankra på säkert vatten" },
      ],
    },
    answerKey: { order: ["a", "b", "c", "d"] },
    explanation:
      "Fart och synlighet först, sedan hörbarhet/utkik, säkra positionen — och ta ställning till om det är klokare att vänta ut sikten.",
    sourceRef: SOURCE,
    objectiveTitle: "Nedsatt sikt — åtgärder",
  },
  {
    index: 5,
    kind: "single_choice",
    stemSv:
      "Varför planerar man mörkerangöring mot en ledfyr hellre än mot obelyst kust?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Fyrens sektorer och karaktär ger kontrollerbar ledning hela vägen in",
        },
        { key: "b", text_sv: "Det går fortare" },
        { key: "c", text_sv: "GPS fungerar bättre nära fyrar" },
        { key: "d", text_sv: "Obelyst kust är alltid förbjuden att angöra" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "En ledfyr ger dig både riktning (vit sektor/ensriktning) och varning (färgskifte) — obelyst kust ger ingen återkoppling alls i mörker.",
    sourceRef: SOURCE,
    objectiveTitle: "Mörkerangöring",
  },
];
