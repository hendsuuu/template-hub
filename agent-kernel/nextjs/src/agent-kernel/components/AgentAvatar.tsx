import { Bot } from "lucide-react";
import { cx } from "../lib/cx";

/** An agent's picture: the robot on a small tile. Swap in your own images here. */
export function AgentAvatar({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <span className={cx("ak-agent-avatar", size === "sm" && "ak-agent-avatar--sm")} aria-hidden="true">
      <Bot size={size === "sm" ? 14 : 16} />
    </span>
  );
}
