import { useId, type ReactNode } from "react";
import { CalendarDays } from "lucide-react";
import { cx } from "../lib/cx";

interface PanelProps {
  title: string;
  subtitle?: ReactNode;
  /** Controls on the right of the header: icon buttons, search, selects. */
  actions?: ReactNode;
  /** Content that runs edge to edge, such as a table. */
  flush?: boolean;
  /** Small controls that stay on the title row on phones. */
  inlineActions?: boolean;
  className?: string | undefined;
  /** Anything that must sit before the header, such as the radios a panel reads with :has(). */
  before?: ReactNode;
  children: ReactNode;
}

/** A titled section: a header row (title, subtitle, controls) over its content. */
export function Panel({ title, subtitle, actions, flush = false, inlineActions = false, className, before, children }: PanelProps) {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className={cx("ak-panel", inlineActions && "ak-panel--inline", className)}>
      {before}
      <header className="ak-panel__head">
        <div className="ak-panel__heading">
          <h2 id={titleId} className="ak-panel__title">
            {title}
          </h2>
          {subtitle && <p className="ak-panel__subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="ak-panel__actions">{actions}</div>}
      </header>
      <div className={flush ? "ak-panel__flush" : "ak-panel__body"}>{children}</div>
    </section>
  );
}

interface PageHeaderProps {
  /** A large greeting or page line; the page's h1 is the top bar title. */
  title: string;
  subtitle: string;
  /** Right-hand side: a period chip or page controls. */
  aside?: ReactNode;
}

/** "Welcome back, Alex" and a one-line subtitle, with room on the right. */
export function PageHeader({ title, subtitle, aside }: PageHeaderProps) {
  return (
    <div className="ak-page-header">
      <div className="ak-page-header__text">
        <p className="ak-page-header__title">{title}</p>
        <p className="ak-page-header__subtitle">{subtitle}</p>
      </div>
      {aside && <div className="ak-page-header__aside">{aside}</div>}
    </div>
  );
}

/** A small read-only chip naming the period a page covers, e.g. "Last 14 days". */
export function PeriodChip({ children }: { children: ReactNode }) {
  return (
    <span className="ak-period">
      <CalendarDays size={14} aria-hidden="true" />
      {children}
    </span>
  );
}
