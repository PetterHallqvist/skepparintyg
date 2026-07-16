"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ResponseWidgetProps } from "./types";

/**
 * waypoint_entry response widget (SPEC §21.5 #33). Two coordinate fields —
 * latitude and longitude — entered as text (e.g. "59°20,5'N"). The server
 * parses and checks for digit transposition; the client only collects.
 */
export function WaypointEntry({ disabled, onChange }: ResponseWidgetProps) {
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");

  const emit = (nextLat: string, nextLon: string) => {
    onChange(
      nextLat.trim() !== "" && nextLon.trim() !== ""
        ? { lat: nextLat.trim(), lon: nextLon.trim() }
        : null,
    );
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="grid gap-1.5">
        <Label htmlFor="wp-lat" className="text-label text-muted-foreground">
          Latitud
        </Label>
        <Input
          id="wp-lat"
          autoComplete="off"
          inputMode="text"
          placeholder="59°20,5'N"
          value={lat}
          disabled={disabled}
          className="font-readout"
          onChange={(e) => {
            setLat(e.target.value);
            emit(e.target.value, lon);
          }}
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="wp-lon" className="text-label text-muted-foreground">
          Longitud
        </Label>
        <Input
          id="wp-lon"
          autoComplete="off"
          inputMode="text"
          placeholder="018°03,2'E"
          value={lon}
          disabled={disabled}
          className="font-readout"
          onChange={(e) => {
            setLon(e.target.value);
            emit(lat, e.target.value);
          }}
        />
      </div>
    </div>
  );
}
