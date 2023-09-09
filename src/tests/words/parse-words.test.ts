import { describe, expect, it } from "vitest";
import { parseWords } from "~/words/parse-words";

describe("parseWords", () => {
  describe("Invalid strings", () => {
    it("Throws if given an empty string", () => {
      expect(() => parseWords("")).toThrowError(
        new Error(`Expected 2 or 3 non-empty sections for line: ""`),
      );
    });

    it("Throws if given a string with no semi-colons", () => {
      expect(() => parseWords("word,pronunciation,definition")).toThrowError(
        new Error(
          `Expected 2 or 3 non-empty sections for line: "word,pronunciation,definition"`,
        ),
      );
    });

    it("Throws if there's a newline at the end of the string", () => {
      expect(() =>
        parseWords(
          "word;pronunciation;definition\nword2;pronunciation2;definition2\n",
        ),
      ).toThrow(new Error(`Expected 2 or 3 non-empty sections for line: ""`));
    });
  });

  describe("Lines with word, pronunciation, and definition", () => {
    it("Parses a line with word, pronunciation, and definition separated by semi-colons", () => {
      expect(parseWords("word;pronunciation;definition")).toEqual([
        { type: "unseen", english: "definition", japanese: "word" },
      ]);
    });

    it("Parses 2 lines with word, pronunciation, and definition separated by semi-colons", () => {
      expect(
        parseWords(
          "word;pronunciation;definition\nword2;pronunciation2;definition2",
        ),
      ).toEqual([
        { type: "unseen", english: "definition", japanese: "word" },
        { type: "unseen", english: "definition2", japanese: "word2" },
      ]);
    });

    it("Parses 2 lines with word, pronunciation, and definition separated by semi-colons with definitions separated by commas", () => {
      expect(
        parseWords(
          "word;pronunciation;definition,definition-b\nword2;pronunciation2;definition2,definition-b,definition-c",
        ),
      ).toEqual([
        {
          type: "unseen",
          english: "definition, definition-b",
          japanese: "word",
        },
        {
          type: "unseen",
          english: "definition2, definition-b, definition-c",
          japanese: "word2",
        },
      ]);
    });
  });

  describe("Lines with word and definition", () => {
    it("Parses a line with word and definition separated by a semi-colon", () => {
      expect(parseWords("word;definition")).toEqual([
        { type: "unseen", english: "definition", japanese: "word" },
      ]);
    });

    it("Parses 2 lines with word and definition separated by a semi-colon", () => {
      expect(parseWords("word;definition\nword2;definition2")).toEqual([
        { type: "unseen", english: "definition", japanese: "word" },
        { type: "unseen", english: "definition2", japanese: "word2" },
      ]);
    });
  });
});
