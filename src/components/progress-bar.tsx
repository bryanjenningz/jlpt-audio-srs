import { useState } from "react";
import { type Word } from "~/words/types";

type ProgressBarKey = keyof typeof progressBarStates;

const progressBarStates = {
  0: "percent",
  1: "complete",
  2: "seenOrComplete",
} as const;

export function ProgressBar({ words }: { words: Word[] }) {
  const [percentCompleteShown, setPercentCompleteShown] =
    useState<ProgressBarKey>(0);
  const completeCount = words.filter((word) => word.known).length;
  const completeOrSeenCount = words.filter(
    (word) => word.known || word.type === "seen",
  ).length;
  const percentComplete = Math.floor((completeCount / words.length) * 100);
  const percentCompleteOrSeen = Math.floor(
    (completeOrSeenCount / words.length) * 100,
  );

  return (
    <button
      aria-hidden
      className="relative h-5 w-full overflow-hidden rounded-full bg-slate-800"
      onClick={() =>
        setPercentCompleteShown((x): ProgressBarKey => {
          switch (x) {
            case 0:
              return 1;
            case 1:
              return 2;
            case 2:
              return 0;
          }
        })
      }
    >
      <div
        className="absolute bottom-0 left-0 top-0 bg-blue-700 text-center"
        style={{
          width: ((): `${string}%` => {
            switch (progressBarStates[percentCompleteShown]) {
              case "percent":
              case "complete":
                return `${percentComplete}%`;
              case "seenOrComplete":
                return `${percentCompleteOrSeen}%`;
            }
          })(),
        }}
      ></div>

      <div className="absolute inset-0 flex items-center justify-center">
        {((): string => {
          if (words.length === 0) {
            return "";
          }
          switch (progressBarStates[percentCompleteShown]) {
            case "percent":
              return `${percentComplete}% complete`;
            case "complete":
              return `${completeCount} / ${words.length} complete`;
            case "seenOrComplete":
              return `${completeOrSeenCount} / ${words.length} seen or complete`;
          }
        })()}
      </div>
    </button>
  );
}
