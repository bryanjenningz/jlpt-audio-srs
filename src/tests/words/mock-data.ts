import { type SeenWord, type UnseenWord } from "~/words/types";

export const timeNow = 100_000;

export const unseenWord: UnseenWord = {
  type: "unseen",
  japanese: "0",
  english: "0",
};

export const wordSeenOnce20SecondsAgo: SeenWord = {
  type: "seen",
  japanese: "20",
  english: "20",
  lastSeen: timeNow - 20_000,
  seenCount: 1,
};

export const wordSeenOnce15SecondsAgo: SeenWord = {
  type: "seen",
  japanese: "15",
  english: "15",
  lastSeen: timeNow - 15_000,
  seenCount: 1,
};

export const wordSeenOnce10SecondsAgo: SeenWord = {
  type: "seen",
  japanese: "10",
  english: "10",
  lastSeen: timeNow - 10_000,
  seenCount: 1,
};

export const wordSeenTwice30SecondsAgo: SeenWord = {
  type: "seen",
  japanese: "30",
  english: "30",
  lastSeen: timeNow - 30_000,
  seenCount: 2,
};
