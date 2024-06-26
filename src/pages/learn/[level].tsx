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
import { useLevel } from "~/utils/levels";
import { Pronunciation } from "~/components/pronunciation";
import { useStore } from "~/stores/use-store";
import { useSettingsStore } from "~/stores/settings-store";

export default function Learn() {
  const level = useLevel();
  const [autoplay, setAutoplay] = useState(false);
  const [japaneseShown, setJapaneseShown] = useState(false);
  const [words, setWords] = useWords(level);
  const [wordPlaying, setWordPlaying] = useState<Word>();
  const { wordHistory, addToWordHistory } = useWordHistory(level);
  const wordHistoryWithWords = wordHistory
    .map((word) => words.find((w) => w.order === word.order))
    .filter(Boolean);
  const waitTimeAfterQuestion =
    useStore(useSettingsStore, (x) => x.waitTimeAfterQuestion) ?? 1000;
  const waitTimeAfterAnswer =
    useStore(useSettingsStore, (x) => x.waitTimeAfterAnswer) ?? 0;
  const maxSeenUnknownWords =
    useStore(useSettingsStore, (x) => x.maxSeenUnknownWords) ?? 0;

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const playWord = useCallback(
    async (
      word: Word,
      now: number,
      maxSeenUnknownWords: number,
    ): Promise<void> => {
      setWordPlaying(word);
      await playEnglish(word.definition, speechSynthesis);
      await wait(waitTimeAfterQuestion);
      setJapaneseShown(true);
      addToWordHistory(level, word);
      await playJapanese(word.kanji, speechSynthesis);
      await wait(waitTimeAfterAnswer);
      setJapaneseShown(false);
      setWordPlaying(undefined);
      setWords(level, (words) =>
        updateNextWord({ words, now, maxSeenUnknownWords }),
      );
    },
    [
      setWords,
      addToWordHistory,
      level,
      waitTimeAfterQuestion,
      waitTimeAfterAnswer,
    ],
  );

  useEffect(() => {
    void (async () => {
      if (autoplay && !wordPlaying) {
        const now = Date.now();
        const word = nextWord({ words, now, maxSeenUnknownWords });
        if (!word) return;
        await playWord(word, now, maxSeenUnknownWords);
      }
    })();
  }, [autoplay, wordPlaying, words, playWord, maxSeenUnknownWords]);

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
              setWords={(updateWords: (words: Word[]) => Word[]) =>
                setWords(level, updateWords)
              }
            />
          )}
        </section>

        <SideMenu
          isSideMenuOpen={isSideMenuOpen}
          closeSideMenu={() => setIsSideMenuOpen(false)}
        />

        <section className="flex w-full flex-col items-center gap-5">
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
                <Pronunciation
                  kana={wordPlaying.kana}
                  pitchAccents={wordPlaying.pitchAccents}
                  pitchAccentsShown={1}
                />
              </div>
            </>
          )}

          <AutoplayButton autoplay={autoplay} setAutoplay={setAutoplay} />
        </section>
      </div>
    </main>
  );
}
