import type { DemoItem } from "../../demo";

/**
 * Seglarintyg 3 — hårt väder: förberedelser, segelföring, taktik (SPEC
 * §33.3). Draft quality, sources marked unverified.
 */

const SOURCE = "Lektion: Seglar 3 — hårt väder (utkast, ej källgranskad)";

export const HARDVADER_ITEMS: DemoItem[] = [
  {
    index: 0,
    kind: "single_choice",
    stemSv: "Vilken är den viktigaste hårtvädersåtgärden av alla?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Att inte vara där — planera med väderfönster och våga vänta i hamn",
        },
        { key: "b", text_sv: "Nya segel" },
        { key: "c", text_sv: "Större motor" },
        { key: "d", text_sv: "Modigare besättning" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Konservativa avgångsbeslut löser 90 % av hårtvädersproblemen. Det som återstår möts med förberedd båt och besättning.",
    sourceRef: SOURCE,
    objectiveTitle: "Undvikande som taktik",
  },
  {
    index: 1,
    kind: "multiple_select",
    stemSv:
      "Vilka segelalternativ hör hemma när det friskar i ordentligt? Välj alla som stämmer.",
    interaction: {
      kind: "multiple_select",
      options: [
        { key: "a", text_sv: "Djupt revad stor + liten fock/inrullad genua" },
        { key: "b", text_sv: "Enbart förseglet i hård undanvind" },
        { key: "c", text_sv: "Stormfock om sådan finns riggad" },
        { key: "d", text_sv: "Full genua för att hålla farten uppe" },
      ],
    },
    answerKey: { correct: ["a", "b", "c"] },
    explanation:
      "Balanserad minirigg, undanvind på litet försegel eller riktiga stormsegel — allt utom att behålla full yta för länge.",
    sourceRef: SOURCE,
    objectiveTitle: "Segelföring i hård vind",
  },
  {
    index: 2,
    kind: "single_choice",
    stemSv: "Vad innebär att 'lägga bi' (heave to)?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Backat försegel + motlagt roder — båten ligger nästan stilla, lugnt snett mot sjön",
        },
        { key: "b", text_sv: "Att ankra på djupt vatten" },
        { key: "c", text_sv: "Full fart undan vinden" },
        { key: "d", text_sv: "Att ta ner alla segel och driva" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Bi-läget är havets pausknapp: reparera, vila, vänta ut en by — båten sköter sig själv i kontrollerad drift. Öva i frisk men hanterlig vind.",
    sourceRef: SOURCE,
    objectiveTitle: "Lägga bi",
  },
  {
    index: 3,
    kind: "single_choice",
    stemSv: "Varför är för HÖG fart i grov medsjö farlig?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Båten kan surfa ner i vågen framför och bromsas tvärt — broach eller i värsta fall runtslagning",
        },
        { key: "b", text_sv: "Bränslet tar slut fortare" },
        { key: "c", text_sv: "Hög fart är alltid säkrast i sjö" },
        { key: "d", text_sv: "Seglen slits" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "I brant medsjö styr vågorna: minska segel, bromsa vid behov och styr aktivt med vågorna snett akterifrån — kontroll före fart.",
    sourceRef: SOURCE,
    objectiveTitle: "Medsjö och broach",
  },
  {
    index: 4,
    kind: "ordering",
    stemSv: "Byfront på väg in — 25 minuter kvar. Ordna åtgärderna ombord.",
    interaction: {
      kind: "ordering",
      items: [
        { key: "a", text_sv: "Reva/byt till hårtvädersföring MEDAN det är lugnt" },
        { key: "b", text_sv: "Stäng luckor, säkra löst på däck och under" },
        { key: "c", text_sv: "Sele på alla; genomgång: kurs, roller, vad som händer vid byn" },
        { key: "d", text_sv: "Välj taktik: kryssa upp med sjörum eller falla av mot skydd" },
      ],
    },
    answerKey: { order: ["a", "b", "c", "d"] },
    explanation:
      "Segel först (tyngst i vind), täta båten, säkra folket — och lägg taktiken innan byn väljer åt dig.",
    sourceRef: SOURCE,
    objectiveTitle: "Byförberedelse",
  },
  {
    index: 5,
    kind: "single_choice",
    stemSv: "Vad är 'sjörum' och varför är det hårtväderets viktigaste valuta?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Avstånd till läkust och grund — utrymme att driva, reva och göra fel utan att stranda",
        },
        { key: "b", text_sv: "Utrymmet i sittbrunnen" },
        { key: "c", text_sv: "Bredden på farleden" },
        { key: "d", text_sv: "Ett försäkringsbegrepp" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "En läkust nära gör varje problem akut. Med sjörum är samma problem hanterbara — kryssa upp och köp utrymme innan det behövs.",
    sourceRef: SOURCE,
    objectiveTitle: "Sjörum",
  },
  {
    index: 6,
    kind: "single_choice",
    stemSv: "När är det rätt att sätta spinnaker på en överfart?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "I stabil, hanterlig undanvind med utvilad besättning — och med nedtagningsplan klar",
        },
        { key: "b", text_sv: "När det byar som mest — då ger den mest fart" },
        { key: "c", text_sv: "På natten, så syns duken bättre" },
        { key: "d", text_sv: "Aldrig på överfarter" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "Spinnakern är ett gott-väder-verktyg: sätt den med marginal, ha nedtagningen repeterad — och ta den ner FÖRE skymning och byar.",
    sourceRef: SOURCE,
    objectiveTitle: "Spinnakeromdöme",
  },
  {
    index: 7,
    kind: "single_choice",
    stemSv:
      "Besättningen är rädd och trött mitt i hårtvädret. Vad gör en bra skeppare?",
    interaction: {
      kind: "single_choice",
      options: [
        {
          key: "a",
          text_sv: "Sänker ambitionen: minsta segel, enklaste kurs, korta tydliga uppgifter — och utstrålar lugn",
        },
        { key: "b", text_sv: "Skriker högre än vinden" },
        { key: "c", text_sv: "Lämnar rodret och går ner" },
        { key: "d", text_sv: "Ökar farten så det tar slut fortare" },
      ],
    },
    answerKey: { correct: "a" },
    explanation:
      "I hårt väder leder man med enkelhet: färre beslut, mindre segel, en uppgift per person. Skepparens lugn är smittsamt — åt båda håll.",
    sourceRef: SOURCE,
    objectiveTitle: "Ledarskap i hårt väder",
  },
];
