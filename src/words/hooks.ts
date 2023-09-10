import { useCallback, useEffect, useState } from "react";
import { fetchWords } from "~/words/fetch";
import { wordsSchema, type Word } from "~/words/types";

const localStorageKey = "words";

export function useWords() {
  const [words, setWords] = useState<Word[]>([]);

  const saveWords = useCallback(
    (updateWords: (words: Word[]) => Word[]): void => {
      setWords((words: Word[]): Word[] => {
        localStorage.setItem(localStorageKey, JSON.stringify(words));
        return updateWords(words);
      });
    },
    [],
  );

  useEffect(() => {
    try {
      const words = wordsSchema.parse(
        JSON.parse(localStorage.getItem(localStorageKey) ?? "0"),
      );
      setWords(words);
    } catch {
      void (async () => {
        const words = await fetchWords();
        saveWords(() => words);
      })();
    }
  }, [saveWords]);

  return [words, saveWords] as const;
}
