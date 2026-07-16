"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Radio, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  classifyDuration,
  scheduleBlasts,
  type Blast,
} from "@/lib/audio/horn";
import { cn } from "@/lib/utils";
import type { ResponseWidgetProps } from "@/components/learning/renderers/types";

/**
 * Original horn synthesis (SPEC §25.2 — no recordings). A deep sawtooth tone
 * with soft attack/release envelopes; volume is kept low and playback is never
 * automatic. `HornPlayButton` plays a signal for listen tasks; `HornHoldControl`
 * captures a learner-produced sequence of held durations for sound_produce.
 */

const FREQ = 180;
const GAIN = 0.14;

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

function useHornAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const liveRef = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null);

  const ensure = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const Ctor = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
      if (!Ctor) return null;
      ctxRef.current = new Ctor();
    }
    if (ctxRef.current.state === "suspended") void ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const playBlast = useCallback(
    (ctx: AudioContext, startTime: number, durationSec: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.value = FREQ;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(GAIN, startTime + 0.02);
      gain.gain.setValueAtTime(GAIN, startTime + durationSec - 0.04);
      gain.gain.linearRampToValueAtTime(0, startTime + durationSec);
      osc.connect(gain).connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + durationSec + 0.02);
    },
    [],
  );

  const playPattern = useCallback(
    (pattern: Blast[]) => {
      const ctx = ensure();
      if (!ctx) return;
      const base = ctx.currentTime + 0.05;
      for (const ev of scheduleBlasts(pattern)) {
        playBlast(ctx, base + ev.startMs / 1000, ev.durationMs / 1000);
      }
    },
    [ensure, playBlast],
  );

  const startTone = useCallback(() => {
    const ctx = ensure();
    if (!ctx || liveRef.current) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.value = FREQ;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(GAIN, ctx.currentTime + 0.02);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    liveRef.current = { osc, gain };
  }, [ensure]);

  const stopTone = useCallback(() => {
    const ctx = ctxRef.current;
    const live = liveRef.current;
    if (!ctx || !live) return;
    const t = ctx.currentTime;
    live.gain.gain.cancelScheduledValues(t);
    live.gain.gain.setValueAtTime(live.gain.gain.value, t);
    live.gain.gain.linearRampToValueAtTime(0, t + 0.03);
    live.osc.stop(t + 0.05);
    liveRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      liveRef.current?.osc.stop();
      liveRef.current = null;
      void ctxRef.current?.close();
      ctxRef.current = null;
    };
  }, []);

  return { playPattern, startTone, stopTone };
}

/** Listen task: an explicit, low-volume play button (never autoplay). */
export function HornPlayButton({ pattern }: { pattern: Blast[] }) {
  const { playPattern } = useHornAudio();
  const [playing, setPlaying] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          setPlaying(true);
          playPattern(pattern);
          window.setTimeout(() => setPlaying(false), 600);
        }}
      >
        <Volume2 aria-hidden="true" className={cn(playing && "text-primary")} />
        Spela ljudsignal
      </Button>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Radio aria-hidden="true" className="size-3.5" />
        Syntetiskt horn. Håll volymen låg.
      </p>
    </div>
  );
}

const BLAST_SV: Record<string, string> = { short: "kort", long: "lång" };

/** Produce task: press-and-hold (pointer or spacebar) records blast durations. */
export function HornHoldControl({ disabled, onChange }: ResponseWidgetProps) {
  const { startTone, stopTone } = useHornAudio();
  const [taps, setTaps] = useState<number[]>([]);
  const [pressing, setPressing] = useState(false);
  const pressStart = useRef<number | null>(null);

  const begin = useCallback(() => {
    if (disabled || pressStart.current !== null) return;
    pressStart.current = Date.now();
    setPressing(true);
    startTone();
  }, [disabled, startTone]);

  const end = useCallback(() => {
    if (pressStart.current === null) return;
    const held = Date.now() - pressStart.current;
    pressStart.current = null;
    setPressing(false);
    stopTone();
    setTaps((prev) => [...prev, held]);
  }, [stopTone]);

  // Emit the response after state settles — never during a render pass.
  useEffect(() => {
    onChange(taps.length > 0 ? { taps } : null);
  }, [taps, onChange]);

  // Spacebar hold — keydown repeats, so guard with pressStart.
  useEffect(() => {
    if (disabled) return;
    const down = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        begin();
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        end();
      }
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [begin, end, disabled]);

  const clear = () => setTaps([]);

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={disabled}
        aria-label="Håll ned för att tuta — släpp för att avsluta stöten"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          begin();
        }}
        onPointerUp={end}
        onPointerCancel={end}
        className={cn(
          "flex min-h-24 w-full select-none items-center justify-center gap-3 rounded-lg border-2 border-dashed text-base font-medium transition-colors touch-none",
          pressing
            ? "border-primary bg-accent text-accent-foreground"
            : "border-border bg-card hover:border-muted-foreground/50",
          disabled && "opacity-60",
        )}
      >
        <Radio aria-hidden="true" className="size-5" />
        Håll ned för att tuta
      </button>

      <div className="flex flex-wrap items-center gap-2" aria-live="polite">
        {taps.length === 0 ? (
          <span className="text-sm text-muted-foreground">
            Inga stötar ännu. Håll knappen (eller mellanslag) kort eller länge.
          </span>
        ) : (
          taps.map((ms, i) => {
            const cls = classifyDuration(ms);
            return (
              <span
                key={i}
                className={cn(
                  "font-readout rounded-md border px-2 py-1 text-xs",
                  cls === "short" && "border-primary/50 text-primary",
                  cls === "long" && "border-sea-400/50 text-sea-300",
                  cls === null && "border-warning/50 text-warning",
                )}
              >
                {cls ? BLAST_SV[cls] : "otydlig"}
              </span>
            );
          })
        )}
      </div>

      {taps.length > 0 ? (
        <Button type="button" variant="ghost" size="sm" onClick={clear} disabled={disabled}>
          Rensa
        </Button>
      ) : null}
    </div>
  );
}
