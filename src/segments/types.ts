export type Segment =
  | { type: "speech"; text: string; language: Language }
  | { type: "wait"; milliseconds: number };

type Language = "en-US" | "ja-JP";
