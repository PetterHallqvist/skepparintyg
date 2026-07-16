import "server-only";

import { DEMO_ITEMS, type DemoItem } from "../demo";
import { LIGHTS_ITEMS } from "./lights";
import { RULES_ITEMS } from "./rules";
import { KNOP_ITEMS } from "./knop";
import { VADER_ITEMS } from "./vader";
import { PLOTTER_ITEMS } from "./plotter";

/**
 * Practice-track registry (server-only — holds answer keys). Each trainer route
 * plays one track through the same session player, so SRS, felboken and
 * readiness treat trainer items like any other. Unknown ids fall back to the
 * demo track.
 */
export const TRACK_ITEMS: Record<string, DemoItem[]> = {
  demo: DEMO_ITEMS,
  ljus: LIGHTS_ITEMS,
  vajning: RULES_ITEMS,
  knop: KNOP_ITEMS,
  vader: VADER_ITEMS,
  plotter: PLOTTER_ITEMS,
};

export function getTrackItems(id: string): DemoItem[] {
  return TRACK_ITEMS[id] ?? DEMO_ITEMS;
}

export function trackCount(id: string): number {
  return getTrackItems(id).length;
}
