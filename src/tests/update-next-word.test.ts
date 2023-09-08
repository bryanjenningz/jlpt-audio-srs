import { describe, expect, it } from "vitest";
import { updateNextWord } from "~/words/update-next-word";
import {
  timeNow,
  unseenWord,
  wordSeenOnce10SecondsAgo,
  wordSeenOnce15SecondsAgo,
  wordSeenOnce20SecondsAgo,
  wordSeenTwice30SecondsAgo,
} from "~/tests/mock-data";

describe("updateNextWord", () => {
  it("Returns empty array if you pass in an empty array", () => {
    expect(updateNextWord([], timeNow)).toEqual([]);
  });

  it("Updates the last seen time and seen count of the next word even if there's only 1 word", () => {
    expect(updateNextWord([unseenWord], timeNow)).toEqual([
      { ...unseenWord, type: "seen", lastSeen: timeNow, seenCount: 1 },
    ]);
    expect(updateNextWord([wordSeenOnce10SecondsAgo], timeNow)).toEqual([
      {
        ...wordSeenOnce10SecondsAgo,
        type: "seen",
        lastSeen: timeNow,
        seenCount: 2,
      },
    ]);
    expect(updateNextWord([wordSeenOnce15SecondsAgo], timeNow)).toEqual([
      {
        ...wordSeenOnce15SecondsAgo,
        type: "seen",
        lastSeen: timeNow,
        seenCount: 2,
      },
    ]);
    expect(updateNextWord([wordSeenOnce20SecondsAgo], timeNow)).toEqual([
      {
        ...wordSeenOnce20SecondsAgo,
        type: "seen",
        lastSeen: timeNow,
        seenCount: 2,
      },
    ]);
    expect(updateNextWord([wordSeenTwice30SecondsAgo], timeNow)).toEqual([
      {
        ...wordSeenTwice30SecondsAgo,
        type: "seen",
        lastSeen: timeNow,
        seenCount: 3,
      },
    ]);
  });

  it("Updates the unseen word if there's an unseen word and a word seen once 10 seconds ago", () => {
    expect(
      updateNextWord([unseenWord, wordSeenOnce10SecondsAgo], timeNow),
    ).toEqual([
      wordSeenOnce10SecondsAgo,
      { ...unseenWord, type: "seen", lastSeen: timeNow, seenCount: 1 },
    ]);
  });

  it("Updates the word 15 seconds ago if there's an unseen word, word seen once 10 seconds ago, and a word seen once 15 seconds ago", () => {
    expect(
      updateNextWord(
        [unseenWord, wordSeenOnce10SecondsAgo, wordSeenOnce15SecondsAgo],
        timeNow,
      ),
    ).toEqual([
      unseenWord,
      wordSeenOnce10SecondsAgo,
      {
        ...wordSeenOnce15SecondsAgo,
        lastSeen: timeNow,
        seenCount: 2,
      },
    ]);
  });

  it("Updates the word seen 20 seconds ago if there's an unseen word, word seen once 10 seconds ago, a word seen once 15 seconds ago, and a word seen once 20 seconds ago", () => {
    expect(
      updateNextWord(
        [
          unseenWord,
          wordSeenOnce10SecondsAgo,
          wordSeenOnce15SecondsAgo,
          wordSeenOnce20SecondsAgo,
        ],
        timeNow,
      ),
    ).toEqual([
      unseenWord,
      wordSeenOnce10SecondsAgo,
      wordSeenOnce15SecondsAgo,
      {
        ...wordSeenOnce20SecondsAgo,
        lastSeen: timeNow,
        seenCount: 2,
      },
    ]);
  });

  it("Updates the word seen twice 30 seconds ago if there's an unseen word, word seen once 10 seconds ago, a word seen once 15 seconds ago, and a word seen twice 30 seconds ago", () => {
    expect(
      updateNextWord(
        [
          unseenWord,
          wordSeenOnce10SecondsAgo,
          wordSeenOnce15SecondsAgo,
          wordSeenTwice30SecondsAgo,
        ],
        timeNow,
      ),
    ).toEqual([
      unseenWord,
      wordSeenOnce10SecondsAgo,
      wordSeenOnce15SecondsAgo,
      {
        ...wordSeenTwice30SecondsAgo,
        lastSeen: timeNow,
        seenCount: 3,
      },
    ]);
  });

  it("Updates the word seen once 20 seconds ago if there's an unseen word, word seen once 10 seconds ago, a word seen once 15 seconds ago, word seen once 20 seconds ago, and a word seen twice 30 seconds ago", () => {
    expect(
      updateNextWord(
        [
          unseenWord,
          wordSeenOnce10SecondsAgo,
          wordSeenOnce15SecondsAgo,
          wordSeenOnce20SecondsAgo,
          wordSeenTwice30SecondsAgo,
        ],
        timeNow,
      ),
    ).toEqual([
      unseenWord,
      wordSeenOnce10SecondsAgo,
      wordSeenOnce15SecondsAgo,
      wordSeenTwice30SecondsAgo,
      {
        ...wordSeenOnce20SecondsAgo,
        lastSeen: timeNow,
        seenCount: 2,
      },
    ]);
  });
});
