"use client";

import {
  DayShapeView,
  LightScene,
  type LightSceneSpec,
} from "@/components/trainers/light-scene";
import { HornPlayButton } from "@/components/trainers/horn-control";
import { VesselScene } from "@/components/trainers/vessel-scene";
import type { Blast } from "@/lib/audio/horn";
import type { Scene } from "@/lib/trainers/rules-schema";

/**
 * Stimulus vs response (SPEC §24–27 architecture). Many trainer tasks pair a
 * visual/audio *stimulus* — an animated light, a vessel scene, a plotter frame,
 * knot frames, a weather card — with an existing *response* kind. The player
 * renders the stimulus above the response widget, driven by
 * `interaction.stimulus`. Stimulus renderers are registered here per sub-phase;
 * an unknown or absent stimulus renders nothing.
 */

export type StimulusSpec = { kind: string } & Record<string, unknown>;

export function StimulusView({
  interaction,
}: {
  interaction: Record<string, unknown>;
}) {
  const stimulus = interaction.stimulus as StimulusSpec | undefined;
  if (!stimulus || typeof stimulus.kind !== "string") return null;

  switch (stimulus.kind) {
    case "light_scene":
      return <LightScene spec={stimulus as LightSceneSpec} />;
    case "day_shape":
      return <DayShapeView shape={String(stimulus.shape)} />;
    case "sound":
      return <HornPlayButton pattern={stimulus.pattern as Blast[]} />;
    case "vessel_scene":
      return <VesselScene scene={stimulus.scene as Scene} />;
    // Further kinds land with their trainers (4d knots/weather/plotter).
    default:
      return null;
  }
}
