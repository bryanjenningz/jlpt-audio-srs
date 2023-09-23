import { useState } from "react";
import { SideMenu } from "~/components/side-menu";
import { SimpleHeader } from "~/components/simple-header";
import { useSettingsStore } from "~/stores/settings-store";
import { useStore } from "~/stores/use-store";

export default function Settings() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const pitchAccentShown =
    useStore(useSettingsStore, (x) => x.pitchAccentShown) ?? true;
  const togglePitchAccentShown = useSettingsStore(
    (x) => x.togglePitchAccentShown,
  );
  const waitTimeAfterQuestion =
    useStore(useSettingsStore, (x) => x.waitTimeAfterQuestion) ?? 1000;
  const setWaitTimeAfterQuestion = useSettingsStore(
    (x) => x.setWaitTimeAfterQuestion,
  );
  const waitTimeAfterAnswer =
    useStore(useSettingsStore, (x) => x.waitTimeAfterAnswer) ?? 0;
  const setWaitTimeAfterAnswer = useSettingsStore(
    (x) => x.setWaitTimeAfterAnswer,
  );

  const settings = [
    {
      type: "boolean",
      name: "Show pitch accent",
      value: pitchAccentShown,
      toggle: togglePitchAccentShown,
    },
    {
      type: "number",
      name: "Wait time after question",
      description: "Time in milliseconds (0 to 5000)",
      value: waitTimeAfterQuestion,
      setValue: setWaitTimeAfterQuestion,
      min: 0,
      max: 5000,
    },
    {
      type: "number",
      name: "Wait time after answer",
      description: "Time in milliseconds (0 to 5000)",
      value: waitTimeAfterAnswer,
      setValue: setWaitTimeAfterAnswer,
      min: 0,
      max: 5000,
    },
  ] as const;

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
        {settings.map((setting) => {
          switch (setting.type) {
            case "boolean": {
              const { name, value, toggle } = setting;
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
            }

            case "number": {
              const { name, description, value, setValue, min, max } = setting;
              return (
                <li key={name}>
                  <label className="flex justify-between p-4 text-lg">
                    <span className="flex grow flex-col">
                      <span>{name}</span>
                      <span className="text-sm text-slate-400">
                        {description}
                      </span>
                    </span>
                    <span>
                      <input
                        className="bg-slate-700 px-3 py-1"
                        type="number"
                        value={value}
                        onChange={(e) => setValue(Number(e.target.value))}
                        min={min}
                        max={max}
                      />
                    </span>
                  </label>
                </li>
              );
            }
          }
        })}
      </ul>
    </main>
  );
}
