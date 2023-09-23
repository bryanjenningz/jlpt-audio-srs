import { useProgressBarStore } from "~/stores/progress-bar-store";
import { useStore } from "~/stores/use-store";
import { type Word } from "~/words/types";

export function ProgressBar({ words }: { words: Word[] }) {
  const progressBarState =
    useStore(useProgressBarStore, (x) => x.progressBarState) ?? "complete";
  const toggleProgressBarState = useProgressBarStore(
    (x) => x.toggleProgressBarState,
  );
  const completeCount = words.filter((word) => word.known).length;
  const seenOrCompleteCount = words.filter(
    (word) => word.known || word.type === "seen",
  ).length;
  const completePercent = Math.floor((completeCount / words.length) * 100);
  const seenOrCompletePercent = Math.floor(
    (seenOrCompleteCount / words.length) * 100,
  );

  return (
    <button
      aria-hidden
      className="relative h-5 w-full overflow-hidden rounded-full bg-slate-800"
      onClick={toggleProgressBarState}
    >
      <div
        className="absolute bottom-0 left-0 top-0 bg-blue-700 text-center"
        style={{
          width:
            progressBarState === "complete"
              ? `${completePercent}%`
              : `${seenOrCompletePercent}%`,
        }}
      ></div>

      <div className="absolute inset-0 flex items-center justify-center text-xs">
        {words.length === 0
          ? ""
          : progressBarState === "complete"
          ? `${completeCount} / ${words.length} (${completePercent}%) complete`
          : `${seenOrCompleteCount} / ${words.length} (${seenOrCompletePercent}%) seen or complete`}
      </div>
    </button>
  );
}
