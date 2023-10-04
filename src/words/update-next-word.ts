import { type Word } from "~/words/types";
import { nextWord } from "./next-word";

export function updateNextWord({
  words,
  now,
  maxSeenUnknownWords,
}: {
  words: Word[];
  now: number;
  maxSeenUnknownWords: number;
}): Word[] {
  const word = nextWord({ words, now, maxSeenUnknownWords });
  if (!word) return [];
  const newWords = words.filter((w) => w !== word);
  return [
    ...newWords,
    ((): Word => {
      switch (word.type) {
        case "unseen":
          return {
            ...word,
            type: "seen",
            lastSeen: now,
            seenCount: 1,
            known: false,
          };

        case "seen":
          return {
            ...word,
            lastSeen: now,
            seenCount: word.seenCount + 1,
          };
      }
    })(),
  ].sort((a, b) => a.order - b.order);
}
