import type { ButtonHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { buttonClass, type ButtonVariant } from "../lib/buttons";
import { cx } from "../lib/cx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "md" | "sm";
}

export function Button({ variant = "primary", size = "md", className, type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={cx(buttonClass(variant, size), className)} {...rest} />;
}

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Says what it does; it is the button's only text. */
  label: string;
  icon: LucideIcon;
}

/** A small square button with only an icon. */
export function IconButton({ label, icon: Icon, className, type = "button", ...rest }: IconButtonProps) {
  return (
    <button type={type} className={cx("ak-icon-btn", className)} aria-label={label} title={label} {...rest}>
      <Icon size={16} aria-hidden="true" />
    </button>
  );
}
