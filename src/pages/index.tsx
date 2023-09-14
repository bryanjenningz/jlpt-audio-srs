import { useCallback, useEffect, useState } from "react";
import { playEnglish, playJapanese, wait } from "~/segments/play";
import { useWords } from "~/words/hooks";
import { nextWord } from "~/words/next-word";
import { type Word } from "~/words/types";
import { updateNextWord } from "~/words/update-next-word";
import { ProgressBar } from "~/components/progress-bar";
import { WordTable } from "~/components/word-table";
import { AutoplayButton } from "~/components/autoplay-button";
import { LastWordButtons } from "~/components/last-word-buttons";

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
        <ProgressBar words={words} />

        <WordTable words={words} setWords={setWords} />

        <AutoplayButton autoplay={autoplay} setAutoplay={setAutoplay} />

        {lastWord && (
          <LastWordButtons
            lastWord={lastWord}
            setLastWord={setLastWord}
            setWords={setWords}
          />
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
