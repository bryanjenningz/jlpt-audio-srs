import fs from "fs/promises";

const pitchAccentLines = (
  await fs.readFile("./src/pitch-accents/pitch-accents.txt")
)
  .toString()
  .split("\n")
  .map((line) => line.split("\t"));

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
