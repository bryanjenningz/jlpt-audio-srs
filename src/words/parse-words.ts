import { type Word } from "~/words/types";

export function parseWords(text: string): Word[] {
  const lines = text.split("\n");
  const words = lines.map((line, i): Word => {
    const sections = line.split(";");
    const kanji = sections[0];
    const kana = sections[1];
    const definition = sections[2]?.replace(/,/g, ", ");
    const pitchAccents = (() => {
      if (!sections[3]) return [];
      return sections[3]?.split(",").map(Number);
    })();
    if (
      sections.length !== 4 ||
      !kanji ||
      !kana ||
      !definition ||
      !pitchAccents
    ) {
      throw new Error(`Expected 4 sections for line: "${line}"`);
    }
    return {
      type: "unseen",
      kanji,
      kana,
      definition,
      pitchAccents,
      order: i + 1,
      known: false,
    };
  });
  return words;
}
