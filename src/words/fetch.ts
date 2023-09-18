import { type Word } from "~/words/types";
import { parseWords } from "~/words/parse-words";
import { type Level } from "~/utils/levels";

export async function fetchWords(level: Level): Promise<Word[]> {
  const response = await fetch(`/jlpt${level}.txt`);
  const text = await response.text();
  return parseWords(text);
}
