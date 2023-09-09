import { type Word } from "~/words/types";

export function parseWords(text: string): Word[] {
  const lines = text.split("\n");
  const words = lines.map((line): Word => {
    const sections = line.split(";");
    const kanji = sections[0];
    const definition = sections[sections.length - 1]?.replace(/,/g, ", ");
    if (sections.length < 2 || sections.length > 3 || !kanji || !definition) {
      throw new Error(`Expected 2 or 3 non-empty sections for line: "${line}"`);
    }
    const kana = sections.length === 3 && sections[1] ? sections[1] : kanji;
    return {
      type: "unseen",
      kanji,
      kana,
      definition,
    };
  });
  return words;
}
