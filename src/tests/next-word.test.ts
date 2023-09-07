import { describe, expect, it } from "vitest";
import { nextWord } from "~/words/next-word";
import { type Word } from "~/words/types";

const timeNow = 100_000;
const unseenWord: Word = { japanese: "1", english: "1" };
const wordSeenOnce20SecondsAgo: Word = {
  japanese: "20",
  english: "20",
  lastSeen: timeNow - 20_000,
  seenCount: 1,
};
const wordSeenOnce15SecondsAgo: Word = {
  japanese: "15",
  english: "15",
  lastSeen: timeNow - 15_000,
  seenCount: 1,
};
const wordSeenOnce10SecondsAgo: Word = {
  japanese: "10",
  english: "10",
  lastSeen: timeNow - 10_000,
  seenCount: 1,
};
const wordSeenTwice30SecondsAgo: Word = {
  japanese: "30",
  english: "30",
  lastSeen: timeNow - 30_000,
  seenCount: 2,
};

describe("nextWord", () => {
  it("Returns undefined if there are no words", () => {
    expect(nextWord([], 0)).toEqual(undefined);
  });

  it("Returns the first word if there is only 1 word", () => {
    const word = { japanese: "", english: "" };
    expect(nextWord([word], timeNow)).toEqual(word);
  });

  it("Returns the word with last seen >=15 seconds ago", () => {
    expect(
      nextWord(
        [unseenWord, wordSeenOnce15SecondsAgo, wordSeenOnce10SecondsAgo],
        timeNow,
      ),
    ).toEqual(wordSeenOnce15SecondsAgo);
  });

  it("Returns the word with lowest last seen if there are multiple words with last seen >=15 seconds ago", () => {
    expect(
      nextWord(
        [
          unseenWord,
          wordSeenOnce20SecondsAgo,
          wordSeenOnce15SecondsAgo,
          wordSeenOnce10SecondsAgo,
        ],
        timeNow,
      ),
    ).toEqual(wordSeenOnce20SecondsAgo);
  });

  it("Returns unseen word if no words were last seen >=15 seconds ago", () => {
    expect(nextWord([unseenWord, wordSeenOnce10SecondsAgo], timeNow)).toEqual(
      unseenWord,
    );
  });

  it("Returns word seen twice 30 seconds ago if the other word was been seen once 15 seconds ago", () => {
    expect(
      nextWord([wordSeenOnce15SecondsAgo, wordSeenTwice30SecondsAgo], timeNow),
    ).toEqual(wordSeenTwice30SecondsAgo);
  });
});
