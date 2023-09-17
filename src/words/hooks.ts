import { useCallback, useEffect, useState } from "react";
import { fetchWords } from "~/words/fetch";
import { wordsSchema, type Word } from "~/words/types";

const localStorageKey = "words";

export function useWords(level: 4 | 5) {
  const key = localStorageKey + level;
  const [words, setWords] = useState<Word[]>([]);

  const saveWords = useCallback(
    (level: number, updateWords: (words: Word[]) => Word[]): void => {
      setWords((words: Word[]): Word[] => {
        localStorage.setItem(key, JSON.stringify(words));
        return updateWords(words);
      });
    },
    [key],
  );

  useEffect(() => {
    console.log("useEffect level", { level });
    try {
      const words = wordsSchema.parse(
        JSON.parse(localStorage.getItem(key) ?? "0"),
      );
      if (words.length === 0) {
        throw new Error("Empty words");
      }
      setWords(words);
    } catch {
      void (async () => {
        const words = await fetchWords(level);
        saveWords(level, () => words);
      })();
    }
  }, [saveWords, key, level]);

  return [words, saveWords] as const;
}
