import { z } from "zod";

/**
 * Certification registry — the single source of truth for everything that is
 * tailored to the test a learner is preparing for (SPEC §7.1): navigation,
 * the /app/ova hub, practice-track availability, exam blueprints, readiness
 * modules and weights (§17.1), the picker and the marketing grid.
 *
 * Client-safe: names and structure only, never items or answer keys.
 * Only `forarintyg` is `active` (§8.1); the other seven present as
 * "Förhandsversion" in-app and must never imply finished content (§11.1).
 */

export const CERTIFICATION_IDS = [
  "forarintyg",
  "kustskepparintyg",
  "src",
  "batpraktik_dag_prep",
  "batpraktik_morker_prep",
  "seglarintyg_1",
  "seglarintyg_2",
  "seglarintyg_3",
] as const;

export type CertificationId = (typeof CERTIFICATION_IDS)[number];

export const certIdSchema = z.enum(CERTIFICATION_IDS);

/** httpOnly cookie holding the learner's chosen certification id. */
export const CERT_COOKIE = "sjoklart_intyg";

export type CertTrackMeta = {
  /** Route segment under /app/ova/<id>. The first track is always "pass". */
  id: string;
  title: string;
  blurb: string;
  /** lucide icon name, resolved in the client directory component. */
  icon: string;
};

export type CurriculumModule = {
  id: string;
  titleSv: string;
  /** 0..1 demo readiness for the pre-DB dashboard. 0 for preview certs. */
  demoReadiness: number;
};

export type ReadinessWeights = {
  coverage: number;
  recall: number;
  procedural: number;
  simulations: number;
  calibration: number;
};

export type CertificationDef = {
  id: CertificationId;
  nameSv: string;
  shortLabel: string;
  /** §8.1: only Förarintyg is active in v1. */
  status: "active" | "preview";
  tagline: string;
  /** Picker grouping. */
  group: "intyg" | "praktik" | "segling";
  /** Curriculum module map (SPEC §28–§33) for the framsteg breadth view. */
  modules: CurriculumModule[];
  /** Practice tracks that exist for this certification (in display order). */
  tracks: CertTrackMeta[];
  /** Chart lab applies to the navigation certificates only (§20.2). */
  chartLab: boolean;
  marketingPath: string;
  marketingStatusSv: string;
  marketingTone: "info" | "neutral";
  /** §17.1 — certification-specific readiness weighting. */
  readinessWeights: ReadinessWeights;
};

/** §17.1 default (Förar/Kust/SRC — theory-exam certificates). */
const THEORY_WEIGHTS: ReadinessWeights = {
  coverage: 0.15,
  recall: 0.25,
  procedural: 0.25,
  simulations: 0.25,
  calibration: 0.1,
};

/**
 * Practical-preparation certificates lean on procedural skill; weighting is a
 * placeholder config per §17.1 pending domain review.
 */
const PRACTICAL_WEIGHTS: ReadinessWeights = {
  coverage: 0.15,
  recall: 0.2,
  procedural: 0.4,
  simulations: 0.1,
  calibration: 0.15,
};

export const CERTIFICATIONS: Record<CertificationId, CertificationDef> = {
  forarintyg: {
    id: "forarintyg",
    nameSv: "Förarintyg",
    shortLabel: "Förarintyg",
    status: "active",
    tagline:
      "Grundintyget för fritidsbåt — sjökort, väjningsregler, säkerhet och sjömanskap.",
    group: "intyg",
    modules: [
      { id: "F1", titleSv: "Officiell process och säker omfattning", demoReadiness: 0.8 },
      { id: "F2", titleSv: "Sjömansspråk, enheter och kortorientering", demoReadiness: 0.72 },
      { id: "F3", titleSv: "Sjökortsinformation och symboler", demoReadiness: 0.64 },
      { id: "F4", titleSv: "Prickar, fyrar och sjömärken", demoReadiness: 0.58 },
      { id: "F5", titleSv: "Kompass, kurser och missvisning", demoReadiness: 0.46 },
      { id: "F6", titleSv: "Position, distans, kurs och rutt", demoReadiness: 0.4 },
      { id: "F7", titleSv: "Fart, tid, distans och rörelse", demoReadiness: 0.52 },
      { id: "F8", titleSv: "Väjningsregler och trafikbeteende", demoReadiness: 0.55 },
      { id: "F9", titleSv: "Säkerhet, nöd och första insats", demoReadiness: 0.6 },
      { id: "F10", titleSv: "Sjömanskap och båthantering (teori)", demoReadiness: 0.3 },
      { id: "F11", titleSv: "Väder, vatten och miljö", demoReadiness: 0.35 },
      { id: "F12", titleSv: "Regler, ansvar och slutlig integrering", demoReadiness: 0.28 },
    ],
    tracks: [
      {
        id: "pass",
        title: "Dagens pass",
        blurb: "Blandade uppgifter — repetition, färdighet och felboken i ett pass.",
        icon: "GraduationCap",
      },
      {
        id: "ljus",
        title: "Ljus, dagersignaler & ljud",
        blurb:
          "Känn igen fartygsljus och fyrkaraktärer, bygg ljusbilder och ge ljudsignaler.",
        icon: "Lightbulb",
      },
      {
        id: "vajning",
        title: "Väjningsregler",
        blurb: "Bedöm möte, korsande och upphinnande — vem viker, och vad gör du?",
        icon: "Sailboat",
      },
      {
        id: "knop",
        title: "Knopar",
        blurb: "Följ stegen, ordna dem rätt och hitta felet — råbandsknop och pålstek.",
        icon: "Anchor",
      },
      {
        id: "vader",
        title: "Väder & beslut",
        blurb: "Tolka prognos och observation, känn igen försämring och välj försiktigt.",
        icon: "CloudSun",
      },
      {
        id: "plotter",
        title: "Elektroniskt sjökort",
        blurb: "Overzoom, waypointinmatning, MOB och korskontroll mot sjömärken.",
        icon: "Radar",
      },
      {
        id: "regler",
        title: "Regler & sjölag",
        blurb: "Sjölagen, sjöfylleri, fartregler, miljö och befälhavarens ansvar.",
        icon: "Scale",
      },
    ],
    chartLab: true,
    marketingPath: "/forarintyg",
    marketingStatusSv: "Tillgängligt",
    marketingTone: "info",
    readinessWeights: THEORY_WEIGHTS,
  },

  kustskepparintyg: {
    id: "kustskepparintyg",
    nameSv: "Kustskepparintyg",
    shortLabel: "Kustskeppar",
    status: "preview",
    tagline:
      "Fortsättningen efter Förarintyg — mörkernavigation, passageplanering och öppet vatten.",
    group: "intyg",
    modules: [
      { id: "K1", titleSv: "Förkunskaper och progression", demoReadiness: 0 },
      { id: "K2", titleSv: "Avancerade sjökort och publikationer", demoReadiness: 0 },
      { id: "K3", titleSv: "Avancerat kompass- och positionsarbete", demoReadiness: 0 },
      { id: "K4", titleSv: "Rutt- och överfartsplanering", demoReadiness: 0 },
      { id: "K5", titleSv: "Elektronik och korskontroll", demoReadiness: 0 },
      { id: "K6", titleSv: "Ljus, mörker och nedsatt sikt", demoReadiness: 0 },
      { id: "K7", titleSv: "Väder och öppet vatten", demoReadiness: 0 },
      { id: "K8", titleSv: "Säkerhet, sjömanskap och nödsituationer", demoReadiness: 0 },
      { id: "K9", titleSv: "Regler, dokument, tull och miljö", demoReadiness: 0 },
      { id: "K10", titleSv: "Integrerade överfartsfall", demoReadiness: 0 },
    ],
    tracks: [
      {
        id: "pass",
        title: "Dagens pass",
        blurb: "Blandade uppgifter för Kustskepparintyget — mörker, planering och regler.",
        icon: "GraduationCap",
      },
      {
        id: "navigation",
        title: "Navigation & planering",
        blurb: "Kursomvandling, position, distans och passageplanering för längre färder.",
        icon: "Compass",
      },
      {
        id: "morker",
        title: "Mörker & nedsatt sikt",
        blurb: "Fyrsektorer, ljusbilder och ljudsignaler när sikten försvinner.",
        icon: "Moon",
      },
      {
        id: "elektronik",
        title: "Elektronik & korskontroll",
        blurb: "GNSS, ekolod och plotterns fällor — och konsten att aldrig lita blint.",
        icon: "Radar",
      },
      {
        id: "vader-sjomanskap",
        title: "Väder & sjömanskap",
        blurb: "Väderfönster, sjöhävning, bränslemarginal och besättningens säkerhet.",
        icon: "CloudSun",
      },
    ],
    chartLab: true,
    marketingPath: "/kustskepparintyg",
    marketingStatusSv: "Planerad",
    marketingTone: "neutral",
    readinessWeights: THEORY_WEIGHTS,
  },

  src: {
    id: "src",
    nameSv: "SRC (VHF-radio)",
    shortLabel: "SRC",
    status: "preview",
    tagline:
      "Radiocertifikatet för VHF — anrop, kanaler, DSC och nödprocedurer till sjöss.",
    group: "intyg",
    modules: [
      { id: "R1", titleSv: "Officiell process, omfattning och tillstånd", demoReadiness: 0 },
      { id: "R2", titleSv: "VHF-grunder", demoReadiness: 0 },
      { id: "R3", titleSv: "Radions reglage", demoReadiness: 0 },
      { id: "R4", titleSv: "Rutintrafik", demoReadiness: 0 },
      { id: "R5", titleSv: "Nöd: MAYDAY", demoReadiness: 0 },
      { id: "R6", titleSv: "Il- och varningsmeddelanden", demoReadiness: 0 },
      { id: "R7", titleSv: "GMDSS och utrustning", demoReadiness: 0 },
      { id: "R8", titleSv: "Marin engelska och bokstavering", demoReadiness: 0 },
      { id: "R9", titleSv: "Regler, sekretess och ansvar", demoReadiness: 0 },
      { id: "R10", titleSv: "Officiell beredskap", demoReadiness: 0 },
    ],
    tracks: [
      {
        id: "pass",
        title: "Dagens pass",
        blurb: "Blandade radiouppgifter — anrop, kanaler, DSC och nödtrafik.",
        icon: "GraduationCap",
      },
      {
        id: "grunder",
        title: "VHF-grunder",
        blurb: "Kanaler, räckvidd, effekt, squelch och MMSI — radions grundlogik.",
        icon: "Radio",
      },
      {
        id: "procedurer",
        title: "Anrop & procedurer",
        blurb: "Rutinanrop, procedurord, bokstavering och taldisciplin.",
        icon: "Waves",
      },
      {
        id: "nod",
        title: "Nöd- och iltrafik",
        blurb: "MAYDAY, PAN-PAN, SÉCURITÉ, DSC-larm och GMDSS-utrustningen.",
        icon: "LifeBuoy",
      },
    ],
    chartLab: false,
    marketingPath: "/src",
    marketingStatusSv: "Planerad",
    marketingTone: "neutral",
    readinessWeights: THEORY_WEIGHTS,
  },

  batpraktik_dag_prep: {
    id: "batpraktik_dag_prep",
    nameSv: "Båtpraktik dag",
    shortLabel: "Praktik dag",
    status: "preview",
    tagline:
      "Teoriförberedelse inför den praktiska dagövningen — säkerhet, manöver och förtöjning.",
    group: "praktik",
    modules: [
      { id: "B1", titleSv: "Säkerhetsutrustning ombord", demoReadiness: 0 },
      { id: "B2", titleSv: "Personlig utrustning", demoReadiness: 0 },
      { id: "B3", titleSv: "Kort mot verklighet", demoReadiness: 0 },
      { id: "B4", titleSv: "Styra på enslinje och kompass", demoReadiness: 0 },
      { id: "B5", titleSv: "Navigation i och utanför farled", demoReadiness: 0 },
      { id: "B6", titleSv: "Positionsbestämning", demoReadiness: 0 },
      { id: "B7", titleSv: "Vind- och strömpåverkan", demoReadiness: 0 },
      { id: "B8", titleSv: "Elektroniskt sjökort och waypoint", demoReadiness: 0 },
      { id: "B9", titleSv: "Roder, propeller och manöver", demoReadiness: 0 },
      { id: "B10", titleSv: "Man över bord", demoReadiness: 0 },
      { id: "B11", titleSv: "Förtöjning och spring", demoReadiness: 0 },
      { id: "B12", titleSv: "Miljö och ekonomisk körning", demoReadiness: 0 },
    ],
    tracks: [
      {
        id: "pass",
        title: "Dagens pass",
        blurb: "Blandad teoriförberedelse — utrustning, manöverteori och MOB-sekvenser.",
        icon: "GraduationCap",
      },
      {
        id: "sakerhet",
        title: "Säkerhet ombord",
        blurb: "Utrustning, kontroller, genomgångar och miljöhänsyn före avgång.",
        icon: "LifeBuoy",
      },
      {
        id: "navigation-praktik",
        title: "Praktisk navigation",
        blurb: "Kort mot verklighet, enslinjer, farled, waypoints och MOB-knappen.",
        icon: "Compass",
      },
      {
        id: "manovrering",
        title: "Manövrering",
        blurb: "Roder- och propellereffekt, tilläggning med spring och MOB-manövern.",
        icon: "Ship",
      },
    ],
    chartLab: false,
    marketingPath: "/batpraktik",
    marketingStatusSv: "Planerad",
    marketingTone: "neutral",
    readinessWeights: PRACTICAL_WEIGHTS,
  },

  batpraktik_morker_prep: {
    id: "batpraktik_morker_prep",
    nameSv: "Båtpraktik mörker",
    shortLabel: "Praktik mörker",
    status: "preview",
    tagline:
      "Teoriförberedelse inför praktiken i mörker — ljusbilder, nattseende och mörkermanöver.",
    group: "praktik",
    modules: [
      { id: "M1", titleSv: "Mörkerförberedelser och nattseende", demoReadiness: 0 },
      { id: "M2", titleSv: "Ljusbilder från rorsmansplats", demoReadiness: 0 },
      { id: "M3", titleSv: "Fyrar och mörkernavigation", demoReadiness: 0 },
      { id: "M4", titleSv: "Mörkermanöver och upptäckt", demoReadiness: 0 },
      { id: "M5", titleSv: "Säkerhet i mörker", demoReadiness: 0 },
    ],
    tracks: [
      {
        id: "pass",
        title: "Dagens pass",
        blurb: "Blandade mörkeruppgifter — ljusbilder, fyrar och försiktig manöver.",
        icon: "GraduationCap",
      },
      {
        id: "ljus-igenkanning",
        title: "Ljusbilder",
        blurb: "Känn igen fartyg, sidor och girar från rorsmansplats i mörker.",
        icon: "Lightbulb",
      },
      {
        id: "morkernavigation",
        title: "Mörkernavigation",
        blurb: "Fyrkaraktärer, sektorer, säker fart och belysningsdisciplin.",
        icon: "Moon",
      },
      {
        id: "sakerhet-morker",
        title: "Säkerhet i mörker",
        blurb: "Nattseende, fallprevention, MOB i mörker och trötthet.",
        icon: "LifeBuoy",
      },
    ],
    chartLab: false,
    marketingPath: "/batpraktik",
    marketingStatusSv: "Planerad",
    marketingTone: "neutral",
    readinessWeights: PRACTICAL_WEIGHTS,
  },

  seglarintyg_1: {
    id: "seglarintyg_1",
    nameSv: "Seglarintyg 1",
    shortLabel: "Seglar 1",
    status: "preview",
    tagline: "Segling grund — rigg, bogar, slag och gipp, tilläggning och sjövett.",
    group: "segling",
    modules: [
      { id: "S1", titleSv: "Båtens och riggens delar", demoReadiness: 0 },
      { id: "S2", titleSv: "Segelteori och bogar", demoReadiness: 0 },
      { id: "S3", titleSv: "Hissa, bärga och reva", demoReadiness: 0 },
      { id: "S4", titleSv: "Segeltrim — grunder", demoReadiness: 0 },
      { id: "S5", titleSv: "Stagvändning och gipp", demoReadiness: 0 },
      { id: "S6", titleSv: "Avgång, angöring och tilläggning", demoReadiness: 0 },
      { id: "S7", titleSv: "Väjningsregler för segelbåt", demoReadiness: 0 },
      { id: "S8", titleSv: "Knopar och tamphantering", demoReadiness: 0 },
      { id: "S9", titleSv: "Man över bord under segel", demoReadiness: 0 },
      { id: "S10", titleSv: "Väder och lokala beslut", demoReadiness: 0 },
    ],
    tracks: [
      {
        id: "pass",
        title: "Dagens pass",
        blurb: "Blandade segeluppgifter — bogar, manövrar och väjning under segel.",
        icon: "GraduationCap",
      },
      {
        id: "rigg-och-segel",
        title: "Rigg & segel",
        blurb: "Delarnas namn, segelteori, trim, hissning och rev.",
        icon: "Sailboat",
      },
      {
        id: "manovrer",
        title: "Manövrar",
        blurb: "Slag, gipp, uppskjutare, tilläggning under segel och quick stop.",
        icon: "Ship",
      },
      {
        id: "sjovett",
        title: "Sjövett & regler",
        blurb: "Väjningsregler för segel, knopar, väder och omdöme.",
        icon: "LifeBuoy",
      },
    ],
    chartLab: false,
    marketingPath: "/seglarintyg-1",
    marketingStatusSv: "Planerad",
    marketingTone: "neutral",
    readinessWeights: PRACTICAL_WEIGHTS,
  },

  seglarintyg_2: {
    id: "seglarintyg_2",
    nameSv: "Seglarintyg 2",
    shortLabel: "Seglar 2",
    status: "preview",
    tagline:
      "Segling fortsättning — båtsystem, precisionstrim och manövrering i trånga vatten.",
    group: "segling",
    modules: [
      { id: "S1", titleSv: "Moderna båtsystem och utrustning", demoReadiness: 0 },
      { id: "S2", titleSv: "Underhåll och kontroller", demoReadiness: 0 },
      { id: "S3", titleSv: "Precisionstrim", demoReadiness: 0 },
      { id: "S4", titleSv: "Koordinerade slag och gippar", demoReadiness: 0 },
      { id: "S5", titleSv: "Manövrering i trånga vatten", demoReadiness: 0 },
      { id: "S6", titleSv: "Tilläggning och ankring", demoReadiness: 0 },
      { id: "S7", titleSv: "Sjömanskapsrutiner", demoReadiness: 0 },
      { id: "S8", titleSv: "MOB med tyngre objekt", demoReadiness: 0 },
      { id: "S9", titleSv: "Dimma, lokalväder och prognos", demoReadiness: 0 },
    ],
    tracks: [
      {
        id: "pass",
        title: "Dagens pass",
        blurb: "Blandade uppgifter — system, ankring, trånga vatten och prognos.",
        icon: "GraduationCap",
      },
      {
        id: "batsystem",
        title: "Båtsystem & underhåll",
        blurb: "Motor, el, rigg och rullsystem — kontroller och felsökning.",
        icon: "Wrench",
      },
      {
        id: "manovrering-hamn",
        title: "Hamn & ankring",
        blurb: "Trånga vatten, propellereffekt, boj/brygga och ankringsteknik.",
        icon: "Anchor",
      },
      {
        id: "vader-fog",
        title: "Väder & sikt",
        blurb: "Dimtyper, sjöbris, fronttecken och seglingsbeslut i dålig sikt.",
        icon: "CloudSun",
      },
    ],
    chartLab: false,
    marketingPath: "/seglarintyg-2",
    marketingStatusSv: "Planerad",
    marketingTone: "neutral",
    readinessWeights: PRACTICAL_WEIGHTS,
  },

  seglarintyg_3: {
    id: "seglarintyg_3",
    nameSv: "Seglarintyg 3",
    shortLabel: "Seglar 3",
    status: "preview",
    tagline:
      "Segling avancerad — offshoreplanering, hårt väder, natt och felscenarier.",
    group: "segling",
    modules: [
      { id: "S1", titleSv: "Offshoreplanering och vaktsystem", demoReadiness: 0 },
      { id: "S2", titleSv: "Hårt väder och konservativa beslut", demoReadiness: 0 },
      { id: "S3", titleSv: "Avancerad rigg- och segeltrim", demoReadiness: 0 },
      { id: "S4", titleSv: "Spinnaker och gennaker", demoReadiness: 0 },
      { id: "S5", titleSv: "Natt- och offshorerutiner", demoReadiness: 0 },
      { id: "S6", titleSv: "Avancerad MOB-planering", demoReadiness: 0 },
      { id: "S7", titleSv: "Vädertolkning", demoReadiness: 0 },
      { id: "S8", titleSv: "Underhåll och felscenarier", demoReadiness: 0 },
    ],
    tracks: [
      {
        id: "pass",
        title: "Dagens pass",
        blurb: "Blandade uppgifter — offshore, hårt väder och nattrutiner.",
        icon: "GraduationCap",
      },
      {
        id: "offshore",
        title: "Offshore & vakter",
        blurb: "Överfartsplanering, vaktsystem, loggbok och angöring.",
        icon: "Waves",
      },
      {
        id: "hardvader",
        title: "Hårt väder",
        blurb: "Segelföring, lägga bi, sjörum och ledarskap när det blåser.",
        icon: "Wind",
      },
      {
        id: "natt-underhall",
        title: "Natt & felscenarier",
        blurb: "Nattdisciplin, avancerad MOB, roder-/rigghaveri och läckage.",
        icon: "Moon",
      },
    ],
    chartLab: false,
    marketingPath: "/seglarintyg-3",
    marketingStatusSv: "Planerad",
    marketingTone: "neutral",
    readinessWeights: PRACTICAL_WEIGHTS,
  },
};

export function certification(id: CertificationId): CertificationDef {
  return CERTIFICATIONS[id];
}

/** All defs in picker/marketing display order. */
export const ALL_CERTIFICATIONS: CertificationDef[] = CERTIFICATION_IDS.map(
  (id) => CERTIFICATIONS[id],
);
