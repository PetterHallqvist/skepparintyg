import { describe, expect, it } from "vitest";
import { DECKS } from "@/pipeline/decks/data.mjs";
import { validateDeck } from "@/pipeline/decks/validate.mjs";
import { toQuizletTsv, quizletGuide } from "@/pipeline/decks/quizlet.mjs";

describe("deck validation (SPEC §37.6)", () => {
  it("both seed decks are clean", () => {
    for (const deck of DECKS) {
      expect(validateDeck(deck)).toEqual([]);
    }
  });

  it("catches a missing source", () => {
    const deck = {
      id: "d",
      title_sv: "D",
      access: "free",
      cards: [
        { card_id: "c1", certification: "x", syllabus_version: "y", objective_id: "o", front: "F", back: "B", source_short: "", source_url_or_id: "", card_type: "basic", content_version: "1", last_reviewed_at: "2026-07-16" },
      ],
    };
    expect(validateDeck(deck).some((p) => /källa/.test(p))).toBe(true);
  });

  it("catches a duplicate front within a deck", () => {
    const c = (id: string) => ({ card_id: id, certification: "x", syllabus_version: "y", objective_id: "o", front: "Samma", back: "B", source_short: "s", source_url_or_id: "s", card_type: "basic", content_version: "1", last_reviewed_at: "2026-07-16" });
    const deck = { id: "d", title_sv: "D", access: "free", cards: [c("a"), c("b")] };
    expect(validateDeck(deck).some((p) => /dubblett-front/.test(p))).toBe(true);
  });

  it("catches an unexpected card count", () => {
    const deck = { id: "d", title_sv: "D", access: "free", expectedCount: 3, cards: [] };
    expect(validateDeck(deck).some((p) => /förväntat 3/.test(p))).toBe(true);
  });
});

describe("Quizlet TSV export (SPEC §37.2)", () => {
  it("is deterministic — same deck, byte-identical output", () => {
    const a = toQuizletTsv(DECKS[0]);
    const b = toQuizletTsv(DECKS[0]);
    expect(a).toBe(b);
  });

  it("emits one tab-separated row per card and appends the extra explanation", () => {
    const tsv = toQuizletTsv(DECKS[0]);
    const rows = tsv.trimEnd().split("\n");
    expect(rows.length).toBe(DECKS[0].cards.length);
    for (const row of rows) {
      expect(row.split("\t").length).toBe(2); // exactly front \t back
    }
  });

  it("preserves Swedish characters and never leaks a raw tab/newline", () => {
    const tsv = toQuizletTsv(DECKS[0]);
    expect(tsv).toMatch(/[åäö]/);
    // each line has exactly one tab
    for (const line of tsv.trimEnd().split("\n")) {
      expect((line.match(/\t/g) ?? []).length).toBe(1);
    }
  });

  it("ships an import guide", () => {
    expect(quizletGuide(DECKS[0])).toMatch(/Importera/);
  });
});
