import { type Word } from "~/words/types";
import { classNames } from "~/utils/class-names";
import { Pronunciation } from "~/components/pronunciation";

export function WordHistory({
  wordHistoryWithWords,
  setWords,
}: {
  wordHistoryWithWords: Word[];
  setWords: (updateWords: (words: Word[]) => Word[]) => void;
}) {
  return (
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
                  : wordHistoryEntry.type === "unseen"
                  ? "bg-red-700"
                  : "bg-slate-700 even:bg-slate-800",
              )}
            >
              <div className="flex grow items-center gap-3">
                <h3 className="line-clamp-1 flex shrink-0 gap-2 text-ellipsis text-xs">
                  {wordHistoryEntry.kanji}
                  <Pronunciation
                    pronunciation={wordHistoryEntry.kana}
                    pitchAccents={wordHistoryEntry.pitchAccents}
                    pitchAccentsShown={1}
                  />
                </h3>
                <p className="line-clamp-1 text-ellipsis text-xs">
                  {wordHistoryEntry.definition}
                </p>
              </div>

              <button
                className="line-clamp-1 shrink-0 rounded-full bg-red-600 px-2 py-1 text-xs"
                onClick={() =>
                  setWords((words) =>
                    words.map((word) =>
                      wordHistoryEntry.order === word.order
                        ? {
                            ...word,
                            known: false,
                            type: "unseen",
                            lastSeen: 0,
                            seenCount: 0,
                          }
                        : word,
                    ),
                  )
                }
              >
                Reset
              </button>

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
  );
}
