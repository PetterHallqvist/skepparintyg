"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { VesselSilhouette } from "@/components/trainers/light-scene";
import type {
  LightColor,
  LightRole,
  NavigationLight,
} from "@/lib/lights/schema";
import { cn } from "@/lib/utils";
import type { ResponseWidgetProps } from "./types";

/**
 * light_build response widget (SPEC §25.3). The learner selects which lanterns
 * a vessel must show; the silhouette previews the current build as a night
 * scene. The palette never reveals which lights are correct — the server grades
 * by role + colour.
 */

type PaletteEntry = {
  key: string;
  role: LightRole;
  color: LightColor;
  label_sv: string;
};

export function LightBuild({ interaction, disabled, onChange }: ResponseWidgetProps) {
  const palette = (interaction.palette as PaletteEntry[]) ?? [];
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (key: string, on: boolean) => {
    const next = new Set(selected);
    if (on) next.add(key);
    else next.delete(key);
    setSelected(next);
    onChange(next.size > 0 ? { selected: [...next].sort() } : null);
  };

  const previewLights: NavigationLight[] = palette
    .filter((p) => selected.has(p.key))
    .map((p) => ({
      role: p.role,
      color: p.color,
      arcStartDeg: 0,
      arcEndDeg: 0,
    }));

  return (
    <div className="grid items-start gap-5 sm:grid-cols-[auto_1fr]">
      <div className="flex justify-center rounded-lg border border-border bg-navy-950/40 p-3">
        <VesselSilhouette lights={previewLights} />
      </div>
      <fieldset className="grid gap-2" aria-label="Välj lanternor">
        {palette.map((p) => (
          <Label
            key={p.key}
            className={cn(
              "flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-normal transition-colors hover:border-muted-foreground/40",
              selected.has(p.key) && "border-primary bg-accent",
              disabled && "pointer-events-none opacity-70",
            )}
          >
            <Checkbox
              checked={selected.has(p.key)}
              onCheckedChange={(v) => toggle(p.key, v === true)}
              disabled={disabled}
            />
            <span
              aria-hidden="true"
              className="size-3 shrink-0 rounded-full border border-black/30"
              style={{ backgroundColor: SWATCH[p.color] }}
            />
            {p.label_sv}
          </Label>
        ))}
      </fieldset>
    </div>
  );
}

const SWATCH: Record<LightColor, string> = {
  white: "#f6f5ee",
  red: "#e5484d",
  green: "#46a758",
  yellow: "#ffe629",
};
