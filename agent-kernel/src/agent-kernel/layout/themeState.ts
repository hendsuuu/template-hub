/**
 * The colour theme lives on <html data-theme="dark" | "light">, so the design
 * tokens switch before any framework code runs. Dark is the default.
 */
export type Theme = "dark" | "light";

export const THEME_KEY = "theme";

/** Inline this in <head>: it applies the saved theme before the first paint. */
export const THEME_SCRIPT = `try{document.documentElement.dataset.theme=localStorage.getItem("${THEME_KEY}")==="light"?"light":"dark"}catch(e){}`;

/** For useSyncExternalStore: calls back whenever the theme changes. */
export function subscribeTheme(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

export function getTheme(): Theme {
  return typeof document !== "undefined" && document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

/** Switches the theme and remembers it. Transitions pause for the switch, so colours change at once. */
export function setTheme(theme: Theme): void {
  const pause = document.createElement("style");
  pause.textContent = "*,*::before,*::after{transition:none!important}";
  document.head.append(pause);
  document.documentElement.dataset.theme = theme;
  // Reading a computed style applies the new colours while transitions are still off.
  void window.getComputedStyle(document.body).color;
  window.setTimeout(() => pause.remove(), 1);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Private windows and blocked storage: the choice lasts until the page closes.
  }
}
