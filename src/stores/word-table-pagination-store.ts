import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Level } from "~/utils/levels";

type WordTableStore = {
  page: Record<Level, number>;
  incrementPage: (level: Level) => void;
  decrementPage: (level: Level) => void;
};

export const useWordTableStore = create<WordTableStore>()(
  persist(
    (set) => ({
      page: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      incrementPage: (level: Level) => {
        set(({ page }) => ({ page: { ...page, [level]: page[level] + 1 } }));
      },
      decrementPage: (level: Level) => {
        set(({ page }) => ({ page: { ...page, [level]: page[level] - 1 } }));
      },
    }),
    { name: "word-table" },
  ),
);
