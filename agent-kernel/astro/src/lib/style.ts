/**
 * CSS custom properties for a style attribute: data-driven sizes such as a bar's
 * height. Returns a plain string, e.g. cssVars({ "--h": "40%" }) → "--h:40%".
 */
export function cssVars(vars: Record<`--${string}`, string | number>): string {
  return Object.entries(vars)
    .map(([name, value]) => `${name}:${value}`)
    .join(";");
}

/** A share of a whole as a CSS percentage, "37.5%". */
export function percent(value: number, of: number): string {
  if (!(of > 0) || !Number.isFinite(value)) return "0%";
  return `${Number(((value / of) * 100).toFixed(2))}%`;
}
