import { type SeenWord, type Word } from "~/words/types";

const intervalMilliseconds = 15_000;

function nextSeenTime({ lastSeen, seenCount }: SeenWord): number {
  return 2 ** (seenCount - 1) * intervalMilliseconds + lastSeen;
}

export function nextWord(words: Word[], now: number): Word | undefined {
  words = words.slice().sort((a, b) => {
    switch (a.type) {
      case "unseen":
        switch (b.type) {
          case "unseen":
            return 0;

          case "seen":
            return nextSeenTime(b) <= now ? 1 : -1;
        }

      case "seen":
        switch (b.type) {
          case "unseen":
            return nextSeenTime(a) <= now ? -1 : 1;

          case "seen":
            if (nextSeenTime(a) - nextSeenTime(b) === 0) {
              return b.seenCount - a.seenCount;
            }
            return nextSeenTime(a) - nextSeenTime(b);
        }
    }
  });

  return words[0];
}
