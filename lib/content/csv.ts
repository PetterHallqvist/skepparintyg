/**
 * CSV import/export for the content pipeline (SPEC §39.4, M1 DoD).
 *
 * Requirements: lossless round-trip of Swedish text (åäö, quotes, newlines)
 * and spreadsheet formula-injection protection — a cell must never reach
 * Excel/Sheets starting with = + - @ or a control character that turns it
 * into a formula (OWASP CSV injection).
 *
 * No CSV library (SPEC §56.1): RFC 4180 quoting is ~40 lines.
 */

const NEEDS_QUOTING = /[",\n\r]/;
const FORMULA_TRIGGER = /^[=+\-@\t\r]/;
/** Excel-recognised guard prefix we add on export and strip on import. */
const GUARD = "'";

export function escapeCell(value: string): string {
  let cell = value;
  // Guard formula triggers; double a genuine leading apostrophe so the
  // import side can strip exactly one guard losslessly.
  if (FORMULA_TRIGGER.test(cell) || cell.startsWith(GUARD)) {
    cell = GUARD + cell;
  }
  if (NEEDS_QUOTING.test(cell) || cell.startsWith(GUARD)) {
    cell = `"${cell.replaceAll('"', '""')}"`;
  }
  return cell;
}

export function unescapeCell(cell: string): string {
  return cell.startsWith(GUARD) ? cell.slice(1) : cell;
}

export function toCsv(headers: string[], rows: string[][]): string {
  const lines = [headers.map(escapeCell).join(",")];
  for (const row of rows) {
    if (row.length !== headers.length) {
      throw new Error(
        `csv_row_width: förväntade ${headers.length} kolumner, fick ${row.length}`,
      );
    }
    lines.push(row.map(escapeCell).join(","));
  }
  // BOM so Excel opens Swedish characters correctly.
  return "﻿" + lines.join("\r\n") + "\r\n";
}

export function parseCsv(text: string): string[][] {
  const input = text.startsWith("﻿") ? text.slice(1) : text;
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  let i = 0;

  const pushCell = () => {
    row.push(unescapeCell(cell));
    cell = "";
  };
  const pushRow = () => {
    pushCell();
    rows.push(row);
    row = [];
  };

  while (i < input.length) {
    const ch = input[i];
    if (inQuotes) {
      if (ch === '"') {
        if (input[i + 1] === '"') {
          cell += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      cell += ch;
      i += 1;
      continue;
    }
    if (ch === '"' && cell.length === 0) {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (ch === ",") {
      pushCell();
      i += 1;
      continue;
    }
    if (ch === "\r") {
      if (input[i + 1] === "\n") i += 1;
      pushRow();
      i += 1;
      continue;
    }
    if (ch === "\n") {
      pushRow();
      i += 1;
      continue;
    }
    cell += ch;
    i += 1;
  }
  if (inQuotes) throw new Error("csv_unterminated_quote");
  // A trailing CRLF ends the last row inside the loop; only push a remainder.
  if (cell.length > 0 || row.length > 0) pushRow();
  return rows;
}

/**
 * True when a parsed cell would act as a formula if pasted raw into a
 * spreadsheet — used by import validation to flag hostile files. Strict OWASP
 * stance: every leading = + - @ or tab counts, including "-2+3".
 */
export function looksLikeFormula(cell: string): boolean {
  return FORMULA_TRIGGER.test(cell);
}
