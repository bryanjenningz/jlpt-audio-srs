import fs from "fs/promises";

const FILE_PATH = "./public/jlpt4.txt";

const output = (await fs.readFile(FILE_PATH))
  .toString()
  .split("\n")
  .map((line) => {
    const [kanji, kana, ...definitionsSplit] = line.split(" ");
    const definition = definitionsSplit.join(" ");
    if (kana?.match(/[a-zA-Z]/)) {
      return [kanji, kana + " " + definition].join(";");
    }
    return [kanji, kana, definition].join(";");
  })
  .join("\n");

await fs.writeFile(FILE_PATH, output);
