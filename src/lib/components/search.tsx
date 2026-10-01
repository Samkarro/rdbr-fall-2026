"use client";
import "./styles/search.styles.css";

export default function GlobalSearch() {
  return (
    <div className="header-search-container">
      <img className="search-icon" src="/search.svg" />
      <input
        className="header-search"
        type="text"
        placeholder="Search films and live events"
      />
    </div>
  );
}
