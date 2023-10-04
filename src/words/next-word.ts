import { type SeenWord, type Word } from "~/words/types";

export const intervalTime = 30_000;

function nextSeenTime({ lastSeen, seenCount }: SeenWord): number {
  return 2 ** (seenCount - 1) * intervalTime + lastSeen;
}

export function nextWord(
  words: Word[],
  now: number,
  maxSeenUnknownWords: number,
): Word | undefined {
  const seenUnknownWordCount = words.filter(
    (word) => word.type === "seen" && !word.known,
  ).length;
  const showUnseenWords =
    maxSeenUnknownWords === 0 || seenUnknownWordCount < maxSeenUnknownWords;

  words = words
    .filter((word) => !word.known)
    .sort((a, b) => {
      switch (a.type) {
        case "unseen":
          switch (b.type) {
            case "unseen":
              return 0;

            case "seen":
              return 1;
          }

        case "seen":
          switch (b.type) {
            case "unseen":
              return -1;

            case "seen":
              if (nextSeenTime(a) - nextSeenTime(b) === 0) {
                return b.seenCount - a.seenCount;
              }
              return nextSeenTime(a) - nextSeenTime(b);
          }
      }
    });

  return (
    words.filter((word) => {
      if (word.type === "unseen") {
        return showUnseenWords;
      }
      return nextSeenTime(word) <= now;
    })[0] ?? words[0]
  );
}
