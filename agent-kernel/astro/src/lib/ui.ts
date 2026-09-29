/** Prop types the components share with the pages that use them. */

/** primary: orange, the one main action · secondary: outlined · quiet: text only · danger: stops work. */
export type ButtonVariant = "primary" | "secondary" | "quiet" | "danger";

export type ButtonSize = "md" | "sm";

export type PillTone = "blue" | "green" | "red" | "orange" | "grey" | "neutral";

export type MiniTone = "blue" | "green" | "orange" | "red" | "grey";

export interface MiniBar {
  value: number;
  tone: MiniTone;
  /** A short description for the native tooltip, e.g. "15 Sept: 12". */
  title?: string;
}

export interface Chip {
  value: string;
  label: string;
  count: number;
}

/** A readable, stable id from a label, e.g. ("Search agents", "search") → "search-search-agents". */
export function idFrom(text: string, prefix: string): string {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${prefix}-${slug || "field"}`;
}
