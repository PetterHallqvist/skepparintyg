/**
 * Sound-signal engine (SPEC §25.1–25.2). Manoeuvring and warning signals are
 * modelled as data — a sequence of short/prolonged blasts — with a pure
 * scheduler (for playback + waveform rendering) and a pure classifier (for
 * grading a learner's reproduced sequence). WebAudio synthesis lives in the
 * component layer; everything testable lives here.
 *
 * COLREG Rule 34/35 durations: a short blast is ~1 s, a prolonged blast 4–6 s.
 */

export type Blast = "short" | "long";

export type BlastEvent = { startMs: number; durationMs: number; blast: Blast };

const SHORT_MS = 1000;
const LONG_MS = 4500;
const GAP_MS = 1000; // silence between blasts in a signal

const DURATION: Record<Blast, number> = { short: SHORT_MS, long: LONG_MS };

/** Standard signals used in trainer content (§28.8). */
export const SOUND_SIGNALS = {
  alter_starboard: ["short"],
  alter_port: ["short", "short"],
  operating_astern: ["short", "short", "short"],
  doubt: ["short", "short", "short", "short", "short"],
  power_underway_restricted: ["long"],
  making_way_none_restricted: ["long", "long"],
} satisfies Record<string, Blast[]>;

export type SignalKey = keyof typeof SOUND_SIGNALS;

export const SIGNAL_MEANING_SV: Record<SignalKey, string> = {
  alter_starboard: "Jag ändrar min kurs till styrbord",
  alter_port: "Jag ändrar min kurs till babord",
  operating_astern: "Mina maskiner går back",
  doubt: "Tvivels- eller varningssignal (minst fem korta)",
  power_underway_restricted: "Maskindrivet fartyg med gång i nedsatt sikt",
  making_way_none_restricted: "Maskindrivet fartyg utan fart i nedsatt sikt",
};

/** Schedule a signal to absolute-timed events, starting at 0. Deterministic. */
export function scheduleBlasts(pattern: Blast[]): BlastEvent[] {
  const events: BlastEvent[] = [];
  let t = 0;
  pattern.forEach((blast, i) => {
    const durationMs = DURATION[blast];
    events.push({ startMs: t, durationMs, blast });
    t += durationMs;
    if (i < pattern.length - 1) t += GAP_MS;
  });
  return events;
}

/** Total wall-clock length of a scheduled signal, ms. */
export function signalLengthMs(pattern: Blast[]): number {
  const events = scheduleBlasts(pattern);
  if (events.length === 0) return 0;
  const last = events[events.length - 1];
  return last.startMs + last.durationMs;
}

// --- classification / grading ----------------------------------------------

// Tolerance bands around the nominal durations. A press between the bands is
// ambiguous (null) rather than silently rounded — the learner is told to hold
// clearly short or clearly long.
const SHORT_BAND = { min: 250, max: 2200 };
const LONG_BAND = { min: 3000, max: 9000 };

/** Classify one held duration into a blast, or null if ambiguous. */
export function classifyDuration(ms: number): Blast | null {
  if (ms >= SHORT_BAND.min && ms <= SHORT_BAND.max) return "short";
  if (ms >= LONG_BAND.min && ms <= LONG_BAND.max) return "long";
  return null;
}

/** Classify a sequence of held durations; ambiguous presses become null. */
export function classifyTaps(durations: number[]): (Blast | null)[] {
  return durations.map(classifyDuration);
}

export type SoundGrade = {
  correct: boolean;
  expected: Blast[];
  produced: (Blast | null)[];
  /** Index of the first mismatch (or extra/missing), or null if fully correct. */
  firstMismatch: number | null;
  ambiguousCount: number;
};

/** Grade a reproduced signal against the target pattern. Pure. */
export function gradeSoundProduce(
  expected: Blast[],
  taps: number[],
): SoundGrade {
  const produced = classifyTaps(taps);
  const ambiguousCount = produced.filter((b) => b === null).length;

  let firstMismatch: number | null = null;
  const n = Math.max(expected.length, produced.length);
  for (let i = 0; i < n; i++) {
    if (expected[i] !== produced[i]) {
      firstMismatch = i;
      break;
    }
  }

  return {
    correct: firstMismatch === null && ambiguousCount === 0,
    expected,
    produced,
    firstMismatch,
    ambiguousCount,
  };
}
