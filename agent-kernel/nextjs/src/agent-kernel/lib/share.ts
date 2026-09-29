/** Part-to-whole rows for the "Work by agent" breakdown. */

export interface ShareInput {
  key: string;
  count: number;
}

export interface Share {
  key: string;
  count: number;
  /** Whole percentages that add up to 100. */
  percent: number;
  /** True for the row that folds the smallest shares together. */
  other: boolean;
}

/** Named rows before the rest fold into one "more" row. */
export const NAMED_SHARES = 5;

/** Whole percentages that add up to exactly 100 (largest remainder). */
export function wholePercents(counts: readonly number[]): number[] {
  const total = counts.reduce((sum, n) => sum + n, 0);
  if (total <= 0) return counts.map(() => 0);
  const exact = counts.map((n) => (n / total) * 100);
  const floors = exact.map(Math.floor);
  let left = 100 - floors.reduce((sum, n) => sum + n, 0);
  const byRemainder = exact
    .map((value, index) => ({ index, rest: value - Math.floor(value) }))
    .sort((a, b) => b.rest - a.rest || a.index - b.index);
  for (const { index } of byRemainder) {
    if (left <= 0) break;
    floors[index] = (floors[index] ?? 0) + 1;
    left -= 1;
  }
  return floors;
}

/**
 * The largest shares first; past `NAMED_SHARES + 1` rows, everything after the
 * fifth folds into one "more" row so the list stays short.
 */
export function shareRows(items: readonly ShareInput[]): Share[] {
  const sorted = items.filter((item) => item.count > 0).sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
  const named = sorted.length > NAMED_SHARES + 1 ? sorted.slice(0, NAMED_SHARES) : sorted;
  const rest = sorted.slice(named.length);
  const rows: Array<Omit<Share, "percent">> = named.map((item) => ({ key: item.key, count: item.count, other: false }));
  if (rest.length > 0) {
    rows.push({ key: `${rest.length} more`, count: rest.reduce((sum, item) => sum + item.count, 0), other: true });
  }
  const percents = wholePercents(rows.map((row) => row.count));
  return rows.map((row, index) => ({ ...row, percent: percents[index] ?? 0 }));
}
