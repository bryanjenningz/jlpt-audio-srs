import { create } from "zustand";
import { persist } from "zustand/middleware";

type SettingsStore = {
  pitchAccentShown: boolean;
  togglePitchAccentShown: () => void;
  waitTimeAfterQuestion: number;
  setWaitTimeAfterQuestion: (waitTimeAfterQuestion: number) => void;
  waitTimeAfterAnswer: number;
  setWaitTimeAfterAnswer: (waitTimeAfterAnswer: number) => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      pitchAccentShown: true,
      togglePitchAccentShown: () => {
        set(({ pitchAccentShown }) => ({
          pitchAccentShown: !pitchAccentShown,
        }));
      },
      waitTimeAfterQuestion: 1000,
      setWaitTimeAfterQuestion: (waitTimeAfterQuestion: number) => {
        set({
          waitTimeAfterQuestion: Math.min(
            5_000,
            Math.max(0, waitTimeAfterQuestion),
          ),
        });
      },
      waitTimeAfterAnswer: 0,
      setWaitTimeAfterAnswer: (waitTimeAfterAnswer: number) => {
        set({
          waitTimeAfterAnswer: Math.min(
            5_000,
            Math.max(0, waitTimeAfterAnswer),
          ),
        });
      },
    }),
    { name: "settings" },
  ),
);
