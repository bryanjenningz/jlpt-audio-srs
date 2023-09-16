import { useState } from "react";
import { type Word } from "~/words/types";

const WORD_HISTORY_SIZE = 5;

export function useWordHistory() {
  const [wordHistory, setWordHistory] = useState<Word[]>([]);

  function addToWordHistory(word: Word) {
    setWordHistory((wordHistory) =>
      [...wordHistory, word].slice(-WORD_HISTORY_SIZE),
    );
  }

  return { wordHistory, addToWordHistory };
}
