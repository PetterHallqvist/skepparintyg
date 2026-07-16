/**
 * Client-safe trainer metadata (no answer keys). Drives the /app/ova hub and
 * per-trainer page headers. Item counts are read server-side from the track
 * registry; this file only names and describes each trainer.
 */

export type TrackMeta = {
  id: string;
  title: string;
  blurb: string;
  route: string;
  /** lucide icon name, resolved in the client component. */
  icon: string;
};

export const TRACK_META: TrackMeta[] = [
  {
    id: "demo",
    title: "Dagens pass",
    blurb: "Blandade uppgifter — repetition, färdighet och felboken i ett pass.",
    route: "/app/ova",
    icon: "GraduationCap",
  },
  {
    id: "ljus",
    title: "Ljus, dagersignaler & ljud",
    blurb: "Känn igen fartygsljus och fyrkaraktärer, bygg ljusbilder och ge ljudsignaler.",
    route: "/app/ova/ljus",
    icon: "Lightbulb",
  },
  {
    id: "vajning",
    title: "Väjningsregler",
    blurb: "Bedöm möte, korsande och upphinnande — vem viker, och vad gör du?",
    route: "/app/ova/vajning",
    icon: "Sailboat",
  },
];

export function trackMeta(id: string): TrackMeta | undefined {
  return TRACK_META.find((t) => t.id === id);
}
