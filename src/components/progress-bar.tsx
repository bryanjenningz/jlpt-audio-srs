import { useState } from "react";
import { type Word } from "~/words/types";

type ProgressBarState = "complete" | "seenOrComplete";

export function ProgressBar({ words }: { words: Word[] }) {
  const [state, setState] = useState<ProgressBarState>("complete");
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
        setState((x) => (x === "complete" ? "seenOrComplete" : "complete"))
      }
    >
      <div
        className="absolute bottom-0 left-0 top-0 bg-blue-700 text-center"
        style={{
          width:
            state === "complete"
              ? `${percentComplete}%`
              : `${percentCompleteOrSeen}%`,
        }}
      ></div>

      <div className="absolute inset-0 flex items-center justify-center text-xs">
        {words.length === 0
          ? ""
          : state === "complete"
          ? `${completeCount} / ${words.length} (${percentComplete}%) complete`
          : `${completeOrSeenCount} / ${words.length} (${percentCompleteOrSeen}%) seen or complete`}
      </div>
    </button>
  );
}
