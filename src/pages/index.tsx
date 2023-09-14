import { useCallback, useEffect, useState } from "react";
import { playEnglish, playJapanese, wait } from "~/segments/play";
import { useWords } from "~/words/hooks";
import { nextWord } from "~/words/next-word";
import { type Word } from "~/words/types";
import { updateNextWord } from "~/words/update-next-word";
import { ProgressBar } from "~/components/progress-bar";
import { classNames } from "~/utils/classNames";
import { WordTable } from "~/components/word-table";

export default function Home() {
  const [autoplay, setAutoplay] = useState(false);
  const [japaneseShown, setJapaneseShown] = useState(false);
  const [words, setWords] = useWords();
  const [wordPlaying, setWordPlaying] = useState<Word>();
  const [lastWord, setLastWord] = useState<Word>();

  const playWord = useCallback(
    async (word: Word, now: number): Promise<void> => {
      setWordPlaying(word);
      await playEnglish(word.definition, speechSynthesis);
      await wait(1000);
      setJapaneseShown(true);
      await playJapanese(word.kanji, speechSynthesis);
      setJapaneseShown(false);
      setWordPlaying(undefined);
      setWords((words) => updateNextWord(words, now));
    },
    [setWords],
  );

  useEffect(() => {
    void (async () => {
      if (autoplay && !wordPlaying) {
        const now = Date.now();
        const word = nextWord(words, now);
        if (!lastWord) {
          setLastWord(word);
        }
        if (!word) return;
        await playWord(word, now);
        setLastWord(word);
      }
    })();
  }, [autoplay, wordPlaying, words, playWord, lastWord]);

  return (
    <main className="flex min-h-screen flex-col items-center bg-black text-white">
      <div className="flex w-full max-w-2xl flex-col items-center gap-3 p-4">
        {ProgressBar(words)}

        <WordTable words={words} setWords={setWords} />

        <label
          className={classNames(
            "flex w-full cursor-pointer justify-center rounded-full px-4 py-2 text-lg",
            autoplay ? "bg-blue-700" : "bg-slate-700",
          )}
        >
          {autoplay ? `Autoplaying` : `Autoplay`}
          <input
            className="hidden"
            type="checkbox"
            checked={autoplay}
            onChange={() => setAutoplay(!autoplay)}
          />
        </label>

        {lastWord && (
          <div className="flex w-full gap-3">
            <button
              className="flex h-11 grow basis-1 items-center justify-center overflow-hidden rounded-full bg-red-700 px-4 py-2 text-xs"
              onClick={() => {
                setWords((words) =>
                  words.map((w) => {
                    if (w.order === lastWord.order) {
                      return {
                        ...w,
                        type: "unseen",
                        seenCount: 0,
                        lastSeen: 0,
                      };
                    }
                    return w;
                  }),
                );
                setLastWord(undefined);
              }}
            >
              {`Reset ${lastWord.kanji}`}
            </button>

            <button
              className="flex h-11 grow basis-1 items-center justify-center overflow-hidden rounded-full bg-blue-700 px-4 py-2 text-xs"
              onClick={() => {
                setWords((words) =>
                  words.map((w) => {
                    if (w.order === lastWord.order) {
                      return { ...w, known: true };
                    }
                    return w;
                  }),
                );
                setLastWord(undefined);
              }}
            >
              {`Know ${lastWord.kanji}`}
            </button>
          </div>
        )}

        {wordPlaying && <div className="text-lg">{wordPlaying.definition}</div>}

        {wordPlaying && japaneseShown && (
          <div className="flex gap-3 text-lg">
            <div>{wordPlaying.kanji}</div>
            <div>{wordPlaying.kana}</div>
          </div>
        )}
      </div>
    </main>
  );
}
