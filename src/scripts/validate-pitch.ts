import fs from "fs/promises";

const PITCH_ACCENT_FILE = "./src/scripts/pitch-accents.txt";

const pitchAccentLines = (await fs.readFile(PITCH_ACCENT_FILE))
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

const JLPT_TEXT_FILES = [1, 2, 3, 4, 5].map((n) => `./public/jlpt${n}.txt`);
const ENTRY_SEPARATOR = "\n";
const FIELD_SEPARATOR = ";";

for (const file of JLPT_TEXT_FILES) {
  const entries = (await fs.readFile(file))
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

  const pitchAccentEntries = pitchAccentLines.map((line) => {
    if (line.length !== 3 || !line[0] || !line[1] || !line[2]) {
      throw new Error("Expected line to have 3 sections");
    }
    const pitchAccents = line[2].split(",").map((pitchAccent) => {
      if (!pitchAccent.match(/^\d+$/) || Number.isNaN(pitchAccent)) {
        throw new Error("Expected pitch accent to only have digits");
      }
      return Number(pitchAccent);
    });
    return {
      kanji: line[0],
      kana: line[1],
      pitchAccents,
    };
  });

  const kanjiKanaPitchAccents: Record<string, Record<string, number[]>> = {};
  for (const pitchAccentEntry of pitchAccentEntries) {
    const { kanji, kana, pitchAccents } = pitchAccentEntry;
    const kanaPitchAccents = kanjiKanaPitchAccents[kanji] ?? {};
    if (kanaPitchAccents[kana]) {
      throw new Error(
        "Expect unique kanji/kana pairs for pitch accent entries",
      );
    }
    kanaPitchAccents[kana] = pitchAccents;
    kanjiKanaPitchAccents[kanji] = kanaPitchAccents;
  }

  const entriesWithPitchAccents = entries.map((entry) => {
    const { kanji, kana } = entry;
    return {
      ...entry,
      pitchAccents: kanjiKanaPitchAccents[kanji]?.[kana] ?? [],
    };
  });

  const entriesWithoutPitchAccents = entriesWithPitchAccents.filter(
    (entry) => entry.pitchAccents.length === 0,
  );

  // console.log("Entries without pitch accents", entriesWithoutPitchAccents);
  console.log(
    `Total without pitch accents (${file}):`,
    `${entriesWithoutPitchAccents.length} / ${entries.length} (${Math.round(
      (entriesWithoutPitchAccents.length / entries.length) * 100,
    )}%)`,
  );
}
