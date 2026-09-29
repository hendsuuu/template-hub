import { useId } from "react";

interface SegmentedProps {
  /** Names the group for assistive tech, e.g. "Show". */
  label: string;
  /** The radios' name; the panel reads which is checked with :has(). */
  name: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  defaultValue: string;
}

/**
 * Two or three options, exactly one on (e.g. Jobs / Spend). Native radios, so
 * it needs no script: CSS shows the parts of the panel that belong to the
 * checked one (see `.ak-activity` in the stylesheet).
 */
export function Segmented({ label, name, options, defaultValue }: SegmentedProps) {
  const id = useId();
  return (
    <div role="radiogroup" aria-label={label} className="ak-segmented">
      {options.map((option) => (
        <span key={option.value} className="contents">
          <input
            type="radio"
            className="sr-only"
            id={`${id}-${option.value}`}
            name={name}
            value={option.value}
            defaultChecked={option.value === defaultValue}
            data-ak-mode-input={option.value}
          />
          <label htmlFor={`${id}-${option.value}`} className="ak-segmented__option">
            {option.label}
          </label>
        </span>
      ))}
    </div>
  );
}
