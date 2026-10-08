"use client";
import { useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import "./styles/search.styles.css";
import ResultCard from "./result-card";
import { Movie } from "@/lib/api/types/movie.types";
import { searchFilms } from "@/lib/api/catalog.api";
import { useRouter } from "next/navigation";

export default function GlobalSearch() {
  const [results, setResults] = useState<any[]>([]);
  const [resolvedQuery, setResolvedQuery] = useState("");
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleSearch = useDebouncedCallback(async (term: string) => {
    controllerRef.current?.abort();

    const searchQuery = term.trim();
    if (!searchQuery) {
      setResults([]);
      setResolvedQuery("");
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const res: Movie[] = await searchFilms(searchQuery, controller.signal);
      setResults(res);
      setResolvedQuery(searchQuery);
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
        className="header-search body-m"
        type="text"
        placeholder="Search films and live events"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          handleSearch(e.target.value);
        }}
        maxLength={200}
      />
      {isOpen && query !== "" && (
        <button
          className="search-x clickable"
          type="button"
          onClick={() => {
            setQuery("");
            setResolvedQuery("");
          }}
        >
          <img src="/x-symbol.svg" alt="" />
        </button>
      )}

      {/* Search results box */}
      {/* TODO: Debounce the switching logic too */}
      {isOpen && (
        <div className="results-panel">
          {!resolvedQuery ? (
            <div className="results-panel-alt">
              <div className="circle-container">
                <img className="results-magnifier-svg" src="/popcorn.svg" />
              </div>
              <div className="results-panel-message">
                <p className="label-m">What do you want to watch?</p>
                <p className="results-panel-message-sub body-m">
                  Search by title, director or cast
                </p>
              </div>
              <button
                className="clickable custom-button-large results-panel-cta"
                onClick={() => router.push("/sessions")}
              >
                Browse all sessions
              </button>
            </div>
          ) : results.length > 0 ? (
            <div className="results-panel-list-container">
              <div className="results-panel-header">
                <p className="results-panel-header-text overline">
                  FILMS & EVENTS
                </p>
                <p className="results-panel-header-amt">
                  {results.length}
                  {results.length === 6 ? "+" : ""} results
                </p>
              </div>
              <div className="results-panel-list">
                {results.map((el: Movie) => {
                  return (
                    <ResultCard
                      key={el.id}
                      movie={el}
                      query={resolvedQuery}
                      inputRef={inputRef}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="results-panel-alt">
              <div className="circle-container">
                <img className="results-magnifier-svg" src="/search.svg" />
              </div>
              <div className="results-panel-message">
                <p className="label-m">No results for "{resolvedQuery}"</p>
                <p className="results-panel-message-sub body-m">
                  Check the spelling or try another film or live event
                </p>
              </div>
              <button
                className="clickable custom-button-large results-panel-cta"
                onClick={() => router.push("/sessions")}
              >
                Browse all sessions
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
