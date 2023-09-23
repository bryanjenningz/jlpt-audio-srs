import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProgressBarStore = {
  progressBarState: ProgressBarState;
  toggleProgressBarState: () => void;
};

type ProgressBarState = "complete" | "completeOrSeen";

export const useProgressBarStore = create<ProgressBarStore>()(
  persist(
    (set) => ({
      progressBarState: "complete",
      toggleProgressBarState: () => {
        set(({ progressBarState }) => ({
          progressBarState:
            progressBarState === "complete" ? "completeOrSeen" : "complete",
        }));
      },
    }),
    { name: "progress-bar" },
  ),
);
