import fs from "fs/promises";

const pitchAccentsText = (
  await fs.readFile("./src/pitch-accents/pitch-accents.txt")
).toString();

console.log(pitchAccentsText.slice(0, 50));
