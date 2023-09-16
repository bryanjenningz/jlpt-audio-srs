import fs from "fs/promises";

const FILE_PATHS = ["./public/jlpt5.txt", "./public/jlpt4.txt"];
const ENTRY_SEPARATOR = "\n";
const FIELD_SEPARATOR = ";";

for (const filePath of FILE_PATHS) {
  const lines = (await fs.readFile(filePath))
    .toString()
    .split(ENTRY_SEPARATOR)
    .map((line) => line.split(FIELD_SEPARATOR));

  const errors = [
    {
      name: `Lines must have 2 or 3 sections separated by "${FIELD_SEPARATOR}"`,
      lines: lines.filter((line) => !(line.length === 2 || line.length === 3)),
    },
    {
      name: `All kanji must be unique`,
      lines: (() => {
        const kanjiCounts = count(lines.map((line) => line[0]));
        return lines.filter((line) => (kanjiCounts.get(line[0]) ?? 0) > 1);

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
                .map((line) => line.join(FIELD_SEPARATOR))
                .join(ENTRY_SEPARATOR),
            ].join(":\n");
          })
          .join("\n\n"),
    );
  }
}
