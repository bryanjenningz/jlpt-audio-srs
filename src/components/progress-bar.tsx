import { useProgressBarStore } from "~/stores/progress-bar-store";
import { useStore } from "~/stores/use-store";
import { type Word } from "~/words/types";

export function ProgressBar({ words }: { words: Word[] }) {
  const progressBarState =
    useStore(useProgressBarStore, (x) => x.progressBarState) ?? "known";
  const toggleProgressBarState = useProgressBarStore(
    (x) => x.toggleProgressBarState,
  );
  const knownCount = words.filter((word) => word.known).length;
  const seenCount = words.filter(
    (word) => word.known || word.type === "seen",
  ).length;
  const knownPercent = Math.floor((knownCount / words.length) * 100);
  const seenPercent = Math.floor((seenCount / words.length) * 100);

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
            progressBarState === "known"
              ? `${knownPercent}%`
              : `${seenPercent}%`,
        }}
      ></div>

      <div className="absolute inset-0 flex items-center justify-center text-xs">
        {words.length === 0
          ? ""
          : progressBarState === "known"
          ? `${knownCount} / ${words.length} (${knownPercent}%) known`
          : `${seenCount} / ${words.length} (${seenPercent}%) seen`}
      </div>
    </button>
  );
}
