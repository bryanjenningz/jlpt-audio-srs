import { z } from "zod";

export type UnseenWord = z.infer<typeof unseenWordSchema>;
export type SeenWord = z.infer<typeof seenWordSchema>;
export type Word = z.infer<typeof wordSchema>;

const unseenWordSchema = z.object({
  type: z.literal("unseen"),
  kanji: z.string(),
  kana: z.string(),
  definition: z.string(),
  order: z.number(),
  known: z.boolean(),
});

const seenWordSchema = z.object({
  type: z.literal("seen"),
  kanji: z.string(),
  kana: z.string(),
  definition: z.string(),
  order: z.number(),
  known: z.boolean(),
  lastSeen: z.number(),
  seenCount: z.number(),
});

const wordSchema = z.union([unseenWordSchema, seenWordSchema]);

export const wordsSchema = z.array(wordSchema);
