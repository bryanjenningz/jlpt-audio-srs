import { useCallback, useEffect, useState } from "react";
import { playEnglish, playJapanese } from "~/utils/play";
import { wait } from "~/utils/wait";
import { useWords } from "~/words/hooks";
import { nextWord } from "~/words/next-word";
import { type Word } from "~/words/types";
import { updateNextWord } from "~/words/update-next-word";
import { ProgressBar } from "~/components/progress-bar";
import { AutoplayButton } from "~/components/autoplay-button";
import { WordHistory } from "~/word-history/word-history";
import { useWordHistory } from "~/word-history/use-word-history";
import { classNames } from "~/utils/class-names";
import { SideMenu } from "~/components/side-menu";
import { MenuIcon } from "~/icons/menu-icon";

export default function Learn() {
  const [autoplay, setAutoplay] = useState(false);
  const [japaneseShown, setJapaneseShown] = useState(false);
  const [words, setWords] = useWords();
  const [wordPlaying, setWordPlaying] = useState<Word>();
  const { wordHistory, addToWordHistory } = useWordHistory();
  const wordHistoryWithWords = wordHistory
    .map((word) => words.find((w) => w.order === word.order))
    .filter(Boolean);

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

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
    <main className="flex min-h-[100dvh] flex-col items-center bg-black text-white">
      <div className="flex w-full max-w-2xl grow flex-col items-center justify-between gap-3 p-4">
        <section className="flex w-full flex-col gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSideMenuOpen((x) => !x)}>
              <span className="sr-only">Open menu</span>
              <MenuIcon />
            </button>

            <ProgressBar words={words} />
          </div>

          {wordHistoryWithWords.length > 0 && (
            <WordHistory
              wordHistoryWithWords={wordHistoryWithWords}
              setWords={setWords}
            />
          )}
        </section>

        <SideMenu
          isSideMenuOpen={isSideMenuOpen}
          closeSideMenu={() => setIsSideMenuOpen(false)}
        />

        <section className="flex w-full flex-col items-center gap-3">
          {wordPlaying && (
            <>
              <div className="text-lg">{wordPlaying.definition}</div>

              <div
                className={classNames(
                  "flex gap-3 text-lg",
                  !japaneseShown && "invisible",
                )}
              >
                <div>{wordPlaying.kanji}</div>
                <div>{wordPlaying.kana}</div>
              </div>
            </>
          )}

          <AutoplayButton autoplay={autoplay} setAutoplay={setAutoplay} />
        </section>
      </div>
    </main>
  );
}
