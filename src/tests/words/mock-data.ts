import { type SeenWord, type UnseenWord } from "~/words/types";

export const timeNow = 100_000;

export const unseenWord: UnseenWord = {
  type: "unseen",
  kanji: "0",
  kana: "0",
  definition: "0",
  order: 1,
  known: false,
};

export const wordSeenOnce20SecondsAgo: SeenWord = {
  type: "seen",
  kanji: "20",
  kana: "20",
  definition: "20",
  order: 2,
  known: false,
  lastSeen: timeNow - 20_000,
  seenCount: 1,
};

export const wordSeenOnce15SecondsAgo: SeenWord = {
  type: "seen",
  kanji: "15",
  kana: "15",
  definition: "15",
  order: 3,
  known: false,
  lastSeen: timeNow - 15_000,
  seenCount: 1,
};

export const wordSeenOnce10SecondsAgo: SeenWord = {
  type: "seen",
  kanji: "10",
  kana: "10",
  definition: "10",
  order: 4,
  known: false,
  lastSeen: timeNow - 10_000,
  seenCount: 1,
};

export const wordSeenTwice30SecondsAgo: SeenWord = {
  type: "seen",
  kanji: "30",
  kana: "30",
  definition: "30",
  order: 5,
  known: false,
  lastSeen: timeNow - 30_000,
  seenCount: 2,
};
