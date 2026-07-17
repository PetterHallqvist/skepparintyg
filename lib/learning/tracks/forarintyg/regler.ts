import type { DemoItem } from "../../demo";

/**
 * Förarintyg — regler, sjölag, ansvar och miljö (SPEC §28 F1, F8, F12).
 * Coverage informed by the public NFB exam structure (sjövägsregler,
 * sjötrafikförordningen, sjölagen, miljöregler). Original items — draft
 * quality, sources marked unverified.
 */

const SOURCE = "Lektion: Regler, ansvar och miljö (utkast, ej källgranskad)";

export const REGLER_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "single_choice",
    stemSv:
      "Vilken promillegräns gäller för sjöfylleri med båtar som kan gå 15 knop eller är minst 10 meter?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "0,2 promille" },
        { key: "b", text_sv: "0,5 promille" },
        { key: "c", text_sv: "1,0 promille" },
        { key: "d", text_sv: "Ingen gräns till sjöss" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Sedan 2010 gäller 0,2 promille för båtar som gör minst 15 knop eller är minst 10 m. Grovt sjöfylleri går vid 1,0 promille — och omdömesregeln gäller alla båtar.",
    sourceRef: SOURCE,
    objectiveTitle: "Sjöfylleri",
    misconceptionByKey: {
      c: "1,0 promille är gränsen för GROVT sjöfylleri — inte för sjöfylleri.",
    },
  },
  {
    index: 1,
    kind: "single_choice",
    stemSv: "Vem är ytterst ansvarig för säkerheten ombord på en fritidsbåt?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Befälhavaren — den som för båten" },
        { key: "b", text_sv: "Ägaren, även när någon annan kör" },
        { key: "c", text_sv: "Försäkringsbolaget" },
        { key: "d", text_sv: "Alla ombord lika mycket" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Sjölagen pekar ut befälhavaren: den som för båten ansvarar för att den är sjövärdig, rätt utrustad och framförs säkert.",
    sourceRef: SOURCE,
    objectiveTitle: "Befälhavarens ansvar",
  },
  {
    index: 2,
    kind: "single_choice",
    stemSv:
      "Du passerar en badplats med människor i vattnet. Vad kräver gott sjömanskap och sjötrafikförordningen?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Anpassa fart och avstånd så att svall och risk inte uppstår",
        },
        { key: "b", text_sv: "Full gas för att passera snabbt" },
        { key: "c", text_sv: "Tuta och fortsätt i samma fart" },
        { key: "d", text_sv: "Badande får inte finnas i farvatten" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Fart ska alltid anpassas efter omständigheterna — svall, sikt och närhet till människor. Vid badplatser innebär det låg fart och gott avstånd.",
    sourceRef: SOURCE,
    objectiveTitle: "Fartanpassning och hänsyn",
  },
  {
    index: 3,
    kind: "single_choice",
    stemSv: "Vad gäller för toalettavfall från fritidsbåt i svenska vatten?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Förbjudet att släppa ut — töm i landanläggning (sugtömning)",
        },
        { key: "b", text_sv: "Tillåtet utanför 300 m från land" },
        { key: "c", text_sv: "Tillåtet om det är mörkt" },
        { key: "d", text_sv: "Bara förbjudet i insjöar" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Sedan 2015 är det förbjudet att släppa ut toalettavfall från fritidsbåt i hela svenska sjöterritoriet — tanken töms i hamnarnas sugtömningsstationer.",
    sourceRef: SOURCE,
    objectiveTitle: "Miljöregler — toatömning",
  },
  {
    index: 4,
    kind: "single_choice",
    stemSv:
      "Du ser en kapsejsad jolle med två personer i vattnet. Vad säger sjölagen om din skyldighet?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Du är skyldig att bistå nödställda om det kan ske utan allvarlig fara för egen båt och besättning",
        },
        { key: "b", text_sv: "Du får hjälpa om du hinner" },
        { key: "c", text_sv: "Bara Sjöräddningen får ingripa" },
        { key: "d", text_sv: "Skyldigheten gäller bara yrkessjöfart" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Skyldigheten att bistå sjönödställda gäller alla — den bryts bara om ingripandet skulle innebära allvarlig fara för dig och din besättning.",
    sourceRef: SOURCE,
    objectiveTitle: "Skyldighet att bistå",
  },
  {
    index: 5,
    kind: "multiple_select",
    stemSv:
      "Inom vilka situationer gäller generellt fartbegränsning eller särskild hänsyn? Välj alla som stämmer.",
    interaction: {
      kind: "multiple_select",
      options: [
        { key: "a", text_sv: "Skyltad fartbegränsning i sund och hamnar" },
        { key: "b", text_sv: "Nära badande, kanotister och mindre båtar" },
        { key: "c", text_sv: "I gästhamnens inlopp" },
        { key: "d", text_sv: "På öppet vatten utan andra båtar i sikte" },
      ],
    },
    answerKey: { correct: ["a", "b", "c"] },
    explanation:
      "Skyltade gränser är bindande; hänsynsregeln gäller överallt där människor eller båtar kan påverkas. På fritt öppet vatten avgör gott sjömanskap.",
    sourceRef: SOURCE,
    objectiveTitle: "Fartregler",
  },
  {
    index: 6,
    kind: "single_choice",
    stemSv: "Vilka fritidsbåtar kräver registrering i fartygsregistret?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Båtar med skrovlängd 15 meter eller mer (fartyg)",
        },
        { key: "b", text_sv: "Alla båtar med motor" },
        { key: "c", text_sv: "Alla båtar över 5 meter" },
        { key: "d", text_sv: "Inga fritidsbåtar registreras i Sverige" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Skepp (≥15 m) ska registreras. Mindre fritidsbåtar är oregistrerade i Sverige — men försäkring och märkning är ändå klokt.",
    sourceRef: SOURCE,
    objectiveTitle: "Registrering",
  },
  {
    index: 7,
    kind: "single_choice",
    stemSv:
      "Vad betyder ett förbudsmärke med en vit vågsymbol på blå botten (svallförbud) vid en farled?",
    interaction: {
      kind: "single_choice",
      options: [
        { key: "a", text_sv: "Framfart som orsakar svall är förbjuden" },
        { key: "b", text_sv: "Badförbud" },
        { key: "c", text_sv: "Vattenskidåkning tillåten" },
        { key: "d", text_sv: "Undervattenskabel" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Svallförbudsmärket kräver att du passerar utan besvärande svall — sänk till deplacementfart i god tid före märket.",
    sourceRef: SOURCE,
    objectiveTitle: "Sjövägmärken",
  },
  {
    index: 8,
    kind: "single_choice",
    stemSv:
      "En vattenskoter närmar sig i hög fart. Vilka regler gäller för vattenskoterförare?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Samma sjövägsregler som andra maskindrivna fartyg + förarbevis­krav",
        },
        { key: "b", text_sv: "Inga regler — skotrar är leksaker" },
        { key: "c", text_sv: "Skotern har alltid företräde" },
        { key: "d", text_sv: "Skotern räknas som segelfartyg" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "En vattenskoter är ett maskindrivet fartyg: väjningsregler, fartregler och (sedan 2022) krav på förarbevis gäller fullt ut.",
    sourceRef: SOURCE,
    objectiveTitle: "Vattenskoter",
  },
  {
    index: 9,
    kind: "single_choice",
    stemSv: "När får du köra båt inom ett fågelskyddsområde?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Bara utanför förbudstiden som anges på skylt/sjökort — annars är tillträde förbjudet",
        },
        { key: "b", text_sv: "Alltid, om du kör långsamt" },
        { key: "c", text_sv: "Bara på vardagar" },
        { key: "d", text_sv: "Fågelskyddsområden gäller inte båtar" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Fågel- och sälskyddsområden har tillträdesförbud under angivna perioder (ofta 1/2–15/8) — markerade i sjökortet och med skyltar.",
    sourceRef: SOURCE,
    objectiveTitle: "Skyddsområden",
  },
  {
    index: 10,
    kind: "multiple_select",
    stemSv:
      "Vilka åtgärder minskar din miljöpåverkan som båtägare? Välj alla som stämmer.",
    interaction: {
      kind: "multiple_select",
      options: [
        { key: "a", text_sv: "Tanka mot spillskydd och använd alkylatbensin till äldre tvåtaktare" },
        { key: "b", text_sv: "Använd båtbottentvätt i stället för giftig bottenfärg där det går" },
        { key: "c", text_sv: "Lämna farligt avfall (olja, batterier) till miljöstation" },
        { key: "d", text_sv: "Skölj färgrester i sjön så de späds ut" },
      ],
    },
    answerKey: { correct: ["a", "b", "c"] },
    explanation:
      "Spillfri tankning, giftfri bottenhantering och rätt avfallshantering är båtmiljöns tre stora. Färgrester är farligt avfall — aldrig i sjön.",
    sourceRef: SOURCE,
    objectiveTitle: "Miljöhänsyn",
  },
  {
    index: 11,
    kind: "single_choice",
    stemSv:
      "Vad krävs för att en olycka till sjöss ska anmälas — och till vem?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Allvarliga olyckor och tillbud rapporteras — vid nöd larmas JRCC/Sjöräddning via 112 eller VHF",
        },
        { key: "b", text_sv: "Olyckor till sjöss behöver aldrig anmälas" },
        { key: "c", text_sv: "Bara försäkringsbolaget ska kontaktas" },
        { key: "d", text_sv: "Anmälan görs till hamnkaptenen inom ett år" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Nödläge: 112 eller VHF kanal 16 → sjöräddningen (JRCC). Personskador och allvarliga händelser ska rapporteras; försäkringen är ett separat spår.",
    sourceRef: SOURCE,
    objectiveTitle: "Olycka och rapportering",
  },
  {
    index: 12,
    kind: "single_choice",
    stemSv:
      "Vilket ansvar har du när du lånar ut din båt till en kompis?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Att förvissa dig om att låntagaren rimligen kan hantera båten — sedan är kompisen befälhavare",
        },
        { key: "b", text_sv: "Inget alls — allt ansvar följer båten" },
        { key: "c", text_sv: "Du är befälhavare även från land" },
        { key: "d", text_sv: "Utlåning av båt är förbjuden" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Den som FÖR båten är befälhavare. Som ägare bör du dock inte låna ut till någon uppenbart olämplig — och försäkringsvillkoren kan ställa krav.",
    sourceRef: SOURCE,
    objectiveTitle: "Utlåning och ansvar",
  },
  {
    index: 13,
    kind: "matching",
    stemSv: "Para ihop regelverket med vad det främst styr till sjöss.",
    interaction: {
      kind: "matching",
      left: [
        { key: "l1", text_sv: "Sjövägsreglerna (COLREG)" },
        { key: "l2", text_sv: "Sjölagen" },
        { key: "l3", text_sv: "Sjötrafikförordningen" },
      ],
      right: [
        { key: "r1", text_sv: "Väjning, ljus, signaler mellan fartyg" },
        { key: "r2", text_sv: "Befälhavarens ansvar och skyldigheter" },
        { key: "r3", text_sv: "Nationella trafikregler, fartbegränsningar, sjövägmärken" },
      ],
    },
    answerKey: { pairs: { l1: "r1", l2: "r2", l3: "r3" } },
    explanation:
      "COLREG styr mötet mellan fartyg, sjölagen personansvaret, och sjötrafikförordningen de svenska lokala trafikreglerna.",
    sourceRef: SOURCE,
    objectiveTitle: "Regelverkens roller",
  },
];
