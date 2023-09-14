import { type Word } from "~/words/types";

export function LastWordButtons({
  lastWord,
  setLastWord,
  setWords,
}: {
  lastWord: Word;
  setLastWord: (lastWord: undefined) => void;
  setWords: (updateWords: (words: Word[]) => Word[]) => void;
}) {
  return (
    <div className="flex w-full gap-3">
      <button
        className="flex h-11 grow basis-1 items-center justify-center overflow-hidden rounded-full bg-red-700 px-4 py-2 text-xs"
        onClick={() => {
          setWords((words) =>
            words.map((w) => {
              if (w.order === lastWord.order) {
                return {
                  ...w,
                  type: "unseen",
                  seenCount: 0,
                  lastSeen: 0,
                };
              }
              return w;
            }),
          );
          setLastWord(undefined);
        }}
      >
        {`Reset ${lastWord.kanji}`}
      </button>

      <button
        className="flex h-11 grow basis-1 items-center justify-center overflow-hidden rounded-full bg-blue-700 px-4 py-2 text-xs"
        onClick={() => {
          setWords((words) =>
            words.map((w) => {
              if (w.order === lastWord.order) {
                return { ...w, known: true };
              }
              return w;
            }),
          );
          setLastWord(undefined);
        }}
      >
        {`Know ${lastWord.kanji}`}
      </button>
    </div>
  );
}
