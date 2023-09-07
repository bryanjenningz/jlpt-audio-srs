import { describe, expect, it } from "vitest";
import { nextWord } from "~/words/next-word";
import { type Word } from "~/words/types";

const timeNow = 100_000;
const unseenWord: Word = { japanese: "1", english: "1" };
const wordSeenOnce15SecondsAgo: Word = {
  japanese: "2",
  english: "2",
  lastSeen: timeNow - 15_000,
  seenCount: 1,
};
const wordSeenOnce10SecondsAgo: Word = {
  japanese: "2",
  english: "2",
  lastSeen: timeNow - 10_000,
  seenCount: 1,
};

describe("nextWord", () => {
  it("Returns undefined if there are no words", () => {
    expect(nextWord([], 0)).toEqual(undefined);
  });

  it("Returns the first word if there is only 1 word", () => {
    const word = { japanese: "", english: "" };
    expect(nextWord([word], timeNow)).toEqual(word);
  });

  it("Returns the word with lowest lastSeen if that lastSeen was >=15 seconds ago", () => {
    expect(
      nextWord(
        [unseenWord, wordSeenOnce15SecondsAgo, wordSeenOnce10SecondsAgo],
        timeNow,
      ),
    ).toEqual(wordSeenOnce15SecondsAgo);
  });

  it("Returns an unseen word if no words were last seen >=15 seconds ago", () => {
    expect(nextWord([unseenWord, wordSeenOnce10SecondsAgo], timeNow)).toEqual(
      unseenWord,
    );
  });
});
