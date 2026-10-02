"use client";
import { useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import "./styles/search.styles.css";
import { searchFilms } from "../api/catalog.api";

export default function GlobalSearch() {
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useDebouncedCallback(async (term: string) => {
    controllerRef.current?.abort();

    const query = term.trim();
    if (!query) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const res: any = await searchFilms(query, controller.signal);
      console.log(res);
      setResults(res.data);
    } catch (err) {
      if ((err as Error).name !== "AbortError") console.error(err);
    }
  }, 300);

  return (
    <div
      className="header-search-container"
      onFocus={() => setIsOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setIsOpen(false);
      }}
      // Making sure here that clicking anything within the container focuses the input element
      onMouseDown={(e) => {
        const target = e.target as HTMLElement;
        if (target === inputRef.current || target.closest(".search-panel"))
          return;
        e.preventDefault();
        inputRef.current?.focus();
      }}
    >
      <img className="search-icon" src="/search.svg" alt="" />
      <input
        ref={inputRef}
        className="header-search"
        type="text"
        placeholder="Search films and live events"
        onChange={(e) => handleSearch(e.target.value)}
      />

      {/* Search results box */}
      {isOpen && (
        <div className="results-panel">
          {results.length > 0 ? (
            results.map((el) => {
              return <p key={el.id}>{el.title}</p>;
            })
          ) : (
            <p>test</p>
          )}
        </div>
      )}
    </div>
  );
}
