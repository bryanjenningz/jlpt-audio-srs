export function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function waitUntil(condition: () => boolean): Promise<void> {
  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      if (!condition()) return;
      clearTimeout(intervalId);
      resolve();
    }, 100);
  });
}
