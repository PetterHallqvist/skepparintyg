"use client";

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
    // Stimulus kinds land with their trainers (4b lights, 4c vessels, 4d
    // knots/weather/plotter). Registered here as they arrive.
    default:
      return null;
  }
}
