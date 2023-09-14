import fs from "fs/promises";

const pitchAccentLines = (
  await fs.readFile("./src/pitch-accents/pitch-accents.txt")
)
  .toString()
  .split("\n")
  .map((line) => line.split("\t"));

const errors = [
  {
    name: "Line doesn't have 3 sections",
    lines: pitchAccentLines.filter((line) => line.length !== 3),
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