/** Small helpers for the hand-drawn SVG charts. */

export interface Scale {
  /** The top of the axis, a round number at or above the data's maximum. */
  max: number;
  /** Tick values from 0 to `max`. */
  ticks: number[];
}

const tidy = (n: number) => Number.parseFloat(n.toPrecision(12));

/**
 * A y axis from 0 with about `count` round steps (1, 2, 2.5 or 5 times a power
 * of ten; whole numbers only for counts). With no data it still has a shape.
 */
export function niceScale(dataMax: number, { count = 4, integer = false }: { count?: number; integer?: boolean } = {}): Scale {
  const max = dataMax > 0 && Number.isFinite(dataMax) ? dataMax : integer ? count : 1;
  const rough = max / count;
  const power = 10 ** Math.floor(Math.log10(rough));
  const multiples = integer ? [1, 2, 5, 10] : [1, 2, 2.5, 5, 10];
  let step = (multiples.find((m) => m * power >= rough) ?? 10) * power;
  if (integer) step = Math.max(1, Math.round(step));
  const top = tidy(Math.ceil(tidy(max / step)) * step);
  const ticks: number[] = [];
  for (let value = 0; value <= top + step / 1000; value = tidy(value + step)) ticks.push(value);
  return { max: top, ticks };
}

/** A bar with rounded top corners and a square foot on the baseline, as an SVG path. */
export function barPath(x: number, y: number, width: number, height: number, radius = 3): string {
  if (!(width > 0) || !(height > 0)) return "";
  const r = Math.min(radius, width / 2, height);
  const f = (n: number) => Number(n.toFixed(2));
  return [
    `M${f(x)} ${f(y + height)}`,
    `V${f(y + r)}`,
    `A${f(r)} ${f(r)} 0 0 1 ${f(x + r)} ${f(y)}`,
    `H${f(x + width - r)}`,
    `A${f(r)} ${f(r)} 0 0 1 ${f(x + width)} ${f(y + r)}`,
    `V${f(y + height)}`,
    "Z",
  ].join("");
}

/** Every `step`-th index, always including the last, so labels never crowd. */
export function labelledIndexes(count: number, slotWidth: number, labelWidth: number): Set<number> {
  const step = Math.max(1, Math.ceil(labelWidth / Math.max(1, slotWidth)));
  const shown = new Set<number>();
  for (let i = count - 1; i >= 0; i -= step) shown.add(i);
  return shown;
}
