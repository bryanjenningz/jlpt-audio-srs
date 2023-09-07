import { z } from "zod";

export type Word = z.infer<typeof wordSchema>;

const wordSchema = z.object({
  japanese: z.string(),
  english: z.string(),
  lastSeen: z.optional(z.number()),
  seenCount: z.optional(z.number()),
});

export const wordsSchema = z.array(wordSchema);
