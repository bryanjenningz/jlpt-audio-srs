import { useCallback, useEffect, useState } from "react";
import { playEnglish, playJapanese, wait } from "~/segments/play";
import { useWords } from "~/words/hooks";
import { nextWord } from "~/words/next-word";
import { type Word } from "~/words/types";
import { updateNextWord } from "~/words/update-next-word";

type ToggleRange =
  | { type: "CLOSED" }
  | { type: "TOGGLING_FIRST" }
  | { type: "TOGGLING_SECOND"; firstIndex: number };

function classNames(...classes: (string | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const [autoplay, setAutoplay] = useState(false);
  const [japaneseShown, setJapaneseShown] = useState(false);
  const [words, setWords] = useWords();
  const [wordPlaying, setWordPlaying] = useState<Word>();
  const [toggleRange, setToggleRange] = useState<ToggleRange>({
    type: "CLOSED",
  });

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

  return (
    <main className="flex min-h-screen flex-col items-center bg-black text-white">
      <div className="flex w-full max-w-2xl flex-col items-center gap-5 p-5">
        <table className="flex w-full flex-col">
          <thead>
            <tr className="flex w-full max-w-2xl bg-slate-900 p-2 text-lg">
              <th
                className="flex h-full items-center justify-center"
                onClick={() => {
                  switch (toggleRange.type) {
                    case "CLOSED":
                      return setToggleRange({ type: "TOGGLING_FIRST" });

                    case "TOGGLING_FIRST":
                    case "TOGGLING_SECOND":
                      return setToggleRange({ type: "CLOSED" });
                  }
                  toggleRange satisfies never;
                }}
              >
                {(() => {
                  switch (toggleRange.type) {
                    case "CLOSED":
                      return (
                        <button
                          title="Toggle known words"
                          className="mr-3 text-xl"
                        >{`⏩`}</button>
                      );

                    case "TOGGLING_FIRST":
                    case "TOGGLING_SECOND":
                      return (
                        <button
                          className="mr-3 text-xl"
                          onClick={() => setToggleRange({ type: "CLOSED" })}
                          title="Cancel toggle range"
                        >
                          {`❌`}
                        </button>
                      );
                  }
                })()}
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

          <tbody className="h-96 w-full max-w-2xl overflow-auto text-lg">
            {words.map((word, i) => {
              return (
                <tr
                  key={`${word.kanji}-${word.definition}`}
                  className={classNames(
                    "flex items-center p-2",
                    ((): string => {
                      switch (toggleRange.type) {
                        case "CLOSED":
                        case "TOGGLING_FIRST":
                          return word.type === "seen"
                            ? "odd:bg-blue-800 even:bg-blue-900"
                            : "odd:bg-slate-800";

                        case "TOGGLING_SECOND":
                          return i === toggleRange.firstIndex
                            ? "bg-blue-500"
                            : word.type === "seen"
                            ? "odd:bg-blue-800 even:bg-blue-900"
                            : "odd:bg-slate-800";
                      }
                    })(),
                  )}
                  onClick={() => {
                    switch (toggleRange.type) {
                      case "CLOSED":
                        return;

                      case "TOGGLING_FIRST":
                        return setToggleRange({
                          type: "TOGGLING_SECOND",
                          firstIndex: i,
                        });

                      case "TOGGLING_SECOND": {
                        const [first, second] =
                          toggleRange.firstIndex <= i
                            ? [toggleRange.firstIndex, i]
                            : [i, toggleRange.firstIndex];
                        const allKnown = words
                          .slice(first, second + 1)
                          .every((word) => word.known);
                        setWords(
                          words.map((word, i) => {
                            if (i >= first && i <= second) {
                              return { ...word, known: !allKnown };
                            }
                            return word;
                          }),
                        );
                        return setToggleRange({ type: "CLOSED" });
                      }
                    }
                    toggleRange satisfies never;
                  }}
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

        <label
          className={classNames(
            "flex w-full cursor-pointer justify-center gap-3 rounded-full px-4 py-2 text-lg",
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
