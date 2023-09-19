import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { type Level } from "~/utils/levels";
import { fetchWords } from "~/words/fetch";
import { wordsSchema, type Word } from "~/words/types";

const localStorageKey = "words";

type WordRecord = Record<Level, Word[]>;

const wordRecordSchema = z.object({
  1: wordsSchema,
  2: wordsSchema,
  3: wordsSchema,
  4: wordsSchema,
  5: wordsSchema,
});

export function useWords(level: Level) {
  const [words, setWords] = useState<WordRecord>({
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  });

  const saveWords = useCallback(
    (level: Level, updateWords: (words: Word[]) => Word[]): void => {
      setWords((words: WordRecord): WordRecord => {
        const result = {
          ...words,
          [level]: updateWords(words[level]),
        };
        localStorage.setItem(localStorageKey, JSON.stringify(result));
        return result;
      });
    },
    [],
  );

  useEffect(() => {
    try {
      const words = wordRecordSchema.parse(
        JSON.parse(localStorage.getItem(localStorageKey) ?? "0"),
      );
      setWords(words);
    } catch {
      void (async () => {
        const words = await fetchWords(level);
        saveWords(level, () => words);
      })();
    }
  }, [saveWords, level]);

  return [words[level], saveWords] as const;
}
