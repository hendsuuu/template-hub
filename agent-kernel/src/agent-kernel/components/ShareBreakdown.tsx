import type { AgentShare } from "../types";
import { cx } from "../lib/cx";
import { shareRows } from "../lib/share";
import { cssVars } from "../lib/style";
import { paths } from "../paths";
import { Link } from "../router";

interface ShareBreakdownProps {
  items: readonly AgentShare[];
  /** Each agent's role, for the sub-label. */
  roles: Readonly<Record<string, string>>;
}

const percentText = (percent: number) => (percent === 0 ? "<1%" : `${percent}%`);

/**
 * Each agent's share of the work: a list with name, role, count and share,
 * each row with one neutral meter. The share is a size, not a status, so it
 * takes no status colour; the names carry identity.
 */
export function ShareBreakdown({ items, roles }: ShareBreakdownProps) {
  const rows = shareRows(items.map((item) => ({ key: item.agentId, count: item.jobs })));
  if (rows.length === 0) return <p className="ak-none">No agent started a job in the last 7 days.</p>;
  const largest = Math.max(...rows.map((row) => row.percent), 1);

  return (
    <ul className="ak-shares">
      {rows.map((row) => {
        const content = (
          <>
            <span className="ak-share__name">{row.other ? `${row.key} agents` : row.key}</span>
            <span className="ak-share__sub">{row.other ? "combined" : (roles[row.key] ?? "")}</span>
            <span className="ak-share__count">{row.count === 1 ? "1 job" : `${row.count} jobs`}</span>
            <span className="ak-share__percent">{percentText(row.percent)}</span>
            <span className="ak-share__meter" aria-hidden="true">
              <span style={cssVars({ "--w": `${(row.percent / largest) * 100}%` })} />
            </span>
          </>
        );
        return (
          <li key={row.key}>
            {row.other ? (
              <div className={cx("ak-share", "ak-share--other")}>{content}</div>
            ) : (
              <Link href={paths.board(row.key)} className="ak-share">
                {content}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
