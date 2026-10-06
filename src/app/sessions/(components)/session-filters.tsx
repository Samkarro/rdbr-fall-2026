"use client";

import { Venue } from "@/lib/api/types/sessions.types";
import "./styles/session-filters.styles.css";

export default function SessionFilters({ filters }: { filters: any }) {
  return (
    <div className="session-filters-container">
      <h2 className="session-filters-container-heading">Filters</h2>
      <div className="filters-container">
        <p className="filter-name overline">VENUE</p>
        {filters.venues.map((venue: Venue) => {
          return (
            <div key={venue.slug} className="venue-filter">
              <span className="venue-name label-m">
                {venue.name}{" "}
                <span className="venue-city body-s">· {venue.city}</span>
              </span>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
}
