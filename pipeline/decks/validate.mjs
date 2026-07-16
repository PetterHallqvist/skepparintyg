/**
 * Deck validation (SPEC §37.6). Pure — returns a list of problems, empty when
 * the deck is clean. The build fails on any problem; CI runs the same checks.
 */

const REQUIRED_FIELDS = [
  "card_id",
  "certification",
  "syllabus_version",
  "objective_id",
  "front",
  "back",
  "source_short",
  "source_url_or_id",
  "card_type",
  "content_version",
  "last_reviewed_at",
];

// Fronts must not contain a tab/newline (breaks TSV) and must be non-empty.
const CONTROL_CHARS = /[\t\r\n]/;

export function validateDeck(deck) {
  const problems = [];

  if (!deck.id) problems.push("deck saknar id");
  if (!deck.title_sv) problems.push("deck saknar title_sv");
  if (deck.access !== "free" && deck.access !== "paid")
    problems.push(`deck ${deck.id}: ogiltig access "${deck.access}"`);

  const fronts = new Set();
  const ids = new Set();

  for (const c of deck.cards) {
    for (const f of REQUIRED_FIELDS) {
      if (!c[f] || String(c[f]).trim() === "") {
        problems.push(`kort ${c.card_id ?? "?"}: saknar fält ${f}`);
      }
    }
    // §37.6: no missing source
    if (!c.source_short || !c.source_url_or_id) {
      problems.push(`kort ${c.card_id}: saknar källa`);
    }
    // §37.6: no duplicate front within a deck
    if (fronts.has(c.front)) {
      problems.push(`kort ${c.card_id}: dubblett-front i decket`);
    }
    fronts.add(c.front);
    if (ids.has(c.card_id)) {
      problems.push(`dubblett card_id: ${c.card_id}`);
    }
    ids.add(c.card_id);
    // §37.6: encoding-safe fronts/backs (no tabs/newlines)
    if (CONTROL_CHARS.test(c.front) || CONTROL_CHARS.test(c.back)) {
      problems.push(`kort ${c.card_id}: otillåtet styrtecken i front/back`);
    }
  }

  // §37.6: expected card count
  if (deck.expectedCount != null && deck.cards.length !== deck.expectedCount) {
    problems.push(
      `deck ${deck.id}: förväntat ${deck.expectedCount} kort, fann ${deck.cards.length}`,
    );
  }

  return problems;
}
