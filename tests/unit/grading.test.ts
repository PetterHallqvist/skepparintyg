import { describe, expect, it } from "vitest";
import { gradeResponse, parseResponse } from "@/lib/grading";

describe("gradeResponse (SPEC §58.2 server-authoritative grading)", () => {
  it("single_choice", () => {
    const args = { kind: "single_choice", answerKey: { correct: "b" } };
    expect(
      gradeResponse({ ...args, response: { selected: "b" } }).correct,
    ).toBe(true);
    const wrong = gradeResponse({ ...args, response: { selected: "a" } });
    expect(wrong.correct).toBe(false);
    expect(wrong.wrongKeys).toEqual(["a"]); // feeds felboken misconception lookup
  });

  it("multiple_select requires the exact set", () => {
    const args = {
      kind: "multiple_select",
      answerKey: { correct: ["a", "c"] },
    };
    expect(
      gradeResponse({ ...args, response: { selected: ["c", "a"] } }).correct,
    ).toBe(true);
    expect(
      gradeResponse({ ...args, response: { selected: ["a"] } }).correct,
    ).toBe(false);
    expect(
      gradeResponse({ ...args, response: { selected: ["a", "c", "d"] } })
        .wrongKeys,
    ).toEqual(["d"]);
  });

  it("numeric respects tolerance", () => {
    const args = { kind: "numeric", answerKey: { value: 6, tolerance: 0.05 } };
    expect(gradeResponse({ ...args, response: { value: 6.05 } }).correct).toBe(
      true,
    );
    expect(gradeResponse({ ...args, response: { value: 6.06 } }).correct).toBe(
      false,
    );
  });

  it("ordering exact order", () => {
    const args = {
      kind: "ordering",
      answerKey: { order: ["a", "b", "c"] },
    };
    expect(
      gradeResponse({ ...args, response: { order: ["a", "b", "c"] } }).correct,
    ).toBe(true);
    const partial = gradeResponse({
      ...args,
      response: { order: ["a", "c", "b"] },
    });
    expect(partial.correct).toBe(false);
    expect(partial.detail.correctPositions).toBe(1);
  });

  it("matching exact pairs with wrongKeys detail", () => {
    const args = {
      kind: "matching",
      answerKey: { pairs: { l1: "r1", l2: "r2" } },
    };
    expect(
      gradeResponse({ ...args, response: { pairs: { l1: "r1", l2: "r2" } } })
        .correct,
    ).toBe(true);
    const wrong = gradeResponse({
      ...args,
      response: { pairs: { l1: "r2", l2: "r2" } },
    });
    expect(wrong.correct).toBe(false);
    expect(wrong.wrongKeys).toEqual(["l1"]);
  });

  it("rejects malformed responses (Zod at the boundary, §58.4)", () => {
    expect(() =>
      gradeResponse({
        kind: "numeric",
        answerKey: { value: 6, tolerance: 0 },
        response: { value: "sex" },
      }),
    ).toThrow();
    expect(() => parseResponse("okänd_typ", {})).toThrow(
      /unsupported_item_kind/,
    );
  });
});
