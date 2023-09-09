import { useCallback, useEffect, useState } from "react";
import { playEnglish, playJapanese, wait } from "~/segments/play";
import { useWords } from "~/words/hooks";
import { nextWord } from "~/words/next-word";
import { type SeenWord, type Word } from "~/words/types";
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

  const seenWords = words.filter((x): x is SeenWord => x.type === "seen");

  return (
    <main className="flex min-h-screen flex-col items-center bg-black text-white">
      <div className="flex w-full max-w-2xl flex-col items-center p-5">
        <p>{`Unique words seen: ${seenWords.length}`}</p>

        <article className="flex w-full max-w-2xl bg-slate-900 p-2 text-lg">
          <div
            className="flex h-full items-center justify-center pr-0"
            title="Skip (already known)"
          >
            <div className="mr-3 text-xl">{`⏩`}</div>
          </div>

          {["Kanji", "Kana", "Definition"].map((col) => {
            return (
              <div key={col} className="flex grow basis-1 items-center">
                {col}
              </div>
            );
          })}
        </article>

        <ul className="max-h-52 w-full max-w-2xl overflow-auto text-lg">
          {seenWords.map((word) => {
            return (
              <li
                key={`${word.kanji}-${word.definition}`}
                className="flex items-center p-2 odd:bg-slate-800"
              >
                <input
                  className="mr-3 h-5 w-5"
                  type="checkbox"
                  checked={word.known}
                  onChange={() =>
                    setWords(
                      words.map((w) =>
                        w.order === word.order && w.type === "seen"
                          ? { ...w, known: !w.known }
                          : w,
                      ),
                    )
                  }
                />

                <div className="grow basis-1">{word.kanji}</div>
                <div className="grow basis-1">{word.kana}</div>
                <div className="grow basis-1">{word.definition}</div>
              </li>
            );
          })}
        </ul>

        <label className="flex gap-3">
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

        {wordPlaying && japaneseShown && (
          <div className="flex gap-3">
            <div>{wordPlaying.kanji}</div>
            <div>{wordPlaying.kana}</div>
          </div>
        )}
      </div>
    </main>
  );
}
