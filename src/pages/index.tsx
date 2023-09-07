import { intro } from "~/segments/instructions";
import { play } from "~/segments/play";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-black text-white">
      <div className="flex w-full max-w-2xl flex-col items-center p-5">
        <button
          onClick={() =>
            void play(
              { type: "speech", text: intro, language: "en-US" },
              speechSynthesis,
            )
          }
        >
          Play intro
        </button>
      </div>
    </main>
  );
}
