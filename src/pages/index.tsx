import { play } from "~/segments/play";
import { useWords } from "~/words/hooks";
import { nextWord } from "~/words/next-word";

export default function Home() {
  const [words, setWords] = useWords();

  const word = nextWord(words, Date.now());

  return (
    <main className="flex min-h-screen flex-col items-center bg-black text-white">
      <div className="flex w-full max-w-2xl flex-col items-center p-5">
        {!word ? (
          <></>
        ) : (
          <button
            onClick={() => {
              void (async () => {
                await play(
                  {
                    type: "speech",
                    text: `Say the following in Japanese... "${word.english}".`,
                    language: "en-US",
                  },
                  speechSynthesis,
                );

                await play(
                  { type: "wait", milliseconds: 1000 },
                  speechSynthesis,
                );

                await play(
                  { type: "speech", text: word.japanese, language: "ja-JP" },
                  speechSynthesis,
                );

                const newWords = words.filter((w) => w !== word);
                setWords([
                  ...newWords,
                  {
                    ...word,
                    lastSeen: Date.now(),
                    seenCount: (word.seenCount ?? 0) + 1,
                  },
                ]);
              })();
            }}
          >
            Play next word
          </button>
        )}
      </div>
    </main>
  );
}
