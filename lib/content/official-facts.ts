/**
 * Verified official-fact register (SPEC §4).
 *
 * Values checked 2026-07-16 against public NFB/authority pages. These are
 * DATA, not constants baked into components — every display goes through
 * this module and carries a SourceStamp. Phase 1 moves this register into
 * the `official_facts` table with an admin editor; keep the shape stable.
 *
 * HUMAN_VERIFY: re-check all values within 14 days of launch (SPEC M9 DoD).
 */
export type OfficialFact = {
  id: string;
  certificationId:
    "forarintyg" | "kustskepparintyg" | "src" | "batpraktik_dag_prep" | null;
  /** Short label, sv-SE. */
  label: string;
  /** Display value, sv-SE. */
  value: string;
  /** Approved conservative public phrasing (SPEC §4 public-copy rules). */
  publicCopy: string;
  sourceOrg: string;
  sourceUrl: string;
  verifiedAt: string;
  reviewBy: string;
};

export const OFFICIAL_FACTS: readonly OfficialFact[] = [
  {
    id: "pass_threshold_digital",
    certificationId: null,
    label: "Godkäntgräns",
    value: "75 %",
    publicCopy:
      "Nuvarande officiell godkäntgräns för de digitala proven är 75 %.",
    sourceOrg: "NFB",
    sourceUrl: "https://www.batlivsutbildning.se/",
    verifiedAt: "2026-07-16",
    reviewBy: "2026-10-16",
  },
  {
    id: "forar_exam_time",
    certificationId: "forarintyg",
    label: "Provtid Förarintyg",
    value: "högst 90 minuter",
    publicCopy: "Nuvarande officiell provtid: högst 90 minuter.",
    sourceOrg: "NFB",
    sourceUrl: "https://www.batlivsutbildning.se/",
    verifiedAt: "2026-07-16",
    reviewBy: "2026-10-16",
  },
  {
    id: "kust_exam_time",
    certificationId: "kustskepparintyg",
    label: "Provtid Kustskepparintyg",
    value: "högst 120 minuter",
    publicCopy: "Nuvarande officiell provtid: högst 120 minuter.",
    sourceOrg: "NFB",
    sourceUrl: "https://www.batlivsutbildning.se/",
    verifiedAt: "2026-07-16",
    reviewBy: "2026-10-16",
  },
  {
    id: "src_exam_time",
    certificationId: "src",
    label: "Provtid SRC (digital del)",
    value: "högst 60 minuter",
    publicCopy:
      "Nuvarande officiell provtid för den digitala delen: högst 60 minuter. Officiella krav omfattar även praktisk/simulatorkompetens.",
    sourceOrg: "NFB",
    sourceUrl: "https://www.batlivsutbildning.se/",
    verifiedAt: "2026-07-16",
    reviewBy: "2026-10-16",
  },
  {
    id: "forar_min_age",
    certificationId: "forarintyg",
    label: "Lägsta ålder Förarintyg",
    value: "12 år",
    publicCopy:
      "Lägsta ålder för Förarintyg är 12 år. För omyndiga elever ägs kontot och köpet av en vuxen/vårdnadshavare.",
    sourceOrg: "NFB",
    sourceUrl: "https://www.batlivsutbildning.se/",
    verifiedAt: "2026-07-16",
    reviewBy: "2026-10-16",
  },
  {
    id: "exam_fees_separate",
    certificationId: null,
    label: "Officiella provavgifter",
    value: "betalas separat",
    publicCopy:
      "Provlicens och bokningsavgift betalas separat till den officiella processen och ingår inte i denna utbildning.",
    sourceOrg: "NFB",
    sourceUrl: "https://www.batlivsutbildning.se/",
    verifiedAt: "2026-07-16",
    reviewBy: "2026-10-16",
  },
  {
    id: "vhf_permit",
    certificationId: "src",
    label: "VHF-tillstånd",
    value: "kräver tillstånd från PTS",
    publicCopy:
      "För att använda marin VHF i fritidsbåt krävs tillstånd från Post- och telestyrelsen (PTS).",
    sourceOrg: "PTS",
    sourceUrl: "https://pts.se/",
    verifiedAt: "2026-07-16",
    reviewBy: "2026-10-16",
  },
] as const;

export function getFact(id: string): OfficialFact {
  const fact = OFFICIAL_FACTS.find((f) => f.id === id);
  if (!fact) throw new Error(`Okänt officiellt faktum: ${id}`);
  return fact;
}
