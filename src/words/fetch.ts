import { type Word } from "~/words/types";

export async function fetchWords(): Promise<Word[]> {
  const response = await fetch("/jlpt5.txt");
  const text = await response.text();
  const lines = text.split("\n");
  const words = lines.map((line): Word => {
    const sections = line.split(";");
    const japanese = sections[0];
    const english = sections[sections.length - 1];
    if (sections.length < 2 || sections.length > 3 || !japanese || !english) {
      throw new Error(`Expected 2 or 3 non-empty sections for line: "${line}"`);
    }
    return { type: "unseen", japanese, english };
  });
  return words;
}
