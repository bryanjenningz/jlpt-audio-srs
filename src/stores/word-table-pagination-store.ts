import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Level } from "~/utils/levels";

type WordTablePaginationStore = {
  page: Record<Level, number>;
  incrementPage: (level: Level) => void;
  decrementPage: (level: Level) => void;
};

export const DEFAULT_PAGE = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

export const WORDS_PER_PAGE = 100;

export const useWordTablePaginationStore = create<WordTablePaginationStore>()(
  persist(
    (set) => ({
      page: DEFAULT_PAGE,
      incrementPage: (level: Level) => {
        set(({ page }) => ({ page: { ...page, [level]: page[level] + 1 } }));
      },
      decrementPage: (level: Level) => {
        set(({ page }) => ({ page: { ...page, [level]: page[level] - 1 } }));
      },
    }),
    { name: "word-table-pagination" },
  ),
);
