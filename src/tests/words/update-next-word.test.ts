import { describe, expect, it } from "vitest";
import { updateNextWord } from "~/words/update-next-word";
import {
  timeNow,
  unseenWord,
  wordSeenOnceLessThanIntervalAgo,
  wordSeenOnceIntervalAgo,
  wordSeenOnceMoreThanIntervalAgo,
  wordSeenTwiceTwoIntervalsAgo,
} from "~/tests/words/mock-data";
import { type Word } from "~/words/types";

describe("updateNextWord", () => {
  it("Returns empty array if you pass in an empty array", () => {
    expect(
      updateNextWord({ words: [], now: timeNow, maxSeenUnknownWords: 0 }),
    ).toEqual([]);
  });

  it("Updates the first unseen word if there are 2 unseen words", () => {
    const unseenWord2: Word = { ...unseenWord, definition: "unseen2" };
    const result: Word[] = [
      unseenWord2,
      {
        ...unseenWord,
        type: "seen",
        lastSeen: timeNow,
        seenCount: 1,
        known: false,
      },
    ];
    expect(
      updateNextWord({
        words: [unseenWord, unseenWord2],
        now: timeNow,
        maxSeenUnknownWords: 0,
      }),
    ).toEqual(result);

    const result2: Word[] = [
      unseenWord,
      {
        ...unseenWord2,
        type: "seen",
        lastSeen: timeNow,
        seenCount: 1,
        known: false,
      },
    ];
    expect(
      updateNextWord({
        words: [unseenWord2, unseenWord],
        now: timeNow,
        maxSeenUnknownWords: 0,
      }),
    ).toEqual(result2);
  });

  it("Updates the last seen time and seen count of the next word even if there's only 1 word", () => {
    const result: Word[] = [
      {
        ...unseenWord,
        type: "seen",
        lastSeen: timeNow,
        seenCount: 1,
        known: false,
      },
    ];
    expect(
      updateNextWord({
        words: [unseenWord],
        now: timeNow,
        maxSeenUnknownWords: 0,
      }),
    ).toEqual(result);

    const result2: Word[] = [
      {
        ...wordSeenOnceLessThanIntervalAgo,
        type: "seen",
        lastSeen: timeNow,
        seenCount: 2,
      },
    ];
    expect(
      updateNextWord({
        words: [wordSeenOnceLessThanIntervalAgo],
        now: timeNow,
        maxSeenUnknownWords: 0,
      }),
    ).toEqual(result2);

    const result3: Word[] = [
      {
        ...wordSeenOnceIntervalAgo,
        type: "seen",
        lastSeen: timeNow,
        seenCount: 2,
      },
    ];
    expect(
      updateNextWord({
        words: [wordSeenOnceIntervalAgo],
        now: timeNow,
        maxSeenUnknownWords: 0,
      }),
    ).toEqual(result3);

    const result4: Word[] = [
      {
        ...wordSeenOnceMoreThanIntervalAgo,
        type: "seen",
        lastSeen: timeNow,
        seenCount: 2,
      },
    ];
    expect(
      updateNextWord({
        words: [wordSeenOnceMoreThanIntervalAgo],
        now: timeNow,
        maxSeenUnknownWords: 0,
      }),
    ).toEqual(result4);

    const result5: Word[] = [
      {
        ...wordSeenTwiceTwoIntervalsAgo,
        type: "seen",
        lastSeen: timeNow,
        seenCount: 3,
      },
    ];
    expect(
      updateNextWord({
        words: [wordSeenTwiceTwoIntervalsAgo],
        now: timeNow,
        maxSeenUnknownWords: 0,
      }),
    ).toEqual(result5);
  });

  it("Updates the unseen word if there's an unseen word and a word seen once 10 seconds ago", () => {
    const newlySeenWord: Word = {
      ...unseenWord,
      type: "seen",
      known: false,
      lastSeen: timeNow,
      seenCount: 1,
    };
    const result: Word[] = [
      wordSeenOnceLessThanIntervalAgo,
      newlySeenWord,
    ].sort((a, b) => a.order - b.order);
    expect(
      updateNextWord({
        words: [unseenWord, wordSeenOnceLessThanIntervalAgo],
        now: timeNow,
        maxSeenUnknownWords: 0,
      }),
    ).toEqual(result);
  });

  it("Updates the word 15 seconds ago if there's an unseen word, word seen once 10 seconds ago, and a word seen once 15 seconds ago", () => {
    const result: Word[] = [
      unseenWord,
      wordSeenOnceLessThanIntervalAgo,
      {
        ...wordSeenOnceIntervalAgo,
        lastSeen: timeNow,
        seenCount: 2,
      },
    ].sort((a, b) => a.order - b.order);
    expect(
      updateNextWord({
        words: [
          unseenWord,
          wordSeenOnceLessThanIntervalAgo,
          wordSeenOnceIntervalAgo,
        ],
        now: timeNow,
        maxSeenUnknownWords: 0,
      }),
    ).toEqual(result);
  });

  it("Updates the word seen 20 seconds ago if there's an unseen word, word seen once 10 seconds ago, a word seen once 15 seconds ago, and a word seen once 20 seconds ago", () => {
    const result: Word[] = [
      unseenWord,
      wordSeenOnceLessThanIntervalAgo,
      wordSeenOnceIntervalAgo,
      {
        ...wordSeenOnceMoreThanIntervalAgo,
        lastSeen: timeNow,
        seenCount: 2,
      },
    ].sort((a, b) => a.order - b.order);
    expect(
      updateNextWord({
        words: [
          unseenWord,
          wordSeenOnceLessThanIntervalAgo,
          wordSeenOnceIntervalAgo,
          wordSeenOnceMoreThanIntervalAgo,
        ],
        now: timeNow,
        maxSeenUnknownWords: 0,
      }),
    ).toEqual(result);
  });

  it("Updates the word seen twice 30 seconds ago if there's an unseen word, word seen once 10 seconds ago, a word seen once 15 seconds ago, and a word seen twice 30 seconds ago", () => {
    const result: Word[] = [
      unseenWord,
      wordSeenOnceLessThanIntervalAgo,
      wordSeenOnceIntervalAgo,
      {
        ...wordSeenTwiceTwoIntervalsAgo,
        lastSeen: timeNow,
        seenCount: 3,
      },
    ].sort((a, b) => a.order - b.order);
    expect(
      updateNextWord({
        words: [
          unseenWord,
          wordSeenOnceLessThanIntervalAgo,
          wordSeenOnceIntervalAgo,
          wordSeenTwiceTwoIntervalsAgo,
        ],
        now: timeNow,
        maxSeenUnknownWords: 0,
      }),
    ).toEqual(result);
  });

  it("Updates the word seen once 20 seconds ago if there's an unseen word, word seen once 10 seconds ago, a word seen once 15 seconds ago, word seen once 20 seconds ago, and a word seen twice 30 seconds ago", () => {
    const result: Word[] = [
      unseenWord,
      wordSeenOnceLessThanIntervalAgo,
      wordSeenOnceIntervalAgo,
      wordSeenTwiceTwoIntervalsAgo,
      {
        ...wordSeenOnceMoreThanIntervalAgo,
        lastSeen: timeNow,
        seenCount: 2,
      },
    ].sort((a, b) => a.order - b.order);
    expect(
      updateNextWord({
        words: [
          unseenWord,
          wordSeenOnceLessThanIntervalAgo,
          wordSeenOnceIntervalAgo,
          wordSeenOnceMoreThanIntervalAgo,
          wordSeenTwiceTwoIntervalsAgo,
        ],
        now: timeNow,
        maxSeenUnknownWords: 0,
      }),
    ).toEqual(result);
  });
});
