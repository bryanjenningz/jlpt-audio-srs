import { describe, expect, it } from "vitest";
import { updateNextWord } from "~/words/update-next-word";
import { timeNow } from "~/tests/mock-data";

describe("updateNextWord", () => {
  it("Returns empty array if you pass in an empty array", () => {
    expect(updateNextWord([], timeNow)).toEqual([]);
  });
});
