// app/sessions/(components)/session-filters.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TimeBand, Venue } from "@/lib/api/types/sessions.types";
import { MovieFormat, MovieLanguage } from "@/lib/api/types/movie.types";
import "./styles/session-filters.styles.css";

const FILTER_KEYS = ["venues", "formats", "languages", "bands"] as const;
type FilterKey = (typeof FILTER_KEYS)[number];

export default function SessionFilters({ filters }: { filters: any }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isChecked = (key: FilterKey, value: string) =>
    searchParams.getAll(key).includes(value);

  const toggle = (key: FilterKey, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll(key);
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    params.delete(key);
    next.forEach((v) => params.append(key, v));
    params.delete("page"); // filters changed -> back to page 1

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const activeCount = FILTER_KEYS.reduce(
    (sum, k) => sum + searchParams.getAll(k).length,
    0,
  );

  return (
    <div className="session-filters-container">
      <h2 className="session-filters-container-heading">Filters</h2>

      <div className="filters-container">
        <p className="filter-name overline">VENUE</p>
        {filters.venues.map((venue: Venue) => (
          <FilterOption
            key={venue.slug}
            checked={isChecked("venues", venue.slug)}
            onChange={() => toggle("venues", venue.slug)}
          >
            {venue.name}{" "}
            <span className="filter-sublabel body-s">· {venue.city}</span>
          </FilterOption>
        ))}
      </div>
      <hr />

      <div className="filters-container">
        <p className="filter-name overline">FORMAT</p>
        {filters.formats.map((format: MovieFormat) => (
          <FilterOption
            key={format.slug}
            checked={isChecked("formats", format.slug)}
            onChange={() => toggle("formats", format.slug)}
          >
            {format.name}
          </FilterOption>
        ))}
      </div>
      <hr />

      <div className="filters-container">
        <p className="filter-name overline">LANGUAGE</p>
        {filters.languages.map((language: MovieLanguage) => (
          <FilterOption
            key={language.slug}
            checked={isChecked("languages", language.slug)}
            onChange={() => toggle("languages", language.slug)}
          >
            {language.name}
          </FilterOption>
        ))}
      </div>
      <hr />

      <div className="filters-container">
        <p className="filter-name overline">TIME OF DAY</p>
        {filters.timeBands.map((timeBand: TimeBand) => {
          const [timeOfDay, rawRange = ""] = timeBand.label.split(/ (.*)/);
          const oClock = rawRange.replace(/[()]/g, "");
          return (
            <FilterOption
              key={timeBand.id}
              checked={isChecked("bands", timeBand.id.toString())}
              onChange={() => toggle("bands", timeBand.id.toString())}
            >
              {timeOfDay}{" "}
              <span className="filter-sublabel body-s">· {oClock}</span>
            </FilterOption>
          );
        })}
      </div>
      <hr />

      <p className="amt-filters-active body-s">{activeCount} filters active</p>
    </div>
  );
}

// Extracted filter markup for ease of change
function FilterOption({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <label className="filter">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="filter-label label-m">{children}</span>
    </label>
  );
}
