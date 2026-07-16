import { describe, expect, it } from "vitest";
import fc from "fast-check";
import {
  escapeCell,
  looksLikeFormula,
  parseCsv,
  toCsv,
} from "@/lib/content/csv";

/** M1 DoD: CSV round-trip handles Swedish text and blocks formula injection. */
describe("csv round-trip", () => {
  it("round-trips Swedish text, quotes and newlines", () => {
    const headers = ["id", "stem_sv", "förklaring"];
    const rows = [
      [
        "f4-001",
        'Vad betyder "Fl(2) 10s"?',
        "Två blixtar\nper tio sekunder — åäö ÅÄÖ.",
      ],
      ["f7-002", "Fart, tid, distans", "6,0 M på 72 minuter"],
    ];
    const parsed = parseCsv(toCsv(headers, rows));
    expect(parsed[0]).toEqual(headers);
    expect(parsed.slice(1)).toEqual(rows);
  });

  it("neutralises formula injection on export and keeps content on import", () => {
    const hostile = '=HYPERLINK("http://evil.example";"klicka")';
    const csv = toCsv(["a"], [[hostile]]);
    // The raw file must not contain a cell that begins with "=".
    const dataLine = csv.split("\r\n")[1];
    expect(dataLine.startsWith('"=')).toBe(false);
    expect(dataLine.startsWith("=")).toBe(false);
    // Round-trip restores the original text for our pipeline.
    expect(parseCsv(csv)[1][0]).toBe(hostile);
  });

  it.each(["=1+2", "+SUM(A1)", "-2+3", "-42", "@cmd", "\tx"])(
    "flags %s as formula-like (strict OWASP: all leading = + - @ TAB)",
    (cell) => {
      expect(looksLikeFormula(cell)).toBe(true);
    },
  );

  it("round-trips genuine leading apostrophes losslessly", () => {
    const rows = [["'citat", "''dubbel", "'"]];
    expect(parseCsv(toCsv(["a", "b", "c"], rows)).slice(1)).toEqual(rows);
  });

  it("property: arbitrary unicode cells round-trip losslessly", () => {
    fc.assert(
      fc.property(
        fc
          .array(
            fc.array(
              fc.string({ maxLength: 40 }).filter((s) => !s.includes("﻿")),
              { minLength: 1, maxLength: 4 },
            ),
            { minLength: 1, maxLength: 8 },
          )
          .filter((rows) => rows.every((r) => r.length === rows[0].length)),
        (rows) => {
          const headers = rows[0].map((_, i) => `k${i}`);
          const parsed = parseCsv(toCsv(headers, rows));
          expect(parsed.slice(1)).toEqual(rows);
        },
      ),
      { numRuns: 200 },
    );
  });

  it("escapeCell quotes cells containing separators", () => {
    expect(escapeCell("a,b")).toBe('"a,b"');
    expect(escapeCell('say "hej"')).toBe('"say ""hej"""');
  });
});
