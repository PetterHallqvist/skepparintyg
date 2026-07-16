/**
 * Quizlet-compatible export (SPEC §37.2). UTF-8, tab between front/back, one
 * card per line — the layout Quizlet's "Import" accepts. Deterministic: the
 * same deck always produces byte-identical output. We do not claim a native
 * Quizlet format or official integration (§37.2).
 */

// Quizlet uses TAB as the term/definition separator and NEWLINE between rows,
// so those must never appear inside a field. Validation already rejects them;
// here we also collapse defensively.
function clean(s) {
  return String(s).replace(/[\t\r\n]+/g, " ").trim();
}

/** Front/back TSV. Extra explanation is appended to the back when present. */
export function toQuizletTsv(deck) {
  const lines = deck.cards.map((c) => {
    const back = c.extra_explanation
      ? `${clean(c.back)} — ${clean(c.extra_explanation)}`
      : clean(c.back);
    return `${clean(c.front)}\t${back}`;
  });
  // Trailing newline for POSIX-friendly text files; join is order-stable.
  return lines.join("\n") + "\n";
}

/** Short import guide shipped alongside the TSV. */
export function quizletGuide(deck) {
  return [
    `# ${deck.title_sv} — import till Quizlet`,
    "",
    "1. Skapa ett nytt studieset i Quizlet.",
    '2. Välj "Importera".',
    '3. Ställ in avgränsare: mellan term och definition = TABB, mellan kort = NY RAD.',
    `4. Klistra in innehållet i ${deck.id}.tsv.`,
    "",
    "Filen är UTF-8. Svenska tecken (å ä ö) stöds.",
    "",
    "Sjöklart erbjuder ingen officiell Quizlet-integration — detta är ett",
    "kompatibelt importformat.",
    "",
  ].join("\n");
}
