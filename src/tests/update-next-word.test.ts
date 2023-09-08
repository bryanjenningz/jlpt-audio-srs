import { describe, expect, it } from "vitest";
import { updateNextWord } from "~/words/update-next-word";

describe("updateNextWord", () => {
  it("Returns empty array if you pass in an empty array", () => {
    expect(updateNextWord([])).toEqual([]);
  });
});
