/**
 * The sidebar's collapsed state lives on <html data-ak-sidebar="collapsed">,
 * so the stylesheet can size the shell before any framework code runs.
 */
export const SIDEBAR_KEY = "ak:sidebar";

/** Inline this in <head> (or before the shell): it restores the choice before the first paint. */
export const SIDEBAR_SCRIPT = `try{if(localStorage.getItem("${SIDEBAR_KEY}")==="collapsed")document.documentElement.dataset.akSidebar="collapsed"}catch(e){}`;

/** For useSyncExternalStore: calls back whenever the collapsed state changes. */
export function subscribeSidebar(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-ak-sidebar"] });
  return () => observer.disconnect();
}

export function isSidebarCollapsed(): boolean {
  return typeof document !== "undefined" && document.documentElement.dataset.akSidebar === "collapsed";
}

export function setSidebarCollapsed(collapsed: boolean): void {
  const root = document.documentElement;
  if (collapsed) root.dataset.akSidebar = "collapsed";
  else delete root.dataset.akSidebar;
  try {
    localStorage.setItem(SIDEBAR_KEY, collapsed ? "collapsed" : "expanded");
  } catch {
    // Private windows and blocked storage: the choice lasts until the page closes.
  }
}
