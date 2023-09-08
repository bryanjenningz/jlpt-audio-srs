import { describe, expect, it } from "vitest";
import { parseWords } from "~/words/parse-words";

describe("parseWords", () => {
  it("Throws if given an empty string", () => {
    expect(() => parseWords("")).toThrowError(
      new Error(`Expected 2 or 3 non-empty sections for line: ""`),
    );
  });
});
