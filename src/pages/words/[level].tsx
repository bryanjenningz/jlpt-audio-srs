import { useState } from "react";
import { useWords } from "~/words/hooks";
import { ProgressBar } from "~/components/progress-bar";
import { SideMenu } from "~/components/side-menu";
import { MenuIcon } from "~/icons/menu-icon";
import { WordTable } from "~/components/word-table";
import { type Word } from "~/words/types";
import { useLevel } from "~/utils/levels";
import { WordTablePagination } from "~/components/word-table-pagination";
import {
  DEFAULT_PAGE,
  WORDS_PER_PAGE,
  useWordTablePaginationStore,
} from "~/stores/word-table-pagination-store";
import { useStore } from "~/stores/use-store";
import Head from "next/head";

export default function Home() {
  const level = useLevel();
  const [words, setWords] = useWords(level);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const page =
    useStore(useWordTablePaginationStore, (x) => x.page[level]) ??
    DEFAULT_PAGE[level];

  return (
    <>
      <Head>
        <style>
          {/* Disable scrolling on body */}
          {`body { overflow: hidden; }`}
        </style>
      </Head>

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

          <WordTable
            words={words.slice(
              page * WORDS_PER_PAGE,
              (page + 1) * WORDS_PER_PAGE,
            )}
            setWords={(updateWords: (words: Word[]) => Word[]) =>
              setWords(level, updateWords)
            }
          />

          <WordTablePagination />
        </div>
      </main>
    </>
  );
}
