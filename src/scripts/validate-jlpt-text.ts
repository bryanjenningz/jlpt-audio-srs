import fs from "fs/promises";

const FILE_PATHS = [
  "./public/jlpt5.txt",
  "./public/jlpt4.txt",
  "./public/jlpt3.txt",
  "./public/jlpt2.txt",
  "./public/jlpt1.txt",
];
const ENTRY_SEPARATOR = "\n";
const FIELD_SEPARATOR = ";";
const PITCH_ACCENT_SEPARATOR = ",";

for (const filePath of FILE_PATHS) {
  const entries = (await fs.readFile(filePath))
    .toString()
    .split(ENTRY_SEPARATOR)
    .map((line) => {
      const sections = line.split(FIELD_SEPARATOR);
      if (
        sections.length !== 4 ||
        !sections[0] ||
        !sections[1] ||
        !sections[2] ||
        typeof sections[3] !== "string"
      ) {
        throw new Error(`Each line must have 4 sections: "${line}"`);
      }
      const pitchAccents = (() => {
        if (!sections[3]) return [];
        return sections[3].split(PITCH_ACCENT_SEPARATOR).map((pitchAccent) => {
          if (!pitchAccent.match(/^\d+$/) || Number.isNaN(pitchAccent)) {
            throw new Error(`Each pitch accent must be a number: "${line}"`);
          }
          return Number(pitchAccent);
        });
      })();
      return {
        kanji: sections[0].trim(),
        kana: sections[1].trim(),
        definition: sections[2].trim(),
        pitchAccents,
      };
    });

  const errors = [
    {
      name: `Lines must have 4 sections separated by "${FIELD_SEPARATOR}"`,
      lines: entries.filter(
        (entry) =>
          !entry.kanji ||
          !entry.kana ||
          !entry.definition ||
          !entry.pitchAccents,
      ),
    },
    {
      name: `All kanji must be unique`,
      lines: (() => {
        const kanjiCounts = count(entries.map((entry) => entry.kanji));
        return entries
          .filter((entry) => (kanjiCounts.get(entry.kanji) ?? 0) > 1)
          .sort((a, b) => {
            if (a.kanji < b.kanji) return -1;
            if (a.kanji > b.kanji) return 1;
            return 0;
          });
      })(),
    },
    {
      name: `All definitions must be unique`,
      lines: (() => {
        const definitionCounts = count(
          entries.map((entry) => entry.definition),
        );
        return entries
          .filter((entry) => (definitionCounts.get(entry.definition) ?? 0) > 1)
          .sort((a, b) => {
            if (a.definition < b.definition) return -1;
            if (a.definition > b.definition) return 1;
            return 0;
          });
      })(),
    },
    {
      name: `All kanji and kana must not have "/" in them`,
      lines: entries.filter((entry) =>
        (entry.kanji + entry.kana).includes("/"),
      ),
    },
  ].filter((category) => category.lines.length > 0);

  if (errors.length > 0) {
    throw new Error(
      `Errors for file "${filePath}":\n` +
        errors
          .map((error) => {
            return [
              error.name,
              error.lines
                .map((entry) =>
                  [entry.kanji, entry.kana, entry.definition].join(
                    FIELD_SEPARATOR,
                  ),
                )
                .join(ENTRY_SEPARATOR),
            ].join(":\n");
          })
          .join("\n\n"),
    );
  }

  // Uncomment to overwrite files
  // await fs.writeFile(
  //   filePath,
  //   entries
  //     .map((entry) =>
  //       [entry.kanji, entry.kana, entry.definition].join(FIELD_SEPARATOR),
  //     )
  //     .join(ENTRY_SEPARATOR),
  // );
}

function count<T>(values: Iterable<T>): Map<T, number> {
  const counts = new Map<T, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}
