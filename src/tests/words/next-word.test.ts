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
    expect(nextWord([], 0)).toEqual(undefined);
  });

  it("Returns the first word if there is only 1 word", () => {
    expect(nextWord([unseenWord], timeNow)).toEqual(unseenWord);
    expect(nextWord([wordSeenOnceLessThanIntervalAgo], timeNow)).toEqual(
      wordSeenOnceLessThanIntervalAgo,
    );
    expect(nextWord([wordSeenOnceIntervalAgo], timeNow)).toEqual(
      wordSeenOnceIntervalAgo,
    );
    expect(nextWord([wordSeenOnceMoreThanIntervalAgo], timeNow)).toEqual(
      wordSeenOnceMoreThanIntervalAgo,
    );
    expect(nextWord([wordSeenTwiceTwoIntervalsAgo], timeNow)).toEqual(
      wordSeenTwiceTwoIntervalsAgo,
    );
  });

  it("Returns the word with last seen >=15 seconds ago", () => {
    expect(
      nextWord(
        [unseenWord, wordSeenOnceIntervalAgo, wordSeenOnceLessThanIntervalAgo],
        timeNow,
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
      ),
    ).toEqual(wordSeenOnceMoreThanIntervalAgo);
  });

  it("Returns unseen word if no words were last seen >=15 seconds ago", () => {
    expect(
      nextWord([unseenWord, wordSeenOnceLessThanIntervalAgo], timeNow),
    ).toEqual(unseenWord);
  });

  it("Returns word seen twice 30 seconds ago if the other word was been seen once 15 seconds ago", () => {
    expect(
      nextWord(
        [wordSeenOnceIntervalAgo, wordSeenTwiceTwoIntervalsAgo],
        timeNow,
      ),
    ).toEqual(wordSeenTwiceTwoIntervalsAgo);
  });

  it("Returns word seen once 20 seconds ago if the other word was been seen twice 30 seconds ago", () => {
    expect(
      nextWord(
        [wordSeenOnceMoreThanIntervalAgo, wordSeenTwiceTwoIntervalsAgo],
        timeNow,
      ),
    ).toEqual(wordSeenOnceMoreThanIntervalAgo);
  });
});
