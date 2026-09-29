/**
 * Router adapter (React Router).
 *
 * The template's components only use what this file exports, so the same
 * components run on Next.js and on React Router: each starter keeps its own
 * copy of this one file.
 */
/* oxlint-disable react/only-export-components -- an adapter: a component and the hooks that go with it */
import type { ComponentProps } from "react";
import { Link as RouterLink, useLocation, useNavigate as useRouterNavigate, useSearchParams } from "react-router";

export type LinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
  /** Replace the current history entry instead of adding one. */
  replace?: boolean;
  /** Keep the scroll position (false) instead of moving to the top. */
  scroll?: boolean;
};

export function Link({ href, replace, scroll: _scroll, ...rest }: LinkProps) {
  return <RouterLink to={href} replace={replace} {...rest} />;
}

export function usePathname(): string {
  return useLocation().pathname;
}

export function useSearchParam(name: string): string | null {
  const [params] = useSearchParams();
  return params.get(name);
}

/** Go somewhere; `replace` skips the history entry. */
export function useNavigate(): (href: string, options?: { replace?: boolean }) => void {
  const navigate = useRouterNavigate();
  return (href, options) => void navigate(href, { replace: options?.replace });
}
