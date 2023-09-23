import { create } from "zustand";
import { persist } from "zustand/middleware";

type SettingsStore = {
  pitchAccentShown: boolean;
  togglePitchAccentShown: () => void;
};

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      pitchAccentShown: true,
      togglePitchAccentShown: () => {
        set(({ pitchAccentShown }) => ({
          pitchAccentShown: !pitchAccentShown,
        }));
      },
    }),
    { name: "pitch-accent-settings" },
  ),
);
