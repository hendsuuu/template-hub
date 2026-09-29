"use client";

import { useMemo, useState, type MouseEvent, type ReactNode } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { cx } from "../lib/cx";
import { nextSort, sortRows, type SortState, type SortValue } from "../lib/sort";

export interface Column<T> {
  key: string;
  /** The column's name: the header text, and the caption above the value in the card layout. */
  header: string;
  /** A shorter visible header (e.g. "#"); `header` stays the accessible name. */
  headerVisual?: string;
  /** `position` is the row's place in the shown order, from 1. */
  render: (row: T, position: number) => ReactNode;
  /** Makes the column sortable. */
  sortValue?: (row: T) => SortValue;
  align?: "end";
  className?: string | undefined;
  /** In the card layout: first, full width, no caption. */
  primary?: boolean;
  /** Left out of the card layout. */
  wideOnly?: boolean;
}

interface DataTableProps<T> {
  /** Says what the table lists, for assistive tech. */
  caption: string;
  columns: readonly Column<T>[];
  rows: readonly T[];
  rowKey: (row: T) => string;
  initialSort?: SortState | null;
  /** The whole row opens something; a link in the row must do the same for keyboard users. */
  onRowClick?: ((row: T) => void) | undefined;
  isRowCurrent?: ((row: T) => boolean) | undefined;
  /** Below which width rows become cards: sm 620px, md 760px, lg 1060px. */
  cards?: "sm" | "md" | "lg";
  /** Denser rows, for compact lists. */
  compact?: boolean;
}

const ARIA_SORT = { asc: "ascending", desc: "descending" } as const;

/**
 * A table with quiet headers, a sort control per sortable column and tabular
 * figures. Where it has too little room, each row is laid out as a card
 * instead (a container query), so the page never scrolls sideways.
 */
export function DataTable<T>({
  caption,
  columns,
  rows,
  rowKey,
  initialSort = null,
  onRowClick,
  isRowCurrent,
  cards = "md",
  compact = false,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState | null>(initialSort);

  const shown = useMemo(() => {
    const column = sort ? columns.find((c) => c.key === sort.key) : undefined;
    return sort && column?.sortValue ? sortRows(rows, column.sortValue, sort.direction) : [...rows];
  }, [rows, columns, sort]);

  const sortedColumn = sort ? columns.find((c) => c.key === sort.key) : undefined;
  const onClick = (event: MouseEvent<HTMLTableRowElement>, row: T) => {
    if (!onRowClick || (event.target as Element).closest("a, button, input, select, label")) return;
    onRowClick(row);
  };

  return (
    <div className={cx("ak-table-wrap", `ak-table-wrap--cards-${cards}`)}>
      <table className={cx("ak-table", compact && "ak-table--compact")}>
        <caption className="sr-only">
          {caption}
          {sort && sortedColumn ? `, sorted by ${sortedColumn.header.toLowerCase()}, ${ARIA_SORT[sort.direction]}` : ""}
        </caption>
        <thead>
          <tr>
            {columns.map((column) => {
              const active = sort?.key === column.key;
              const label = column.headerVisual ? (
                <>
                  <span aria-hidden="true">{column.headerVisual}</span>
                  <span className="sr-only">{column.header}</span>
                </>
              ) : (
                column.header
              );
              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={active && sort ? ARIA_SORT[sort.direction] : undefined}
                  className={cx(column.align === "end" && "is-end", column.className)}
                >
                  {column.sortValue ? (
                    <button type="button" className="ak-sort" onClick={() => setSort(nextSort(sort, column.key))}>
                      {label}
                      <ChevronsUpDown size={12} aria-hidden="true" className="ak-sort__icon ak-sort__icon--none" />
                      <ChevronUp size={12} aria-hidden="true" className="ak-sort__icon ak-sort__icon--asc" />
                      <ChevronDown size={12} aria-hidden="true" className="ak-sort__icon ak-sort__icon--desc" />
                    </button>
                  ) : (
                    label
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {shown.map((row, index) => (
            <tr
              key={rowKey(row)}
              className={cx(onRowClick && "ak-row--clickable")}
              aria-current={isRowCurrent?.(row) ? "true" : undefined}
              onClick={(event) => onClick(event, row)}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  data-label={column.primary ? undefined : column.header}
                  className={cx(column.align === "end" && "is-end", column.primary && "is-primary", column.wideOnly && "is-wide-only", column.className)}
                >
                  {column.render(row, index + 1)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
