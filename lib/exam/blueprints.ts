import type { CertificationId } from "@/lib/certifications/registry";

/**
 * Per-certification demo-exam configuration (SPEC §35.2 — never a universal
 * hard-coded format). Förar/Kust/SRC theory passes use the verified public
 * 75 % threshold; the practical-preparation certificates keep 7500 bp as a
 * träningsprov bar under the standing §35.1 non-official-format disclaimer.
 * Real blueprints move to exam_blueprints rows once the DB item pool exists.
 */
export type ExamConfig = {
  titleSv: string;
  durationSeconds: number;
  passThresholdBp: number;
  /** Graded questions to draw (capped by pool size at assembly). */
  gradedCount: number;
  diagnosticTitle: string;
  /** objectiveTitles matching this pattern form the diagnostic section. */
  diagnosticTagPattern: RegExp;
};

export const EXAM_CONFIG: Record<CertificationId, ExamConfig> = {
  forarintyg: {
    titleSv: "Träningssimulering — Förarintyg",
    durationSeconds: 20 * 60,
    passThresholdBp: 7500,
    gradedCount: 6,
    diagnosticTitle: "Diagnos — säkerhet",
    diagnosticTagPattern: /[Ss]äkerhet|[Nn]öd/,
  },
  kustskepparintyg: {
    titleSv: "Träningssimulering — Kustskepparintyg (förhandsversion)",
    durationSeconds: 15 * 60,
    passThresholdBp: 7500,
    gradedCount: 5,
    diagnosticTitle: "Diagnos — mörker och nedsatt sikt",
    diagnosticTagPattern: /[Mm]örker|[Ss]ikt|[Ff]yrsektor/,
  },
  src: {
    titleSv: "Träningssimulering — SRC (förhandsversion)",
    durationSeconds: 15 * 60,
    passThresholdBp: 7500,
    gradedCount: 5,
    diagnosticTitle: "Diagnos — nödtrafik",
    diagnosticTagPattern: /[Nn]öd|MAYDAY|DSC/,
  },
  batpraktik_dag_prep: {
    titleSv: "Kunskapskontroll — Båtpraktik dag (förhandsversion)",
    durationSeconds: 15 * 60,
    passThresholdBp: 7500,
    gradedCount: 5,
    diagnosticTitle: "Diagnos — säkerhet och MOB",
    diagnosticTagPattern: /[Ss]äkerhet|[Mm]an över bord|MOB/,
  },
  batpraktik_morker_prep: {
    titleSv: "Kunskapskontroll — Båtpraktik mörker (förhandsversion)",
    durationSeconds: 15 * 60,
    passThresholdBp: 7500,
    gradedCount: 5,
    diagnosticTitle: "Diagnos — ljusbilder",
    diagnosticTagPattern: /[Ll]jus|[Mm]örker/,
  },
  seglarintyg_1: {
    titleSv: "Kunskapskontroll — Seglarintyg 1 (förhandsversion)",
    durationSeconds: 15 * 60,
    passThresholdBp: 7500,
    gradedCount: 5,
    diagnosticTitle: "Diagnos — säkerhet under segel",
    diagnosticTagPattern: /[Mm]an över bord|[Vv]äjning/,
  },
  seglarintyg_2: {
    titleSv: "Kunskapskontroll — Seglarintyg 2 (förhandsversion)",
    durationSeconds: 15 * 60,
    passThresholdBp: 7500,
    gradedCount: 5,
    diagnosticTitle: "Diagnos — sikt och sjömanskap",
    diagnosticTagPattern: /[Dd]imma|[Ss]jömanskap/,
  },
  seglarintyg_3: {
    titleSv: "Kunskapskontroll — Seglarintyg 3 (förhandsversion)",
    durationSeconds: 15 * 60,
    passThresholdBp: 7500,
    gradedCount: 5,
    diagnosticTitle: "Diagnos — hårt väder och natt",
    diagnosticTagPattern: /[Hh]årt väder|[Nn]att|[Vv]äder/,
  },
};
