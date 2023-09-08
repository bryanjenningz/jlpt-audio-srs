import { describe, expect, it } from "vitest";
import { updateNextWord } from "~/words/update-next-word";

const timeNow = 100_000;

describe("updateNextWord", () => {
  it("Returns empty array if you pass in an empty array", () => {
    expect(updateNextWord([], timeNow)).toEqual([]);
  });
});
