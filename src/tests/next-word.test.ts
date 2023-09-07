import { describe, expect, it } from "vitest";
import { nextWord } from "~/words/next-word";

describe("nextWord", () => {
  it("Returns undefined if there are no words", () => {
    expect(nextWord([], 0)).toEqual(undefined);
  });

  it("Returns the first word if there is only 1 word", () => {
    const word = { japanese: "", english: "" };
    expect(nextWord([word], 0)).toEqual(word);
  });
});
