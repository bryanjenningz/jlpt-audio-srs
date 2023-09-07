import { type Word } from "~/words/types";

const intervalMilliseconds = 15_000;

function nextSeenTime({
  lastSeen,
  seenCount,
}: {
  lastSeen?: number;
  seenCount?: number;
}): number | undefined {
  if (!lastSeen || !seenCount || seenCount <= 0) return;
  return 2 ** (seenCount - 1) * intervalMilliseconds + lastSeen;
}

export function nextWord(words: Word[], now: number): Word | undefined {
  words = words.slice().sort((a, b) => {
    const nextSeenA = nextSeenTime(a);
    const nextSeenB = nextSeenTime(b);
    if (!nextSeenA) {
      if (!nextSeenB) {
        return 0;
      }
      return nextSeenB <= now ? 1 : -1;
    }
    if (!nextSeenB) {
      return nextSeenA <= now ? -1 : 1;
    }
    return nextSeenA - nextSeenB;
  });

  return words[0];
}
