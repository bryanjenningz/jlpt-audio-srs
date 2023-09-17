import { useState } from "react";
import { type Word } from "~/words/types";

const WORD_HISTORY_SIZE = 5;

type Level = 5 | 4;

export function useWordHistory(level: Level) {
  const [wordHistory, setWordHistory] = useState<Record<Level, Word[]>>({
    5: [],
    4: [],
  });

  function addToWordHistory(level: Level, word: Word) {
    setWordHistory((wordHistory) => ({
      ...wordHistory,
      [level]: [...wordHistory[level], word].slice(-WORD_HISTORY_SIZE),
    }));
  }

  return { wordHistory: wordHistory[level], addToWordHistory };
}
