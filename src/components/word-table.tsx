import { useState } from "react";
import { type Word } from "~/words/types";
import { classNames } from "~/utils/class-names";
import { Pronunciation } from "~/components/pronunciation";

type ToggleRange =
  | { type: "CLOSED" }
  | { type: "TOGGLING_FIRST" }
  | { type: "TOGGLING_SECOND"; firstIndex: number };

export function WordTable({
  words,
  setWords,
}: {
  words: Word[];
  setWords: (updateWords: (words: Word[]) => Word[]) => void;
}) {
  const [toggleRange, setToggleRange] = useState<ToggleRange>({
    type: "CLOSED",
  });

  return (
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
                      return word.type === "seen" || word.known
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

                    setWords((words) =>
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
              <td className="mr-3 flex items-center">
                <input
                  className="h-5 w-5"
                  type="checkbox"
                  checked={word.known}
                  onChange={() =>
                    setWords((words) =>
                      words.map((w) =>
                        w.order === word.order ? { ...w, known: !w.known } : w,
                      ),
                    )
                  }
                />
              </td>

              <td className="grow basis-1">{word.kanji}</td>
              <td className="grow basis-1 text-sm">
                <Pronunciation
                  pronunciation={word.kana}
                  pitchAccents={word.pitchAccents}
                  pitchAccentsShown={1}
                />
              </td>
              <td className="grow basis-1 text-sm">{word.definition}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
