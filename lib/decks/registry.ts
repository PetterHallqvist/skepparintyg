import { DECKS } from "@/pipeline/decks/data.mjs";

/**
 * Client/server-safe deck metadata for the app (SPEC §37.7). Derived from the
 * pipeline's single source of truth. Card content is not needed here — only id,
 * title, access tier and count — but importing the data module keeps one source.
 */

export type DeckAccess = "free" | "paid";
export type DeckMeta = {
  id: string;
  title_sv: string;
  access: DeckAccess;
  cardCount: number;
};

export const DECK_META: DeckMeta[] = DECKS.map((d) => ({
  id: d.id,
  title_sv: d.title_sv,
  access: d.access as DeckAccess,
  cardCount: d.cards.length,
}));

export function deckMeta(id: string): DeckMeta | undefined {
  return DECK_META.find((d) => d.id === id);
}
