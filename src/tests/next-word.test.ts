import { describe, expect, it } from "vitest";
import { nextWord } from "~/words/next-word";

describe("nextWord", () => {
  it("Returns undefined if there are no words", () => {
    expect(nextWord([], 0)).toEqual(undefined);
  });
});
