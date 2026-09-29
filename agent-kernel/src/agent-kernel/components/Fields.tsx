"use client";

import { useId, type ReactNode } from "react";
import { Search, X } from "lucide-react";
import { cx } from "../lib/cx";

interface SearchFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string | undefined;
}

/** A search box with an icon and a clear button; its label is for assistive tech. */
export function SearchField({ label, value, onChange, placeholder = "Search", className }: SearchFieldProps) {
  const id = useId();
  return (
    <div className={cx("ak-search", className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search size={15} className="ak-search__icon" aria-hidden="true" />
      <input
        id={id}
        type="search"
        className="ak-search__input"
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && value) {
            event.preventDefault();
            onChange("");
          }
        }}
      />
      <button type="button" className="ak-search__clear" onClick={() => onChange("")} aria-label="Clear the search" title="Clear the search">
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  /** Show the label above the box instead of only to assistive tech. */
  showLabel?: boolean;
  className?: string | undefined;
}

/** A native select in the template's control style. */
export function SelectField({ label, value, onChange, children, showLabel = false, className }: SelectFieldProps) {
  const id = useId();
  return (
    <div className={cx("ak-select-field", className)}>
      <label htmlFor={id} className={showLabel ? "ak-label" : "sr-only"}>
        {label}
      </label>
      <select id={id} className="ak-select" value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
    </div>
  );
}

interface SwitchProps {
  checked: boolean;
  /** What is switched, e.g. "Monday lead review". */
  label: string;
  onChange: () => void;
  disabled?: boolean;
}

/** An on/off switch; the change itself is confirmed by the caller. */
export function Switch({ checked, label, onChange, disabled = false }: SwitchProps) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} className="ak-switch" onClick={onChange} disabled={disabled}>
      <span className="ak-switch__track" aria-hidden="true">
        <span className="ak-switch__thumb" />
      </span>
      <span className="ak-switch__text" aria-hidden="true">
        <span className="ak-switch__on">On</span>
        <span className="ak-switch__off">Off</span>
      </span>
    </button>
  );
}

export interface Chip<V extends string> {
  value: V;
  label: string;
  count: number;
}

interface FilterChipsProps<V extends string> {
  label: string;
  chips: readonly Chip<V>[];
  selected: V;
  onSelect: (value: V) => void;
}

/** A row of toggle buttons; exactly one is pressed. */
export function FilterChips<V extends string>({ label, chips, selected, onSelect }: FilterChipsProps<V>) {
  return (
    <div role="group" aria-label={label} className="ak-chips">
      {chips.map((chip) => (
        <button key={chip.value} type="button" aria-pressed={chip.value === selected} className="ak-chip" onClick={() => onSelect(chip.value)}>
          {chip.label}
          <span className="ak-chip__count">{chip.count}</span>
        </button>
      ))}
    </div>
  );
}
