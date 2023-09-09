import { describe, expect, it } from "vitest";
import { updateNextWord } from "~/words/update-next-word";
import {
  timeNow,
  unseenWord,
  wordSeenOnce10SecondsAgo,
  wordSeenOnce15SecondsAgo,
  wordSeenOnce20SecondsAgo,
  wordSeenTwice30SecondsAgo,
} from "~/tests/words/mock-data";
import { type Word } from "~/words/types";

describe("updateNextWord", () => {
  it("Returns empty array if you pass in an empty array", () => {
    expect(updateNextWord([], timeNow)).toEqual([]);
  });

  it("Updates the first unseen word if there are 2 unseen words", () => {
    const unseenWord2: Word = { ...unseenWord, definition: "unseen2" };
    const result: Word[] = [
      unseenWord2,
      { ...unseenWord, type: "seen", lastSeen: timeNow, seenCount: 1 },
    ];
    expect(updateNextWord([unseenWord, unseenWord2], timeNow)).toEqual(result);

    const result2: Word[] = [
      unseenWord,
      { ...unseenWord2, type: "seen", lastSeen: timeNow, seenCount: 1 },
    ];
    expect(updateNextWord([unseenWord2, unseenWord], timeNow)).toEqual(result2);
  });

  it("Updates the last seen time and seen count of the next word even if there's only 1 word", () => {
    const result: Word[] = [
      { ...unseenWord, type: "seen", lastSeen: timeNow, seenCount: 1 },
    ];
    expect(updateNextWord([unseenWord], timeNow)).toEqual(result);

    const result2: Word[] = [
      {
        ...wordSeenOnce10SecondsAgo,
        type: "seen",
        lastSeen: timeNow,
        seenCount: 2,
      },
    ];
    expect(updateNextWord([wordSeenOnce10SecondsAgo], timeNow)).toEqual(
      result2,
    );

    const result3: Word[] = [
      {
        ...wordSeenOnce15SecondsAgo,
        type: "seen",
        lastSeen: timeNow,
        seenCount: 2,
      },
    ];
    expect(updateNextWord([wordSeenOnce15SecondsAgo], timeNow)).toEqual(
      result3,
    );

    const result4: Word[] = [
      {
        ...wordSeenOnce20SecondsAgo,
        type: "seen",
        lastSeen: timeNow,
        seenCount: 2,
      },
    ];
    expect(updateNextWord([wordSeenOnce20SecondsAgo], timeNow)).toEqual(
      result4,
    );

    const result5: Word[] = [
      {
        ...wordSeenTwice30SecondsAgo,
        type: "seen",
        lastSeen: timeNow,
        seenCount: 3,
      },
    ];
    expect(updateNextWord([wordSeenTwice30SecondsAgo], timeNow)).toEqual(
      result5,
    );
  });

  it("Updates the unseen word if there's an unseen word and a word seen once 10 seconds ago", () => {
    const newlySeenWord: Word = {
      ...unseenWord,
      type: "seen",
      lastSeen: timeNow,
      seenCount: 1,
    };
    const result: Word[] = [wordSeenOnce10SecondsAgo, newlySeenWord].sort(
      (a, b) => a.order - b.order,
    );
    expect(
      updateNextWord([unseenWord, wordSeenOnce10SecondsAgo], timeNow),
    ).toEqual(result);
  });

  it("Updates the word 15 seconds ago if there's an unseen word, word seen once 10 seconds ago, and a word seen once 15 seconds ago", () => {
    const result: Word[] = [
      unseenWord,
      wordSeenOnce10SecondsAgo,
      {
        ...wordSeenOnce15SecondsAgo,
        lastSeen: timeNow,
        seenCount: 2,
      },
    ].sort((a, b) => a.order - b.order);
    expect(
      updateNextWord(
        [unseenWord, wordSeenOnce10SecondsAgo, wordSeenOnce15SecondsAgo],
        timeNow,
      ),
    ).toEqual(result);
  });

  it("Updates the word seen 20 seconds ago if there's an unseen word, word seen once 10 seconds ago, a word seen once 15 seconds ago, and a word seen once 20 seconds ago", () => {
    const result: Word[] = [
      unseenWord,
      wordSeenOnce10SecondsAgo,
      wordSeenOnce15SecondsAgo,
      {
        ...wordSeenOnce20SecondsAgo,
        lastSeen: timeNow,
        seenCount: 2,
      },
    ].sort((a, b) => a.order - b.order);
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
    ).toEqual(result);
  });

  it("Updates the word seen twice 30 seconds ago if there's an unseen word, word seen once 10 seconds ago, a word seen once 15 seconds ago, and a word seen twice 30 seconds ago", () => {
    const result: Word[] = [
      unseenWord,
      wordSeenOnce10SecondsAgo,
      wordSeenOnce15SecondsAgo,
      {
        ...wordSeenTwice30SecondsAgo,
        lastSeen: timeNow,
        seenCount: 3,
      },
    ].sort((a, b) => a.order - b.order);
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
    ).toEqual(result);
  });

  it("Updates the word seen once 20 seconds ago if there's an unseen word, word seen once 10 seconds ago, a word seen once 15 seconds ago, word seen once 20 seconds ago, and a word seen twice 30 seconds ago", () => {
    const result: Word[] = [
      unseenWord,
      wordSeenOnce10SecondsAgo,
      wordSeenOnce15SecondsAgo,
      wordSeenTwice30SecondsAgo,
      {
        ...wordSeenOnce20SecondsAgo,
        lastSeen: timeNow,
        seenCount: 2,
      },
    ].sort((a, b) => a.order - b.order);
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
    ).toEqual(result);
  });
});
