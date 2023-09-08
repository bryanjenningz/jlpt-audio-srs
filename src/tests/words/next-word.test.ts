import { describe, expect, it } from "vitest";
import { nextWord } from "~/words/next-word";
import {
  timeNow,
  unseenWord,
  wordSeenOnce10SecondsAgo,
  wordSeenOnce15SecondsAgo,
  wordSeenOnce20SecondsAgo,
  wordSeenTwice30SecondsAgo,
} from "~/tests/words/mock-data";

describe("nextWord", () => {
  it("Returns undefined if there are no words", () => {
    expect(nextWord([], 0)).toEqual(undefined);
  });

  it("Returns the first word if there is only 1 word", () => {
    expect(nextWord([unseenWord], timeNow)).toEqual(unseenWord);
    expect(nextWord([wordSeenOnce10SecondsAgo], timeNow)).toEqual(
      wordSeenOnce10SecondsAgo,
    );
    expect(nextWord([wordSeenOnce15SecondsAgo], timeNow)).toEqual(
      wordSeenOnce15SecondsAgo,
    );
    expect(nextWord([wordSeenOnce20SecondsAgo], timeNow)).toEqual(
      wordSeenOnce20SecondsAgo,
    );
    expect(nextWord([wordSeenTwice30SecondsAgo], timeNow)).toEqual(
      wordSeenTwice30SecondsAgo,
    );
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

  it("Returns word seen once 20 seconds ago if the other word was been seen twice 30 seconds ago", () => {
    expect(
      nextWord([wordSeenOnce20SecondsAgo, wordSeenTwice30SecondsAgo], timeNow),
    ).toEqual(wordSeenOnce20SecondsAgo);
  });
});
