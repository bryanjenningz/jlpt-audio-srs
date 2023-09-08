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
  const [isPlaying, setIsPlaying] = useState(false);

  const word = nextWord(words, Date.now());

  const playWord = useCallback(
    async (word: Word): Promise<void> => {
      setIsPlaying(true);
      await playEnglish(word.english, speechSynthesis);
      await wait(1000);
      setJapaneseShown(true);
      await playJapanese(word.japanese, speechSynthesis);
      setJapaneseShown(false);
      setIsPlaying(false);
      setWords(updateNextWord(words, Date.now()));
    },
    [words, setWords],
  );

  useEffect(() => {
    void (async () => {
      if (autoplay && !isPlaying && word) {
        await playWord(word);
      }
    })();
  }, [autoplay, isPlaying, word, playWord]);

  return (
    <main className="flex min-h-screen flex-col items-center bg-black text-white">
      <div className="flex w-full max-w-2xl flex-col items-center p-5">
        <label>
          Autoplay
          <input
            type="checkbox"
            checked={autoplay}
            onChange={() => setAutoplay(!autoplay)}
          />
        </label>

        {word && (
          <>
            <button onClick={() => void playWord(word)}>Play next word</button>

            {isPlaying && <div>{word.english}</div>}

            {japaneseShown && <div>{word.japanese}</div>}
          </>
        )}
      </div>
    </main>
  );
}
