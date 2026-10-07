"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TimeBand, Venue } from "@/lib/api/types/sessions.types";
import { MovieFormat, MovieLanguage } from "@/lib/api/types/movie.types";
import { formatDateParts } from "@/lib/utils/dates";
import "./styles/session-filters.styles.css";
import HorizontalScroller from "@/lib/components/global/horizontal-scroller";

const FILTER_KEYS = ["venues", "formats", "languages", "bands"] as const;
type FilterKey = (typeof FILTER_KEYS)[number];

export default function SessionFilters({
  filters,
  days,
}: {
  filters: any;
  days: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hasActiveFilters = Array.from(searchParams.keys()).some(
    (key) => !["page", "date", "sort"].includes(key),
  );

  // Needed to gauge which format filters to show
  const selectedVenues = searchParams.getAll("venues");

  const updateParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const isChecked = (key: FilterKey, value: string) =>
    searchParams.getAll(key).includes(value);

  const toggle = (key: FilterKey, value: string) =>
    updateParams((params) => {
      const current = params.getAll(key);
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      params.delete(key);
      next.forEach((v) => params.append(key, v));

      // Checking to find out which format filters to delete from query post-venue-selection
      if (key === "venues") {
        const validFormats = params
          .getAll("formats")
          .filter((slug) => isFormatAvailableFor(filters.venues, next, slug));

        params.delete("formats");
        validFormats.forEach((slug) => params.append("formats", slug));
      }
    });

  const selectedDate = searchParams.get("date") ?? days[0];

  const setDate = (date: string) =>
    updateParams((params) => params.set("date", date));

  const activeCount = FILTER_KEYS.reduce(
    (sum, k) => sum + searchParams.getAll(k).length,
    0,
  );

  // Checking to find out which format filters to render
  function isFormatAvailableFor(
    venues: Venue[],
    selectedVenueSlugs: string[],
    formatSlug: string,
  ) {
    return (
      selectedVenueSlugs.length === 0 ||
      venues.some(
        (venue) =>
          selectedVenueSlugs.includes(venue.slug) &&
          venue.formats.some((f: MovieFormat) => f.slug === formatSlug),
      )
    );
  }

  function handleClearFilters() {
    const params = new URLSearchParams();

    const paramsToKeep = ["page", "date", "sort"];

    paramsToKeep.forEach((key) => {
      searchParams.getAll(key).forEach((value) => {
        params.append(key, value);
      });
    });

    const queryString = params.toString();

    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }

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
        <p className="filter-name overline">DATE</p>
        <HorizontalScroller className="date-filter-list">
          {days.map((day, i) => {
            const { weekday, day: dayNum } = formatDateParts(day);
            const selected = day === selectedDate;
            return (
              <div
                key={day}
                className={`date-filter-button clickable ${selected ? "selected" : ""}`}
                onClick={() => setDate(day)}
              >
                <p className="date-weekday label-s">{weekday}</p>
                <p className="date-num label-s">{dayNum}</p>
              </div>
            );
          })}
        </HorizontalScroller>
      </div>
      <hr />

      <div className="filters-container">
        <p className="filter-name overline">FORMAT</p>
        {filters.formats.map((format: MovieFormat) => {
          if (
            !isFormatAvailableFor(filters.venues, selectedVenues, format.slug)
          )
            return null;

          return (
            <FilterOption
              key={format.slug}
              checked={isChecked("formats", format.slug)}
              onChange={() => toggle("formats", format.slug)}
            >
              {format.name}
            </FilterOption>
          );
        })}
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

      <div className="clear-filters-button-container">
        {hasActiveFilters ? (
          <button
            className="clear-filters-button label-s clickable"
            onClick={() => handleClearFilters()}
          >
            Clear filters
          </button>
        ) : (
          <div className="clear-filters-placeholder"></div>
        )}

        <p className="amt-filters-active body-s">
          {activeCount} filter{activeCount == 1 ? "" : "s"} active
        </p>
      </div>
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
    <label className="filter clickable">
      {checked && <img src="./check.svg" />}
      <input
        className={`clickable ${checked ? "checked" : ""}`}
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <span className="filter-label label-m">{children}</span>
    </label>
  );
}
