"use client";

import { useEffect, useRef, useState } from "react";

type Option = { value: string; label: string };

export function SelectField({
  label,
  name,
  error,
  valid,
  options,
  defaultValue = "",
  onValueChange,
}: {
  label: string;
  name: string;
  error?: string;
  valid?: boolean;
  options: Option[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}) {
  const hasError = Boolean(error);
  const [value, setValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const choose = (next: string) => {
    setValue(next);
    setIsOpen(false);
    onValueChange?.(next);
  };

  return (
    <div className={`custom-input ${error ? "error" : ""}`}>
      <label className="label-s" htmlFor={name}>
        {label}
      </label>

      <div className="custom-input-control custom-dropdown" ref={containerRef}>
        <input type="hidden" name={name} value={value} />

        <button
          id={name}
          type="button"
          className="custom-dropdown-trigger clickable label-s"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((o) => !o)}
        >
          {selected?.label}
          <img
            className={isOpen ? "open" : ""}
            src="/dropdown-arrow.svg"
            alt=""
          />
        </button>

        {valid && !hasError && (
          <img className="green-check" src="/green-check.svg" alt="" />
        )}

        {isOpen && (
          <ul className="custom-dropdown-menu" role="listbox">
            {options.map((o) => (
              <li
                key={o.value}
                role="option"
                aria-selected={o.value === value}
                className={`custom-dropdown-option clickable label-s ${
                  o.value === value ? "selected" : ""
                }`}
                onClick={() => choose(o.value)}
              >
                {o.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="custom-input-error body-s">{error}</p>}
    </div>
  );
}
