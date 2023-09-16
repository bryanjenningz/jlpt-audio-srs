import { useState } from "react";
import { useWords } from "~/words/hooks";
import { ProgressBar } from "~/components/progress-bar";
import { SideMenu } from "~/components/side-menu";
import { MenuIcon } from "~/icons/menu-icon";
import { WordTable } from "~/components/word-table";

export default function Home() {
  const [words, setWords] = useWords();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  return (
    <main className="flex min-h-[100dvh] flex-col items-center bg-black text-white">
      <div className="flex w-full max-w-2xl grow flex-col items-center gap-3 p-4">
        <section className="flex w-full flex-col gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSideMenuOpen((x) => !x)}>
              <span className="sr-only">Open menu</span>
              <MenuIcon />
            </button>

            <ProgressBar words={words} />
          </div>
        </section>

        <SideMenu
          isSideMenuOpen={isSideMenuOpen}
          closeSideMenu={() => setIsSideMenuOpen(false)}
        />

        <WordTable words={words} setWords={setWords} />
      </div>
    </main>
  );
}
