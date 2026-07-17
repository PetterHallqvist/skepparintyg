import "server-only";

import type { CertificationId } from "@/lib/certifications/registry";
import type { DemoItem } from "../demo";

import { PASS_ITEMS as FORAR_PASS } from "./forarintyg/pass";
import { LIGHTS_ITEMS } from "./forarintyg/lights";
import { RULES_ITEMS } from "./forarintyg/rules";
import { KNOP_ITEMS } from "./forarintyg/knop";
import { VADER_ITEMS } from "./forarintyg/vader";
import { PLOTTER_ITEMS } from "./forarintyg/plotter";
import { PASS_ITEMS as KUST_PASS } from "./kustskepparintyg/pass";
import { PASS_ITEMS as SRC_PASS } from "./src/pass";
import { PASS_ITEMS as BP_DAG_PASS } from "./batpraktik_dag_prep/pass";
import { PASS_ITEMS as BP_MORKER_PASS } from "./batpraktik_morker_prep/pass";
import { PASS_ITEMS as SEGLAR1_PASS } from "./seglarintyg_1/pass";
import { PASS_ITEMS as SEGLAR2_PASS } from "./seglarintyg_2/pass";
import { PASS_ITEMS as SEGLAR3_PASS } from "./seglarintyg_3/pass";

/**
 * Practice-track registry, keyed (certification, track) — server-only, holds
 * answer keys. STRICT: an unknown combination returns null, never a fallback.
 * The old `?? DEMO_ITEMS` default would leak Förarintyg questions into every
 * other certification — the exact bug this phase exists to prevent. A track
 * is playable only if its certification's registry entry declares it AND an
 * item file exists here.
 */
const TRACKS: Record<CertificationId, Record<string, DemoItem[]>> = {
  forarintyg: {
    pass: FORAR_PASS,
    ljus: LIGHTS_ITEMS,
    vajning: RULES_ITEMS,
    knop: KNOP_ITEMS,
    vader: VADER_ITEMS,
    plotter: PLOTTER_ITEMS,
  },
  kustskepparintyg: { pass: KUST_PASS },
  src: { pass: SRC_PASS },
  batpraktik_dag_prep: { pass: BP_DAG_PASS },
  batpraktik_morker_prep: { pass: BP_MORKER_PASS },
  seglarintyg_1: { pass: SEGLAR1_PASS },
  seglarintyg_2: { pass: SEGLAR2_PASS },
  seglarintyg_3: { pass: SEGLAR3_PASS },
};

export function getTrackItems(
  cert: CertificationId,
  track: string,
): DemoItem[] | null {
  return TRACKS[cert]?.[track] ?? null;
}

export function trackCount(cert: CertificationId, track: string): number {
  return getTrackItems(cert, track)?.length ?? 0;
}

/** Test-only view of the full registry (isolation proofs). */
export function allTrackEntries(): Array<{
  cert: CertificationId;
  track: string;
  items: DemoItem[];
}> {
  return (Object.keys(TRACKS) as CertificationId[]).flatMap((cert) =>
    Object.entries(TRACKS[cert]).map(([track, items]) => ({
      cert,
      track,
      items,
    })),
  );
}
