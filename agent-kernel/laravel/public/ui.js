/*
 * Agent hub template: the behaviour a page needs without a framework
 * (Astro, Laravel Blade, plain HTML). React and Next.js use their own state
 * instead. Load it once, e.g. <script src="/ui.js" defer></script>.
 *
 * Everything is wired with data attributes:
 *
 *   [data-ak-sidebar-toggle]            collapses or expands the sidebar; kept in localStorage
 *   table[data-ak-sortable]             its .ak-sort header buttons sort the rows; a cell's
 *                                       data-sort-value is used when present, else its text;
 *                                       cells marked data-ak-position are renumbered
 *   tr[data-href]                       the whole row opens that address
 *   [data-ak-search="#table"]           a search box: rows whose data-search holds every word
 *   [data-ak-filter="name"]             a select filtering rows by data-<name>; needs
 *                                       data-ak-filter-target="#table"
 *   .ak-chips[data-ak-filter="name"]    the same as a row of chips (buttons with data-value)
 *   [data-ak-empty-for="#table"]        shown when a filter leaves the table with no rows
 *   button.ak-switch[role=switch]       flips aria-checked, unless it has data-ak-dialog-open
 *   [data-ak-dialog-open="#dialog"]     opens a <dialog> as a modal
 *   [data-ak-dialog-close]              closes the dialog it is in
 *   [data-ak-notice="text"]             with data-ak-notice-target="#el": writes text there
 *   dialog[data-ak-autoshow]            opens as a modal on load; closing it goes to
 *                                       data-ak-close-href when set
 *   select[data-ak-navigate]            goes to the chosen option's data-href
 */
(() => {
  const SIDEBAR_KEY = "ak:sidebar";
  const root = document.documentElement;

  // ---- Sidebar collapse ----------------------------------------------------
  const syncToggles = () => {
    const collapsed = root.dataset.akSidebar === "collapsed";
    for (const toggle of document.querySelectorAll("[data-ak-sidebar-toggle]")) {
      const label = collapsed ? "Expand the sidebar" : "Collapse the sidebar";
      toggle.setAttribute("aria-pressed", String(collapsed));
      toggle.setAttribute("aria-label", label);
      toggle.setAttribute("title", label);
    }
  };

  const toggleSidebar = () => {
    const collapse = root.dataset.akSidebar !== "collapsed";
    if (collapse) root.dataset.akSidebar = "collapsed";
    else delete root.dataset.akSidebar;
    try {
      localStorage.setItem(SIDEBAR_KEY, collapse ? "collapsed" : "expanded");
    } catch {
      // Blocked storage: the choice lasts until the page closes.
    }
    syncToggles();
  };

  // ---- Sorting -------------------------------------------------------------
  const collator = new Intl.Collator("en-GB", { numeric: true, sensitivity: "base" });

  const cellValue = (row, index) => {
    const cell = row.cells[index];
    if (!cell) return null;
    const raw = cell.dataset.sortValue ?? cell.textContent.trim();
    if (raw === "") return null;
    const number = Number(raw);
    return Number.isFinite(number) && /^-?[\d.]+$/.test(raw) ? number : raw;
  };

  const compare = (a, b, direction) => {
    if (a === null || b === null) return a === b ? 0 : a === null ? 1 : -1;
    const order = typeof a === "number" && typeof b === "number" ? a - b : collator.compare(String(a), String(b));
    return direction === "ascending" ? order : -order;
  };

  const sortBy = (button) => {
    const th = button.closest("th");
    const table = button.closest("table");
    if (!th || !table?.tBodies[0]) return;
    const index = [...th.parentElement.children].indexOf(th);
    const direction = th.getAttribute("aria-sort") === "ascending" ? "descending" : "ascending";
    for (const other of th.parentElement.children) other.removeAttribute("aria-sort");
    th.setAttribute("aria-sort", direction);
    const body = table.tBodies[0];
    const rows = [...body.rows].map((row, position) => ({ row, position, value: cellValue(row, index) }));
    rows.sort((a, b) => compare(a.value, b.value, direction) || a.position - b.position);
    for (const { row } of rows) body.append(row);
    renumber(table);
  };

  /** Numbers the shown rows 1, 2, 3… in any cell marked data-ak-position. */
  const renumber = (table) => {
    let position = 0;
    for (const row of table.tBodies[0]?.rows ?? []) {
      if (row.hidden) continue;
      position += 1;
      const cell = row.querySelector("[data-ak-position]");
      if (cell) cell.textContent = String(position);
    }
  };

  // ---- Filtering -----------------------------------------------------------
  /** Per table: the search words and each named filter's value. */
  const filters = new Map();

  const applyFilters = (selector) => {
    const table = document.querySelector(selector);
    if (!table) return;
    const state = filters.get(selector) ?? { words: [], values: {} };
    let shown = 0;
    for (const row of table.tBodies[0]?.rows ?? []) {
      const text = (row.dataset.search ?? row.textContent).toLowerCase();
      const matches =
        state.words.every((word) => text.includes(word)) &&
        Object.entries(state.values).every(([name, value]) => !value || row.dataset[name] === value);
      row.hidden = !matches;
      if (matches) shown += 1;
    }
    renumber(table);
    const empty = document.querySelector(`[data-ak-empty-for="${selector}"]`);
    if (empty) empty.hidden = shown > 0;
    table.closest(".ak-table-wrap")?.toggleAttribute("hidden", shown === 0 && Boolean(empty));
  };

  const setFilter = (selector, update) => {
    const state = filters.get(selector) ?? { words: [], values: {} };
    update(state);
    filters.set(selector, state);
    applyFilters(selector);
  };

  // ---- Clicks --------------------------------------------------------------
  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const toggle = target.closest("[data-ak-sidebar-toggle]");
    if (toggle) return toggleSidebar();

    const sort = target.closest("table[data-ak-sortable] .ak-sort");
    if (sort) return sortBy(sort);

    const chip = target.closest(".ak-chips[data-ak-filter] .ak-chip");
    if (chip) {
      const group = chip.closest(".ak-chips");
      for (const other of group.querySelectorAll(".ak-chip")) other.setAttribute("aria-pressed", String(other === chip));
      const name = group.dataset.akFilter;
      return setFilter(group.dataset.akFilterTarget, (state) => (state.values[name] = chip.dataset.value ?? ""));
    }

    const clear = target.closest(".ak-search__clear");
    if (clear) {
      const input = clear.parentElement?.querySelector("input");
      if (input) {
        input.value = "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.focus();
      }
      return;
    }

    const opener = target.closest("[data-ak-dialog-open]");
    if (opener) {
      document.querySelector(opener.dataset.akDialogOpen)?.showModal();
      return;
    }

    const noticeButton = target.closest("[data-ak-notice]");
    if (noticeButton) {
      const box = document.querySelector(noticeButton.dataset.akNoticeTarget ?? "");
      if (box) box.textContent = noticeButton.dataset.akNotice;
    }

    const closer = target.closest("[data-ak-dialog-close]");
    if (closer) {
      closer.closest("dialog")?.close();
      return;
    }

    // A click on a modal's backdrop lands on the dialog itself.
    if (target instanceof HTMLDialogElement && target.open) {
      target.close();
      return;
    }

    const switchButton = target.closest("button.ak-switch[role='switch']");
    if (switchButton && !switchButton.disabled) {
      switchButton.setAttribute("aria-checked", String(switchButton.getAttribute("aria-checked") !== "true"));
      return;
    }

    const row = target.closest("tr[data-href]");
    if (row && !target.closest("a, button, input, select, label")) window.location.href = row.dataset.href;
  });

  // ---- Inputs --------------------------------------------------------------
  document.addEventListener("input", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || !input.dataset.akSearch) return;
    const words = input.value.toLowerCase().split(/\s+/).filter(Boolean);
    setFilter(input.dataset.akSearch, (state) => (state.words = words));
  });

  document.addEventListener("keydown", (event) => {
    const input = event.target;
    if (event.key === "Escape" && input instanceof HTMLInputElement && input.dataset.akSearch && input.value) {
      event.preventDefault();
      input.value = "";
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });

  document.addEventListener("change", (event) => {
    const select = event.target;
    if (!(select instanceof HTMLSelectElement)) return;
    if (select.dataset.akNavigate !== undefined) {
      const href = select.selectedOptions[0]?.dataset.href;
      if (href) window.location.href = href;
      return;
    }
    if (select.dataset.akFilter) {
      const name = select.dataset.akFilter;
      setFilter(select.dataset.akFilterTarget, (state) => (state.values[name] = select.value));
    }
  });

  // ---- Start ---------------------------------------------------------------
  const start = () => {
    syncToggles();
    for (const dialog of document.querySelectorAll("dialog[data-ak-autoshow]")) {
      if (!dialog.open) dialog.showModal();
      dialog.addEventListener("close", () => {
        if (dialog.dataset.akCloseHref) window.location.href = dialog.dataset.akCloseHref;
      });
    }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
