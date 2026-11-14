"use client";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { SUGGESTED_METROS, canonicalLocation, normalizeLocation } from "@/lib/domain/schemas";

type Props = {
  id?: string;
  name: string;
  label?: string;
  value?: string;
  defaultValue?: string;
  emptyLabel?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
};

export function CityCombobox({
  id,
  name,
  value,
  defaultValue = "",
  emptyLabel = "Any city",
  placeholder = "Search a city or type your own",
  onChange,
}: Props) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listId = `${inputId}-list`;
  const [internal, setInternal] = useState(value ?? defaultValue);
  const current = value ?? internal;
  const [query, setQuery] = useState(current);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);

  const [previousValue, setPreviousValue] = useState(value);
  if (value !== previousValue) {
    setPreviousValue(value);
    setQuery(value ?? "");
  }

  const options = useMemo(() => {
    const needle = canonicalLocation(query);
    const matches = SUGGESTED_METROS.filter(metro => canonicalLocation(metro).includes(needle));
    return needle ? matches : [...SUGGESTED_METROS];
  }, [query]);

  function commit(next: string) {
    const normalized = next ? normalizeLocation(next) : "";
    setInternal(normalized);
    setQuery(normalized);
    onChange?.(normalized);
    setOpen(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive(index => open ? Math.min(index + 1, Math.max(options.length - 1, 0)) : 0);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(index => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && open && options[active]) {
      event.preventDefault();
      commit(options[active]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="city-combobox" ref={root}>
      <input type="hidden" name={name} value={current} />
      <input
        id={inputId}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && options[active] ? `${listId}-${active}` : undefined}
        autoComplete="off"
        value={query}
        placeholder={placeholder}
        maxLength={80}
        onFocus={() => setOpen(true)}
        onChange={event => {
          const next = event.target.value;
          setQuery(next);
          setInternal(next);
          onChange?.(next);
          setOpen(true);
          setActive(0);
        }}
        onBlur={() => commit(query)}
        onKeyDown={onKeyDown}
      />
      {open && (
        <ul id={listId} role="listbox" className="city-options">
          <li role="option" aria-selected={!current} className={!current ? "is-active" : undefined}>
            <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => commit("")}>{emptyLabel}</button>
          </li>
          {options.map((metro, index) => (
            <li
              id={`${listId}-${index}`}
              key={metro}
              role="option"
              aria-selected={current === metro}
              className={index === active ? "is-active" : undefined}
            >
              <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => commit(metro)}>{metro}</button>
            </li>
          ))}
          {query && !options.some(metro => canonicalLocation(metro) === canonicalLocation(query)) && (
            <li role="option" aria-selected={false}>
              <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => commit(query)}>Use “{query}”</button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
