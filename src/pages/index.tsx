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
      <div className="flex w-full max-w-2xl flex-col items-center gap-5 p-5">
        <p className="text-lg">{`Unique words seen: ${seenWords.length}`}</p>

        <table className="flex w-full flex-col">
          <thead>
            <tr className="flex w-full max-w-2xl bg-slate-900 p-2 text-lg">
              <th
                className="flex h-full items-center justify-center pr-0"
                title="Skip (already known)"
              >
                <div className="mr-3 text-xl">{`⏩`}</div>
              </th>

              {["Kanji", "Kana", "Definition"].map((col) => {
                return (
                  <th key={col} className="flex grow basis-1 items-center">
                    {col}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="max-h-52 w-full max-w-2xl overflow-auto text-lg">
            {words.map((word) => {
              return (
                <tr
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
                          w.order === word.order
                            ? { ...w, known: !w.known }
                            : w,
                        ),
                      )
                    }
                  />

                  <td className="grow basis-1">{word.kanji}</td>
                  <td className="grow basis-1">{word.kana}</td>
                  <td className="grow basis-1">{word.definition}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <label className="flex gap-3 text-lg">
          Autoplay
          <input
            type="checkbox"
            checked={autoplay}
            onChange={() => setAutoplay(!autoplay)}
          />
        </label>

        <button
          className="text-lg"
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
