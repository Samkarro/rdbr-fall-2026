"use client";
import { useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import "./styles/search.styles.css";
import { searchFilms } from "../api/catalog.api";

export default function GlobalSearch() {
  const [results, setResults] = useState<any[]>([]);
  const controllerRef = useRef<AbortController | null>(null);

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
      setResults(res.data);
    } catch (err) {
      if ((err as Error).name !== "AbortError") console.error(err);
    }
  }, 300);

  return (
    <div className="header-search-container">
      <img className="search-icon" src="/search.svg" alt="" />
      <input
        className="header-search"
        type="text"
        placeholder="Search films and live events"
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
