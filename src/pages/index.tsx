import { useCallback, useEffect, useState } from "react";
import { playEnglish, playJapanese } from "~/utils/play";
import { wait } from "~/utils/wait";
import { useWords } from "~/words/hooks";
import { nextWord } from "~/words/next-word";
import { type Word } from "~/words/types";
import { updateNextWord } from "~/words/update-next-word";
import { ProgressBar } from "~/components/progress-bar";
import { WordTable } from "~/components/word-table";
import { AutoplayButton } from "~/components/autoplay-button";
import { classNames } from "~/utils/class-names";

const WORD_HISTORY_SIZE = 5;

function useWordHistory() {
  const [wordHistory, setWordHistory] = useState<Word[]>([]);

  function addToWordHistory(word: Word) {
    setWordHistory((wordHistory) =>
      [...wordHistory, word].slice(-WORD_HISTORY_SIZE),
    );
  }

  return { wordHistory, addToWordHistory };
}

export default function Home() {
  const [autoplay, setAutoplay] = useState(false);
  const [japaneseShown, setJapaneseShown] = useState(false);
  const [words, setWords] = useWords();
  const [wordPlaying, setWordPlaying] = useState<Word>();
  const { wordHistory, addToWordHistory } = useWordHistory();
  const wordHistoryWithWords = wordHistory
    .map((word) => words.find((w) => w.order === word.order))
    .filter(Boolean);

  const playWord = useCallback(
    async (word: Word, now: number): Promise<void> => {
      setWordPlaying(word);
      await playEnglish(word.definition, speechSynthesis);
      await wait(1000);
      setJapaneseShown(true);
      addToWordHistory(word);
      await playJapanese(word.kanji, speechSynthesis);
      setJapaneseShown(false);
      setWordPlaying(undefined);
      setWords((words) => updateNextWord(words, now));
    },
    [setWords, addToWordHistory],
  );

  useEffect(() => {
    void (async () => {
      if (autoplay && !wordPlaying) {
        const now = Date.now();
        const word = nextWord(words, now);
        if (!word) return;
        await playWord(word, now);
      }
    })();
  }, [autoplay, wordPlaying, words, playWord]);

  return (
    <main className="flex min-h-screen flex-col items-center bg-black text-white">
      <div className="flex w-full max-w-2xl flex-col items-center gap-3 p-4">
        <ProgressBar words={words} />

        <WordTable words={words} setWords={setWords} />

        <AutoplayButton autoplay={autoplay} setAutoplay={setAutoplay} />

        {wordPlaying && <div className="text-lg">{wordPlaying.definition}</div>}

        {wordPlaying && japaneseShown && (
          <div className="flex gap-3 text-lg">
            <div>{wordPlaying.kanji}</div>
            <div>{wordPlaying.kana}</div>
          </div>
        )}

        {wordHistoryWithWords.length > 0 && (
          <article className="flex w-full flex-col gap-2">
            <h2 className="font-bold">Word history</h2>

            <ul className="flex flex-col gap-1">
              {wordHistoryWithWords.map((wordHistoryEntry, i) => {
                return (
                  <li
                    key={`${wordHistoryEntry.kanji}-${wordHistoryEntry.definition}-${wordHistoryEntry.order}-${i}`}
                    className={classNames(
                      "flex items-center gap-3 rounded-full px-4",
                      wordHistoryEntry.known
                        ? "bg-blue-700 even:bg-blue-800"
                        : "bg-slate-700 even:bg-slate-800",
                    )}
                  >
                    <div className="flex grow items-center gap-3">
                      <h3 className="line-clamp-1 shrink-0 text-ellipsis text-xs">
                        {`${wordHistoryEntry.kanji} ${wordHistoryEntry.kana}`}
                      </h3>
                      <p className="line-clamp-1 text-ellipsis text-xs">
                        {wordHistoryEntry.definition}
                      </p>
                    </div>
                    <button
                      className="line-clamp-1 shrink-0 rounded-full bg-slate-600 px-2 py-1 text-xs"
                      onClick={() =>
                        setWords((words) =>
                          words.map((word) =>
                            wordHistoryEntry.order === word.order
                              ? { ...word, known: !word.known }
                              : word,
                          ),
                        )
                      }
                    >
                      {wordHistoryEntry.known ? `Not known` : `Known`}
                    </button>
                  </li>
                );
              })}
            </ul>
          </article>
        )}
      </div>
    </main>
  );
}
