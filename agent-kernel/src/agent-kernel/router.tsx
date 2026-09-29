"use client";

/**
 * Router adapter (Next.js App Router).
 *
 * The template's components only use what this file exports, so routing lives
 * in one place: to move the template to another router, change this file.
 */
import NextLink from "next/link";
import { usePathname as useNextPathname, useRouter, useSearchParams as useNextSearchParams } from "next/navigation";
import type { ComponentProps } from "react";

export type LinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
  /** Replace the current history entry instead of adding one. */
  replace?: boolean;
  /** Keep the scroll position (false) instead of moving to the top. */
  scroll?: boolean;
};

export function Link({ href, replace, scroll, ...rest }: LinkProps) {
  return <NextLink href={href} replace={replace} scroll={scroll} {...rest} />;
}

export function usePathname(): string {
  return useNextPathname() ?? "/";
}

/** One query parameter. On a prerendered page, render the reader inside <Suspense>. */
export function useSearchParam(name: string): string | null {
  return useNextSearchParams()?.get(name) ?? null;
}

/** Go somewhere without scrolling to the top; `replace` skips the history entry. */
export function useNavigate(): (href: string, options?: { replace?: boolean }) => void {
  const router = useRouter();
  return (href, options) => (options?.replace ? router.replace(href, { scroll: false }) : router.push(href, { scroll: false }));
}
