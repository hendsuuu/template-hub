import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx } from "../lib/cx";
import { cssVars, percent } from "../lib/style";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  /** Quieter text after the value, e.g. "of 4". */
  suffix?: string | undefined;
  /** Orange value and marks, for a number that needs a person. */
  attention?: boolean;
  /** A small chart on the right of the value (decorative; the numbers are elsewhere too). */
  chart?: ReactNode;
  /** The line under the value: a pill and a caption. */
  meta?: ReactNode;
  /** Top right of the card, e.g. a change against the last period. */
  corner?: ReactNode;
}

/**
 * One figure: a header strip (icon and label) over a box with corner brackets
 * holding the value, a mini chart and a meta line. Render inside a <dl>.
 */
export function StatCard({ icon: Icon, label, value, suffix, attention = false, chart, meta, corner }: StatCardProps) {
  return (
    <div className={cx("ak-stat", attention && "ak-stat--attention", Boolean(corner) && "ak-stat--with-corner")}>
      <dt className="ak-stat__head">
        <span className="ak-stat__icon" aria-hidden="true">
          <Icon size={14} />
        </span>
        <span className="ak-stat__label">{label}</span>
      </dt>
      <dd className="ak-stat__body">
        {corner && <span className="ak-stat__corner">{corner}</span>}
        <div className="ak-stat__inner ak-bracketed">
          <div className="ak-stat__row">
            <span className="ak-stat__value">
              {value}
              {suffix && <span className="ak-stat__suffix"> {suffix}</span>}
            </span>
            {chart && <span className="ak-stat__chart">{chart}</span>}
          </div>
          {meta && <div className="ak-stat__meta">{meta}</div>}
        </div>
      </dd>
    </div>
  );
}

export type MiniTone = "blue" | "green" | "orange" | "red" | "grey";

export interface MiniBar {
  value: number;
  tone: MiniTone;
  /** A short description for the native tooltip, e.g. "15 Sept: 12". */
  title?: string;
}

/** A tiny bar chart. With `history`, earlier bars are quieter than the last (the current period). */
export function MiniBars({ bars, max, history = true }: { bars: readonly MiniBar[]; max?: number; history?: boolean }) {
  const top = Math.max(max ?? 0, ...bars.map((b) => b.value), 1);
  return (
    <span className={cx("ak-minibars", history && "ak-minibars--history")} aria-hidden="true">
      {bars.map((bar, index) => (
        <span
          key={index}
          className={cx("ak-minibars__bar", `ak-minibars__bar--${bar.tone}`, bar.value === 0 && "ak-minibars__bar--zero")}
          style={cssVars({ "--h": percent(bar.value, top) })}
          title={bar.title}
        />
      ))}
    </span>
  );
}
