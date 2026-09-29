import type { DailyActivity } from "../../types";
import { cx } from "../../lib/cx";
import { formatDay } from "../../lib/format";
import { cssVars, percent } from "../../lib/style";

interface DayHistogramProps {
  days: readonly DailyActivity[];
  /** The most recent days drawn bright: the period the panel is about. */
  highlightLast: number;
}

/** Jobs finished per day as thin columns with a soft fade and a faint track behind each. */
export function DayHistogram({ days, highlightLast }: DayHistogramProps) {
  const totals = days.map((d) => d.completed + d.failed);
  const max = Math.max(1, ...totals);
  const first = days[0];
  const last = days[days.length - 1];
  const period = days.slice(-highlightLast).reduce((sum, d) => sum + d.completed + d.failed, 0);

  return (
    <figure>
      <div className="ak-histogram__plot" aria-hidden="true">
        {days.map((day, index) => {
          const total = totals[index] ?? 0;
          return (
            <span
              key={day.day}
              className={cx("ak-histogram__col", index < days.length - highlightLast && "ak-histogram__col--dim")}
              title={`${formatDay(day.day)}: ${total} finished`}
            >
              <span className="ak-histogram__track">{total > 0 && <span className="ak-histogram__bar" style={cssVars({ "--h": percent(total, max) })} />}</span>
            </span>
          );
        })}
      </div>
      <figcaption className="ak-histogram__caption">
        <span>{first ? formatDay(first.day) : ""}</span>
        <span className="ak-histogram__legend">
          <span className="ak-histogram__swatch" aria-hidden="true" />
          Finished, last {highlightLast} days: {period}
        </span>
        <span>{last ? formatDay(last.day) : ""}</span>
      </figcaption>
    </figure>
  );
}
