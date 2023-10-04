import { describe, expect, it } from "vitest";
import { nextWord } from "~/words/next-word";
import {
  timeNow,
  unseenWord,
  wordSeenOnceLessThanIntervalAgo,
  wordSeenOnceIntervalAgo,
  wordSeenOnceMoreThanIntervalAgo,
  wordSeenTwiceTwoIntervalsAgo,
} from "~/tests/words/mock-data";

describe("nextWord", () => {
  it("Returns undefined if there are no words", () => {
    expect(nextWord([], 0, 0)).toEqual(undefined);
  });

  it("Returns the first word if there is only 1 word", () => {
    expect(nextWord([unseenWord], timeNow, 0)).toEqual(unseenWord);
    expect(nextWord([wordSeenOnceLessThanIntervalAgo], timeNow, 0)).toEqual(
      wordSeenOnceLessThanIntervalAgo,
    );
    expect(nextWord([wordSeenOnceIntervalAgo], timeNow, 0)).toEqual(
      wordSeenOnceIntervalAgo,
    );
    expect(nextWord([wordSeenOnceMoreThanIntervalAgo], timeNow, 0)).toEqual(
      wordSeenOnceMoreThanIntervalAgo,
    );
    expect(nextWord([wordSeenTwiceTwoIntervalsAgo], timeNow, 0)).toEqual(
      wordSeenTwiceTwoIntervalsAgo,
    );
  });

  it("Returns the word with last seen >=15 seconds ago", () => {
    expect(
      nextWord(
        [unseenWord, wordSeenOnceIntervalAgo, wordSeenOnceLessThanIntervalAgo],
        timeNow,
        0,
      ),
    ).toEqual(wordSeenOnceIntervalAgo);
  });

  it("Returns the word with lowest last seen if there are multiple words with last seen >=15 seconds ago", () => {
    expect(
      nextWord(
        [
          unseenWord,
          wordSeenOnceMoreThanIntervalAgo,
          wordSeenOnceIntervalAgo,
          wordSeenOnceLessThanIntervalAgo,
        ],
        timeNow,
        0,
      ),
    ).toEqual(wordSeenOnceMoreThanIntervalAgo);
  });

  it("Returns unseen word if no words were last seen >=15 seconds ago", () => {
    expect(
      nextWord([unseenWord, wordSeenOnceLessThanIntervalAgo], timeNow, 0),
    ).toEqual(unseenWord);
  });

  it("Returns word seen twice 30 seconds ago if the other word was been seen once 15 seconds ago", () => {
    expect(
      nextWord(
        [wordSeenOnceIntervalAgo, wordSeenTwiceTwoIntervalsAgo],
        timeNow,
        0,
      ),
    ).toEqual(wordSeenTwiceTwoIntervalsAgo);
  });

  it("Returns word seen once 20 seconds ago if the other word was been seen twice 30 seconds ago", () => {
    expect(
      nextWord(
        [wordSeenOnceMoreThanIntervalAgo, wordSeenTwiceTwoIntervalsAgo],
        timeNow,
        0,
      ),
    ).toEqual(wordSeenOnceMoreThanIntervalAgo);
  });
});
