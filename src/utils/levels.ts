import { useRouter } from "next/router";
import { z } from "zod";

export type Level = z.infer<typeof levelSchema>;

export const levels: readonly Level[] = [5, 4, 3];

const levelSchema = z.union([z.literal(5), z.literal(4), z.literal(3)]);

export function useLevel(): Level {
  const router = useRouter();
  const parsedLevel = levelSchema.safeParse(Number(router.query.level));
  const level = parsedLevel.success ? parsedLevel.data : 5;
  return level;
}
