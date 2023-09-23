import { useCallback, useEffect, useState } from "react";
import { SideMenu } from "~/components/side-menu";
import { SimpleHeader } from "~/components/simple-header";

function usePitchAccentShown() {
  const key = "pitch-accent-shown";
  const [pitchAccentShown, setPitchAccentShown] = useState(true);

  useEffect(() => {
    setPitchAccentShown((localStorage.getItem(key) ?? "true") === "true");
  }, []);

  const togglePitchAccentShown = useCallback(() => {
    setPitchAccentShown((pitchAccentShown) => {
      const result = !pitchAccentShown;
      localStorage.setItem(key, String(result));
      return result;
    });
  }, []);

  return { pitchAccentShown, togglePitchAccentShown };
}

export default function Settings() {
  const { pitchAccentShown, togglePitchAccentShown } = usePitchAccentShown();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const settings = [
    {
      name: "Show pitch accent",
      value: pitchAccentShown,
      toggle: togglePitchAccentShown,
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center bg-black text-white">
      <SimpleHeader
        openSideMenu={() => setIsSideMenuOpen(true)}
        title="Settings"
      />

      <SideMenu
        isSideMenuOpen={isSideMenuOpen}
        closeSideMenu={() => setIsSideMenuOpen(false)}
      />

      <ul className="w-full max-w-2xl">
        {settings.map(({ name, toggle, value }) => {
          return (
            <li key={name}>
              <label className="flex justify-between p-4 text-lg">
                <span className="flex grow flex-col">
                  <span>{name}</span>
                  <span className="text-sm text-slate-400">
                    {value ? "Enabled" : "Disabled"}
                  </span>
                </span>
                <input
                  className="w-5"
                  type="checkbox"
                  checked={value}
                  onChange={toggle}
                />
              </label>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
