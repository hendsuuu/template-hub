import type { CSSProperties } from "react";

/** CSS custom properties for a style attribute: data-driven sizes such as a bar's height. */
export function cssVars(vars: Record<`--${string}`, string | number>): CSSProperties {
  return vars as CSSProperties;
}

/** A share of a whole as a CSS percentage, "37.5%". */
export function percent(value: number, of: number): string {
  if (!(of > 0) || !Number.isFinite(value)) return "0%";
  return `${Number(((value / of) * 100).toFixed(2))}%`;
}
