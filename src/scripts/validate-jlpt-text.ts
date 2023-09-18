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

for (const filePath of FILE_PATHS) {
  const entries = (await fs.readFile(filePath))
    .toString()
    .split(ENTRY_SEPARATOR)
    .map((line) => {
      const sections = line.split(FIELD_SEPARATOR);
      if (
        sections.length < 2 ||
        sections.length > 3 ||
        !sections[0] ||
        !sections[1]
      ) {
        throw new Error(`Each line must have 2 or 3 sections: "${line}"`);
      }
      if (sections[2]) {
        return {
          kanji: sections[0].trim(),
          kana: sections[1].trim(),
          definition: sections[2].trim(),
        };
      }
      return {
        kanji: sections[0].trim(),
        kana: sections[0].trim(),
        definition: sections[1].trim(),
      };
    });

  const errors = [
    {
      name: `Lines must have 2 or 3 sections separated by "${FIELD_SEPARATOR}"`,
      lines: entries.filter(
        (entry) => !entry.kanji || !entry.kana || !entry.definition,
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

        function count<T>(values: Iterable<T>): Map<T, number> {
          const counts = new Map<T, number>();
          for (const value of values) {
            counts.set(value, (counts.get(value) ?? 0) + 1);
          }
          return counts;
        }
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

        function count<T>(values: Iterable<T>): Map<T, number> {
          const counts = new Map<T, number>();
          for (const value of values) {
            counts.set(value, (counts.get(value) ?? 0) + 1);
          }
          return counts;
        }
      })(),
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
