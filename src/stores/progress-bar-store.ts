import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProgressBarStore = {
  progressBarState: ProgressBarState;
  toggleProgressBarState: () => void;
};

type ProgressBarState = "known" | "seen";

export const useProgressBarStore = create<ProgressBarStore>()(
  persist(
    (set) => ({
      progressBarState: "known",
      toggleProgressBarState: () => {
        set(({ progressBarState }) => ({
          progressBarState: progressBarState === "known" ? "seen" : "known",
        }));
      },
    }),
    { name: "progress-bar" },
  ),
);
