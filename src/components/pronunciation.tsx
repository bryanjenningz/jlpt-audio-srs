import { getMoras } from "~/utils/get-moras";
import { classNames } from "~/utils/class-names";
import { useSettingsStore } from "~/stores/settings-store";
import { useStore } from "~/stores/use-store";

export function Pronunciation({
  pronunciation,
  pitchAccents,
  pitchAccentsShown = Infinity,
}: {
  pronunciation: string;
  pitchAccents: number[];
  pitchAccentsShown: number;
}) {
  const pitchAccentShown =
    useStore(useSettingsStore, (x) => x.pitchAccentShown) ?? true;

  if (!pitchAccentShown) {
    return <div>{pronunciation}</div>;
  }

  const moras = getMoras(pronunciation);
  const fallIndexes = pitchAccents
    .slice(0, Math.max(1, pitchAccentsShown))
    .map((pitchAccent) => (pitchAccent === 0 ? Infinity : pitchAccent));

  return (
    <div className="flex gap-3">
      {fallIndexes.length > 0 ? (
        fallIndexes.map((fallIndex) => {
          return (
            <div key={`${pronunciation}-${fallIndex}`}>
              {moras.map((mora, i) => {
                return (
                  <div
                    key={`${mora}-${i}`}
                    className={classNames(
                      "inline-block border-blue-300",
                      ((): string => {
                        if (fallIndex === undefined) {
                          return "";
                        }
                        if (i + 1 === fallIndex) {
                          return "border-r border-t";
                        }
                        if (i >= fallIndex) {
                          return "border-b";
                        }
                        if (i === 0) {
                          return "border-b border-r";
                        }
                        return "border-t";
                      })(),
                    )}
                  >
                    {mora}
                  </div>
                );
              })}
            </div>
          );
        })
      ) : (
        <div>{pronunciation}</div>
      )}
    </div>
  );
}
