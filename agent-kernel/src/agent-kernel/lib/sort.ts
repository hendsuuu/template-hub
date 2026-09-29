/** Client-side sorting for tables. */

export type SortValue = string | number | null;
export type SortDirection = "asc" | "desc";

export interface SortState {
  key: string;
  direction: SortDirection;
}

const collator = new Intl.Collator("en-GB", { numeric: true, sensitivity: "base" });

/** Compares two cell values; empty values always go last, whichever the direction. */
export function compareValues(a: SortValue, b: SortValue, direction: SortDirection): number {
  if (a === null || b === null) return a === b ? 0 : a === null ? 1 : -1;
  const order = typeof a === "number" && typeof b === "number" ? a - b : collator.compare(String(a), String(b));
  return direction === "asc" ? order : -order;
}

/** A sorted copy; rows that compare equal keep their order. */
export function sortRows<T>(rows: readonly T[], value: (row: T) => SortValue, direction: SortDirection): T[] {
  return rows
    .map((row, index) => ({ row, index, key: value(row) }))
    .sort((a, b) => compareValues(a.key, b.key, direction) || a.index - b.index)
    .map((entry) => entry.row);
}

/** Clicking a header: a new column sorts ascending, the same column flips. */
export function nextSort(current: SortState | null, key: string): SortState {
  if (current?.key === key) return { key, direction: current.direction === "asc" ? "desc" : "asc" };
  return { key, direction: "asc" };
}

/** Time values sort as numbers; missing or unreadable ones go last. */
export function timeValue(iso: string | null): number | null {
  if (!iso) return null;
  const time = new Date(iso).getTime();
  return Number.isNaN(time) ? null : time;
}
