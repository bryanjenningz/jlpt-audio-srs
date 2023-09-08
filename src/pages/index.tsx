import { playEnglish, playJapanese, wait } from "~/segments/play";
import { useWords } from "~/words/hooks";
import { nextWord } from "~/words/next-word";
import { updateNextWord } from "~/words/update-next-word";

export default function Home() {
  const [words, setWords] = useWords();

  const word = nextWord(words, Date.now());

  return (
    <main className="flex min-h-screen flex-col items-center bg-black text-white">
      <div className="flex w-full max-w-2xl flex-col items-center p-5">
        {word && (
          <>
            <button
              onClick={() => {
                void (async () => {
                  await playEnglish(word.english, speechSynthesis);
                  await wait(1000);
                  await playJapanese(word.japanese, speechSynthesis);
                  setWords(updateNextWord(words, Date.now()));
                })();
              }}
            >
              Play next word
            </button>

            <div>{word.english}</div>
          </>
        )}
      </div>
    </main>
  );
}
