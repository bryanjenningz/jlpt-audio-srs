import { type Word } from "~/words/types";
import { parseWords } from "~/words/parse-words";

export async function fetchWords(level: 4 | 5): Promise<Word[]> {
  const response = await fetch(`/jlpt${level}.txt`);
  const text = await response.text();
  return parseWords(text);
}
