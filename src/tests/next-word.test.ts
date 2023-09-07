import { describe, expect, it } from "vitest";
import { nextWord } from "~/words/next-word";
import { type Word } from "~/words/types";

describe("nextWord", () => {
  it("Returns undefined if there are no words", () => {
    expect(nextWord([], 0)).toEqual(undefined);
  });

  it("Returns the first word if there is only 1 word", () => {
    const word = { japanese: "", english: "" };
    expect(nextWord([word], 0)).toEqual(word);
  });

  it("Returns the word with lowest lastSeen if that lastSeen was >=15 seconds ago", () => {
    const word1: Word = { japanese: "1", english: "1" };
    const word2: Word = {
      japanese: "2",
      english: "2",
      lastSeen: 1,
      seenCount: 1,
    };
    const word3: Word = {
      japanese: "3",
      english: "3",
      lastSeen: 2,
      seenCount: 1,
    };
    expect(nextWord([word1, word2, word3], 15_001)).toEqual(word2);
  });

  it("Returns an unseen word if no words were last seen >=15 seconds ago", () => {
    const word1: Word = { japanese: "1", english: "1" };
    const word2: Word = {
      japanese: "2",
      english: "2",
      lastSeen: 1,
      seenCount: 1,
    };
    const word3: Word = {
      japanese: "3",
      english: "3",
      lastSeen: 2,
      seenCount: 1,
    };
    expect(nextWord([word1, word2, word3], 15_000)).toEqual(word1);
  });
});
