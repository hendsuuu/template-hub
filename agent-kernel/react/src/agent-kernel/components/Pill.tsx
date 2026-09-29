import type { ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cx } from "../lib/cx";

export type PillTone = "blue" | "green" | "red" | "orange" | "grey" | "neutral";

interface PillProps {
  tone?: PillTone;
  children: ReactNode;
  title?: string | undefined;
  className?: string | undefined;
}

/** A small tinted label, such as a count or "Needs you". */
export function Pill({ tone = "neutral", children, title, className }: PillProps) {
  return (
    <span className={cx("ak-pill", `ak-pill--${tone}`, className)} title={title}>
      {children}
    </span>
  );
}

interface DeltaPillProps {
  /** Whole percent change, or null when there is nothing to compare with. */
  change: number | null;
  /** What it is compared with, e.g. "the 7 days before". */
  against: string;
}

/** A change as "▲ 12%", spelled out for assistive tech. Neutral: more is not better or worse. */
export function DeltaPill({ change, against }: DeltaPillProps) {
  if (change === null) return null;
  const words = change === 0 ? `No change on ${against}` : `${change > 0 ? "Up" : "Down"} ${Math.abs(change)}% on ${against}`;
  const Icon = change < 0 ? ChevronDown : ChevronUp;
  return (
    <Pill title={words}>
      {change !== 0 && <Icon size={12} strokeWidth={2.5} aria-hidden="true" />}
      <span aria-hidden="true">{change === 0 ? "0%" : `${Math.abs(change)}%`}</span>
      <span className="sr-only">{words}</span>
    </Pill>
  );
}
