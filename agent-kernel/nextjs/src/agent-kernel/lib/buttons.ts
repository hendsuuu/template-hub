import { cx } from "./cx";

/** primary: orange, the one main action · secondary: outlined · quiet: text only · danger: stops work. */
export type ButtonVariant = "primary" | "secondary" | "quiet" | "danger";

/** Class names for a button look, also used on links that act as buttons. */
export function buttonClass(variant: ButtonVariant = "primary", size: "md" | "sm" = "md"): string {
  return cx("ak-btn", `ak-btn--${variant}`, size === "sm" && "ak-btn--sm");
}
