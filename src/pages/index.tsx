import { useCallback, useEffect, useState } from "react";
import { playEnglish, playJapanese, wait } from "~/segments/play";
import { useWords } from "~/words/hooks";
import { nextWord } from "~/words/next-word";
import { type Word } from "~/words/types";
import { updateNextWord } from "~/words/update-next-word";

export default function Home() {
  const [autoplay, setAutoplay] = useState(false);
  const [japaneseShown, setJapaneseShown] = useState(false);
  const [words, setWords] = useWords();
  const [wordPlaying, setWordPlaying] = useState<Word>();

  const playWord = useCallback(
    async (word: Word): Promise<void> => {
      setWordPlaying(word);
      await playEnglish(word.definition, speechSynthesis);
      await wait(1000);
      setJapaneseShown(true);
      await playJapanese(word.kanji, speechSynthesis);
      setJapaneseShown(false);
      setWordPlaying(undefined);
      setWords(updateNextWord(words, Date.now()));
    },
    [words, setWords],
  );

  useEffect(() => {
    void (async () => {
      if (autoplay && !wordPlaying) {
        const word = nextWord(words, Date.now());
        if (!word) return;
        await playWord(word);
      }
    })();
  }, [autoplay, wordPlaying, words, playWord]);

  const seenWords = words.filter((x) => x.type === "seen");

  return (
    <main className="flex min-h-screen flex-col items-center bg-black text-white">
      <div className="flex w-full max-w-2xl flex-col items-center p-5">
        <p>{`Unique words seen: ${seenWords.length}`}</p>

        <ul className="max-h-52 overflow-auto">
          {seenWords.map((word) => {
            return (
              <li
                key={`${word.kanji}-${word.definition}`}
                className="flex gap-3"
              >
                <div>{word.kanji}</div>
                <div>{word.definition}</div>
              </li>
            );
          })}
        </ul>

        <label>
          Autoplay
          <input
            type="checkbox"
            checked={autoplay}
            onChange={() => setAutoplay(!autoplay)}
          />
        </label>

        <button
          onClick={() => {
            void (async () => {
              if (!autoplay && !wordPlaying) {
                const word = nextWord(words, Date.now());
                if (!word) return;
                await playWord(word);
              }
            })();
          }}
        >
          Play next word
        </button>

        {wordPlaying && <div>{wordPlaying.definition}</div>}

        {wordPlaying && japaneseShown && <div>{wordPlaying.kanji}</div>}
      </div>
    </main>
  );
}
