import fs from "fs/promises";

const PITCH_ACCENT_FILE = "./src/scripts/pitch-accents.txt";

const pitchAccentLines = (await fs.readFile(PITCH_ACCENT_FILE))
  .toString()
  .split("\n")
  .map((line) => line.split("\t"));

// This code removes duplicate pitch accents
// await fs.writeFile(
//   PITCH_ACCENT_FILE,
//   pitchAccentLines
//     .map((line) => {
//       if (!line[2]) {
//         throw new Error(`Expect non-empty pitch field for: ${line.join("\t")}`);
//       }
//       return [line[0], line[1], unique(line[2].split(",")).join(",")].join(
//         "\t",
//       );
//     })
//     .join("\n"),
// );

// function unique<T>(values: T[]): T[] {
//   const seen = new Set<T>();
//   const result: T[] = [];
//   for (const value of values) {
//     if (seen.has(value)) {
//       continue;
//     }
//     seen.add(value);
//     result.push(value);
//   }
//   return result;
// }

const errors = [
  {
    name: "Lines must have 3 sections",
    lines: pitchAccentLines.filter((line) => line.length !== 3),
  },
  {
    name: "Pitch accents fields must be non-empty",
    lines: pitchAccentLines.filter((line) => !line[2]),
  },
  {
    name: "Pitch accents fields must be numbers separated by commas",
    lines: pitchAccentLines.filter(
      (line) => line[2]?.split(",").some((x) => !x || isNaN(Number(x))),
    ),
  },
  {
    name: "Pitch accents fields must have no duplicates",
    lines: pitchAccentLines.filter((line) => {
      const pitchAccents = line[2]?.split(",").map(Number) ?? [];
      return pitchAccents.length !== new Set(pitchAccents).size;
    }),
  },
].filter((category) => category.lines.length > 0);

if (errors.length > 0) {
  throw new Error(
    errors
      .map((error) => {
        return [
          error.name,
          error.lines.map((line) => line.join("\t")).join("\n"),
        ].join(":\n");
      })
      .join("\n\n"),
  );
}
