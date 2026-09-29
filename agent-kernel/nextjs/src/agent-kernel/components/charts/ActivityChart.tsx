import type { DailyActivity } from "../../types";
import { niceScale } from "../../lib/chart";
import { cx } from "../../lib/cx";
import { formatDay, formatDayLong, formatUsd, formatUsdTick } from "../../lib/format";
import { cssVars, percent } from "../../lib/style";

export type ActivityMode = "jobs" | "spend";

/** About how wide one character of an axis label is, for the space left of the plot. */
const CHAR = 6.6;

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

/** One day in words, for assistive tech. */
function describeDay(day: DailyActivity): string {
  return `${formatDayLong(day.day)}: ${day.completed} completed, ${day.failed} failed, ${plural(day.needsInput, "job", "jobs")} needed a person, ${formatUsd(day.spentUsd)} spent.`;
}

/**
 * Fourteen days as columns: completed (green) with failed (red) stacked on top
 * and a ring above for jobs that needed a person; or spend (blue). Built from
 * HTML so it renders the same in every framework: hover or focus a day to read
 * its numbers.
 */
export function ActivityChart({ days, mode }: { days: readonly DailyActivity[]; mode: ActivityMode }) {
  const values = days.map((d) => (mode === "jobs" ? d.completed + d.failed : d.spentUsd));
  const scale = niceScale(Math.max(0, ...values), { integer: mode === "jobs" });
  const tickText = scale.ticks.map((t) => (mode === "jobs" ? String(t) : formatUsdTick(t)));
  const axis = Math.ceil(Math.max(...tickText.map((t) => t.length)) * CHAR) + 12;
  const empty = values.every((v) => v === 0);

  return (
    <div
      className="ak-chart"
      data-ak-mode={mode}
      role="group"
      aria-label={mode === "jobs" ? "Jobs per day, last 14 days" : "Spend per day, last 14 days"}
      style={cssVars({ "--ak-axis": `${axis}px` })}
    >
      <div className="ak-chart__plot">
        <div className="ak-chart__grid" aria-hidden="true">
          {scale.ticks.map((tick, index) => (
            <div key={tick} className="ak-chart__gridline" style={cssVars({ "--y": percent(tick, scale.max) })}>
              <span className="ak-chart__tick">{tickText[index]}</span>
            </div>
          ))}
        </div>

        <ol className="ak-chart__days">
          {days.map((day, index) => {
            const total = day.completed + day.failed;
            return (
              <li key={day.day} className="ak-chart__day" tabIndex={0} aria-label={describeDay(day)}>
                <span className="ak-chart__stack" aria-hidden="true">
                  {mode === "jobs" ? (
                    total === 0 ? (
                      <span className="ak-chart__bar ak-chart__bar--zero" />
                    ) : (
                      <>
                        {day.completed > 0 && (
                          <span className="ak-chart__bar ak-chart__bar--completed" style={cssVars({ "--h": percent(day.completed, scale.max) })} />
                        )}
                        {day.failed > 0 && <span className="ak-chart__bar ak-chart__bar--failed" style={cssVars({ "--h": percent(day.failed, scale.max) })} />}
                      </>
                    )
                  ) : day.spentUsd > 0 ? (
                    <span className="ak-chart__bar ak-chart__bar--spend" style={cssVars({ "--h": percent(day.spentUsd, scale.max) })} />
                  ) : (
                    <span className="ak-chart__bar ak-chart__bar--zero" />
                  )}
                </span>
                {mode === "jobs" && day.needsInput > 0 && (
                  <span className="ak-chart__marker" aria-hidden="true" style={cssVars({ "--h": percent(total, scale.max) })} />
                )}
                <span className="ak-chart__label" aria-hidden="true">
                  {formatDay(day.day)}
                </span>
                <DayTooltip day={day} side={index < days.length / 2 ? "right" : "left"} />
              </li>
            );
          })}
        </ol>
        {empty && <p className="ak-chart__empty">No activity in the last 14 days.</p>}
      </div>
      <div className="ak-chart__axis-space" aria-hidden="true" />
    </div>
  );
}

function DayTooltip({ day, side }: { day: DailyActivity; side: "left" | "right" }) {
  return (
    <div className={cx("ak-chart__tooltip", `ak-chart__tooltip--${side}`)} aria-hidden="true">
      <p className="ak-tooltip__day">{formatDayLong(day.day)}</p>
      <dl className="ak-tooltip__rows">
        <TooltipRow tone="green" label="Completed" value={String(day.completed)} />
        <TooltipRow tone="red" label="Failed" value={String(day.failed)} />
        <TooltipRow tone="ring" label="Needed a person" value={String(day.needsInput)} />
        <TooltipRow tone="blue" label="Spent" value={formatUsd(day.spentUsd)} />
      </dl>
    </div>
  );
}

function TooltipRow({ tone, label, value }: { tone: "green" | "red" | "ring" | "blue"; label: string; value: string }) {
  return (
    <div className="ak-tooltip__row">
      <dt>
        <span className={cx("ak-key", `ak-key--${tone}`)} />
        {label}
      </dt>
      <dd>{value}</dd>
    </div>
  );
}

/** The same numbers as a table, for screen readers (a hidden block, so it never widens a phone page). */
export function ActivityTable({ days }: { days: readonly DailyActivity[] }) {
  return (
    <div className="sr-only">
      <table>
        <caption>Activity by day, last 14 days (UTC)</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Completed</th>
            <th scope="col">Failed</th>
            <th scope="col">Needed a person</th>
            <th scope="col">Spent</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day.day}>
              <th scope="row">{formatDayLong(day.day)}</th>
              <td>{day.completed}</td>
              <td>{day.failed}</td>
              <td>{day.needsInput}</td>
              <td>{formatUsd(day.spentUsd)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
