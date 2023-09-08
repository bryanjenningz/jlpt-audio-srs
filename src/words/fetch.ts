import { type Word } from "~/words/types";
import { parseWords } from "~/words/parse-words";

export async function fetchWords(): Promise<Word[]> {
  const response = await fetch("/jlpt5.txt");
  const text = await response.text();
  return parseWords(text);
}
