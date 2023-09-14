import { waitUntil } from "~/utils/wait";

export async function playEnglish(
  english: string,
  speechSynthesis: SpeechSynthesis,
): Promise<void> {
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = english;
  utterance.lang = "en-US";
  utterance.rate = 0.8;
  utterance.volume = 0.7;
  speechSynthesis.speak(utterance);
  await waitUntil(() => !speechSynthesis.speaking && !speechSynthesis.pending);
}

export async function playJapanese(
  japanese: string,
  speechSynthesis: SpeechSynthesis,
): Promise<void> {
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = japanese;
  utterance.lang = "ja-JP";
  utterance.rate = 0.6;
  utterance.volume = 1;
  speechSynthesis.speak(utterance);
  await waitUntil(() => !speechSynthesis.speaking && !speechSynthesis.pending);
}
