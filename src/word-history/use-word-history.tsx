import { useState } from "react";
import { type Level } from "~/utils/levels";
import { type Word } from "~/words/types";

const WORD_HISTORY_SIZE = 5;

type WordHistoryRecord = Record<Level, Word[]>;

export function useWordHistory(level: Level) {
  const [wordHistory, setWordHistory] = useState<WordHistoryRecord>({
    5: [],
    4: [],
    3: [],
  });

  function addToWordHistory(level: Level, word: Word) {
    setWordHistory((wordHistory) => ({
      ...wordHistory,
      [level]: [...wordHistory[level], word].slice(-WORD_HISTORY_SIZE),
    }));
  }

  return { wordHistory: wordHistory[level], addToWordHistory };
}
