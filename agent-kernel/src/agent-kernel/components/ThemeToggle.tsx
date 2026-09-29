"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { getTheme, setTheme, subscribeTheme, type Theme } from "../layout/themeState";
import { IconButton } from "./Button";

/** The server cannot know the saved theme, so it renders the default; the button corrects itself on hydration. */
const serverTheme = (): Theme => "dark";

/** Switches between the dark and light themes. Its icon shows the theme it switches to. */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, serverTheme);
  const next: Theme = theme === "dark" ? "light" : "dark";
  return (
    <IconButton
      label={next === "light" ? "Switch to the light theme" : "Switch to the dark theme"}
      icon={next === "light" ? Sun : Moon}
      className={className}
      onClick={() => setTheme(next)}
    />
  );
}
