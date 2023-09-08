export function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function waitUntil(condition: () => boolean): Promise<void> {
  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      if (!condition()) return;
      clearTimeout(intervalId);
      resolve();
    }, 100);
  });
}

export async function playEnglish(
  english: string,
  speechSynthesis: SpeechSynthesis,
): Promise<void> {
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = `Say the following in Japanese... ${english}`;
  utterance.lang = "en-US";
  utterance.rate = 0.85;
  utterance.volume = 0.5;
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
  utterance.rate = 0.85;
  utterance.volume = 1;
  speechSynthesis.speak(utterance);
  await waitUntil(() => !speechSynthesis.speaking && !speechSynthesis.pending);
}
