import { useCallback, useEffect, useState } from "react";
import { fetchWords } from "~/words/fetch";
import { wordsSchema, type Word } from "~/words/types";

const localStorageKey = "words";

export function useWords() {
  const [words, setWords] = useState<Word[]>([]);

  const saveWords = useCallback((words: Word[]): void => {
    setWords(words);
    localStorage.setItem(localStorageKey, JSON.stringify(words));
  }, []);

  useEffect(() => {
    try {
      const words = wordsSchema.parse(localStorage.getItem(localStorageKey));
      setWords(words);
    } catch {
      void (async () => {
        const words = await fetchWords();
        saveWords(words);
      })();
    }
  }, [saveWords]);

  return [words, saveWords] as const;
}
