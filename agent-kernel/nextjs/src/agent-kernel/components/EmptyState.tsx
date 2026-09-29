import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { TriangleAlert } from "lucide-react";
import { cx } from "../lib/cx";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  text?: string | undefined;
  /** Inside a panel: no frame of its own. */
  bare?: boolean;
  children?: ReactNode;
}

/** A calm placeholder where a list has nothing to show. */
export function EmptyState({ icon: Icon, title, text, bare = false, children }: EmptyStateProps) {
  return (
    <div className={cx("ak-empty", bare && "ak-empty--bare")}>
      <span className="ak-empty__icon" aria-hidden="true">
        <Icon size={18} />
      </span>
      <p className="ak-empty__title">{title}</p>
      {text && <p className="ak-empty__text">{text}</p>}
      {children}
    </div>
  );
}

/** A non-blocking notice. Render it inside an aria-live region so it is announced. */
export function ErrorBanner({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="ak-banner">
      <TriangleAlert size={18} aria-hidden="true" />
      <p className="flex-[1_1_220px]">{children}</p>
      {action}
    </div>
  );
}
