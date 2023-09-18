import { useCallback, useEffect, useState } from "react";
import { type Level } from "~/utils/levels";
import { fetchWords } from "~/words/fetch";
import { wordsSchema, type Word } from "~/words/types";

const localStorageKey = "words";

type WordRecord = Record<Level, Word[]>;

export function useWords(level: Level) {
  const key = localStorageKey + level;
  const [words, setWords] = useState<WordRecord>({
    3: [],
    4: [],
    5: [],
  });

  const saveWords = useCallback(
    (level: Level, updateWords: (words: Word[]) => Word[]): void => {
      setWords((words: WordRecord): WordRecord => {
        localStorage.setItem(key, JSON.stringify(words));
        return {
          ...words,
          [level]: updateWords(words[level]),
        };
      });
    },
    [key],
  );

  useEffect(() => {
    try {
      const words = wordsSchema.parse(
        JSON.parse(localStorage.getItem(key) ?? "0"),
      );
      if (words.length === 0) {
        throw new Error("Empty words");
      }
      setWords((wordRecord) => ({ ...wordRecord, [level]: words }));
    } catch {
      void (async () => {
        const words = await fetchWords(level);
        saveWords(level, () => words);
      })();
    }
  }, [saveWords, key, level]);

  return [words[level], saveWords] as const;
}
