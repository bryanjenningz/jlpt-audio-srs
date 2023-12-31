import { intervalTime } from "~/words/next-word";
import { type SeenWord, type UnseenWord } from "~/words/types";

export const timeNow = 100_000;

export const unseenWord: UnseenWord = {
  type: "unseen",
  kanji: "0",
  kana: "0",
  definition: "0",
  pitchAccents: [],
  order: 1,
  known: false,
};

export const wordSeenOnceMoreThanIntervalAgo: SeenWord = {
  type: "seen",
  kanji: "20",
  kana: "20",
  definition: "20",
  pitchAccents: [],
  order: 2,
  known: false,
  lastSeen: timeNow - intervalTime - 1,
  seenCount: 1,
};

export const wordSeenOnceIntervalAgo: SeenWord = {
  type: "seen",
  kanji: "15",
  kana: "15",
  definition: "15",
  pitchAccents: [],
  order: 3,
  known: false,
  lastSeen: timeNow - intervalTime,
  seenCount: 1,
};

export const wordSeenOnceLessThanIntervalAgo: SeenWord = {
  type: "seen",
  kanji: "10",
  kana: "10",
  definition: "10",
  pitchAccents: [],
  order: 4,
  known: false,
  lastSeen: timeNow - intervalTime + 1,
  seenCount: 1,
};

export const wordSeenTwiceTwoIntervalsAgo: SeenWord = {
  type: "seen",
  kanji: "30",
  kana: "30",
  definition: "30",
  pitchAccents: [],
  order: 5,
  known: false,
  lastSeen: timeNow - intervalTime * 2,
  seenCount: 2,
};
