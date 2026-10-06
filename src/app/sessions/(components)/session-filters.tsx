"use client";

import { TimeBand, Venue } from "@/lib/api/types/sessions.types";
import "./styles/session-filters.styles.css";
import { MovieFormat, MovieLanguage } from "@/lib/api/types/movie.types";

export default function SessionFilters({ filters }: { filters: any }) {
  return (
    <div className="session-filters-container">
      <h2 className="session-filters-container-heading">Filters</h2>
      <div className="filters-container">
        <p className="filter-name overline">VENUE</p>
        {filters.venues.map((venue: Venue) => {
          return (
            <div key={venue.slug} className="filter">
              <span className="filter-label label-m">
                {venue.name}{" "}
                <span className="filter-sublabel body-s">· {venue.city}</span>
              </span>
            </div>
          );
        })}
      </div>
      <hr />
      <div className="filters-container">
        <p className="filter-name overline">FORMAT</p>
        {filters.formats.map((format: MovieFormat) => {
          return (
            <div key={format.slug} className="filter">
              <span className="filter-label label-m">{format.name} </span>
            </div>
          );
        })}
      </div>
      <hr />
      <div className="filters-container">
        <p className="filter-name overline">LANGUAGE</p>
        {filters.languages.map((language: MovieLanguage) => {
          return (
            <div key={language.slug} className="filter">
              <span className="filter-label label-m">{language.name} </span>
            </div>
          );
        })}
      </div>
      <hr />
      <div className="filters-container">
        <p className="filter-name overline">TIME OF DAY</p>
        {filters.timeBands.map((timeBand: TimeBand) => {
          let [timeOfDay, oClock] = timeBand.label.split(/ (.*)/);
          oClock = oClock.replace(/[()]/g, "");
          return (
            <div key={timeBand.id} className="filter">
              <span className="filter-label label-m">
                {timeOfDay}{" "}
                <span className="filter-sublabel body-s">· {oClock}</span>
              </span>
            </div>
          );
        })}
      </div>
      <hr />
      <p className="amt-filters-active body-s">{0} filters active</p>
    </div>
  );
}
