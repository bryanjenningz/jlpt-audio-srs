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
  return 2 ** seenCount * intervalMilliseconds * lastSeen;
}

export function nextWord(words: Word[], now: number): Word | undefined {
  words.slice().sort((a, b) => {
    const nextSeenA = nextSeenTime(a);
    const nextSeenB = nextSeenTime(b);
    if (!nextSeenA) {
      if (!nextSeenB) {
        return 0;
      }
      return 1;
    }
    if (!nextSeenB) {
      return -1;
    }
    return nextSeenA - nextSeenB;
  });

  const firstWord = words[0];

  if (!firstWord?.lastSeen || (nextSeenTime(firstWord) ?? 0) <= now) {
    return firstWord;
  }

  return words.find((word) => !word.seenCount) ?? firstWord;
}
