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
import { NAVIGATION_ITEMS as KUST_NAVIGATION } from "./kustskepparintyg/navigation";
import { MORKER_ITEMS as KUST_MORKER } from "./kustskepparintyg/morker";
import { ELEKTRONIK_ITEMS as KUST_ELEKTRONIK } from "./kustskepparintyg/elektronik";
import { VADER_SJOMANSKAP_ITEMS as KUST_VADER } from "./kustskepparintyg/vader-sjomanskap";

import { PASS_ITEMS as SRC_PASS } from "./src/pass";
import { GRUNDER_ITEMS as SRC_GRUNDER } from "./src/grunder";
import { PROCEDURER_ITEMS as SRC_PROCEDURER } from "./src/procedurer";
import { NOD_ITEMS as SRC_NOD } from "./src/nod";

import { PASS_ITEMS as BP_DAG_PASS } from "./batpraktik_dag_prep/pass";
import { SAKERHET_ITEMS as BP_DAG_SAKERHET } from "./batpraktik_dag_prep/sakerhet";
import { NAVIGATION_PRAKTIK_ITEMS as BP_DAG_NAVIGATION } from "./batpraktik_dag_prep/navigation-praktik";
import { MANOVRERING_ITEMS as BP_DAG_MANOVRERING } from "./batpraktik_dag_prep/manovrering";

import { PASS_ITEMS as BP_MORKER_PASS } from "./batpraktik_morker_prep/pass";
import { LJUS_IGENKANNING_ITEMS as BP_MORKER_LJUS } from "./batpraktik_morker_prep/ljus-igenkanning";
import { MORKERNAVIGATION_ITEMS as BP_MORKER_NAV } from "./batpraktik_morker_prep/morkernavigation";
import { SAKERHET_MORKER_ITEMS as BP_MORKER_SAKERHET } from "./batpraktik_morker_prep/sakerhet-morker";

import { PASS_ITEMS as SEGLAR1_PASS } from "./seglarintyg_1/pass";
import { RIGG_OCH_SEGEL_ITEMS as SEGLAR1_RIGG } from "./seglarintyg_1/rigg-och-segel";
import { MANOVRER_ITEMS as SEGLAR1_MANOVRER } from "./seglarintyg_1/manovrer";
import { SJOVETT_ITEMS as SEGLAR1_SJOVETT } from "./seglarintyg_1/sjovett";

import { PASS_ITEMS as SEGLAR2_PASS } from "./seglarintyg_2/pass";
import { BATSYSTEM_ITEMS as SEGLAR2_BATSYSTEM } from "./seglarintyg_2/batsystem";
import { MANOVRERING_HAMN_ITEMS as SEGLAR2_HAMN } from "./seglarintyg_2/manovrering-hamn";
import { VADER_FOG_ITEMS as SEGLAR2_VADER } from "./seglarintyg_2/vader-fog";

import { PASS_ITEMS as SEGLAR3_PASS } from "./seglarintyg_3/pass";
import { OFFSHORE_ITEMS as SEGLAR3_OFFSHORE } from "./seglarintyg_3/offshore";
import { HARDVADER_ITEMS as SEGLAR3_HARDVADER } from "./seglarintyg_3/hardvader";
import { NATT_UNDERHALL_ITEMS as SEGLAR3_NATT } from "./seglarintyg_3/natt-underhall";

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
  kustskepparintyg: {
    pass: KUST_PASS,
    navigation: KUST_NAVIGATION,
    morker: KUST_MORKER,
    elektronik: KUST_ELEKTRONIK,
    "vader-sjomanskap": KUST_VADER,
  },
  src: {
    pass: SRC_PASS,
    grunder: SRC_GRUNDER,
    procedurer: SRC_PROCEDURER,
    nod: SRC_NOD,
  },
  batpraktik_dag_prep: {
    pass: BP_DAG_PASS,
    sakerhet: BP_DAG_SAKERHET,
    "navigation-praktik": BP_DAG_NAVIGATION,
    manovrering: BP_DAG_MANOVRERING,
  },
  batpraktik_morker_prep: {
    pass: BP_MORKER_PASS,
    "ljus-igenkanning": BP_MORKER_LJUS,
    morkernavigation: BP_MORKER_NAV,
    "sakerhet-morker": BP_MORKER_SAKERHET,
  },
  seglarintyg_1: {
    pass: SEGLAR1_PASS,
    "rigg-och-segel": SEGLAR1_RIGG,
    manovrer: SEGLAR1_MANOVRER,
    sjovett: SEGLAR1_SJOVETT,
  },
  seglarintyg_2: {
    pass: SEGLAR2_PASS,
    batsystem: SEGLAR2_BATSYSTEM,
    "manovrering-hamn": SEGLAR2_HAMN,
    "vader-fog": SEGLAR2_VADER,
  },
  seglarintyg_3: {
    pass: SEGLAR3_PASS,
    offshore: SEGLAR3_OFFSHORE,
    hardvader: SEGLAR3_HARDVADER,
    "natt-underhall": SEGLAR3_NATT,
  },
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
