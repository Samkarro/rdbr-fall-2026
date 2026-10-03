"use client";
import { useEffect, useState } from "react";
import { MovieDetail, MovieFormat } from "../api/types/movie.types";
import "./styles/hero.styles.css";

const INTERVAL_MS = 5000;

export default function HeroSection({ movies }: { movies: MovieDetail[] }) {
  const [index, setIndex] = useState(0);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

  const handleSeek = (previous: boolean) => {
    clearTimeout(timeoutId);

    if (previous) {
      let newIndex = index - 1;
      newIndex = newIndex < 0 ? movies.length - 1 : newIndex;
      setIndex(newIndex);
    } else {
      let newIndex = (index + 1) % movies.length;
      setIndex(newIndex);
    }
  };

  useEffect(() => {
    // Dynamic carousel sizing based on amt of featured stuff
    // Just in case the amount changes from a fixed 4
    if (movies.length < 2) return;
    const id = setTimeout(
      () => setIndex((i) => (i + 1) % movies.length),
      INTERVAL_MS,
    );
    setTimeoutId(id);

    return () => {
      setTimeoutId(undefined);
      clearTimeout(id);
    };
  }, [index, movies.length]);

  return (
    <section id="hero" className="hero">
      {movies.map((movie, i) => {
        const isActive = i === index;
        return (
          <div
            key={movie.id}
            className={`hero-fade ${isActive ? "active" : ""}`}
            inert={!isActive}
            aria-hidden={!isActive}
          >
            <img
              className="hero-image"
              src={movie.backdropUrl ?? undefined}
              alt=""
              loading={i === 0 ? "eager" : "lazy"}
            />
            {/* FIXME: Z-indexes are very random. standardize */}
            <div className="hero-image-overlay"></div>
            <div className="hero-content">
              <div className="hero-content-red-label premiere-label">
                PREMIERE · WEEK OF{" "}
                {new Intl.DateTimeFormat("en-US", {
                  day: "numeric",
                  month: "short",
                }).format(new Date(movie.releaseDate))}
              </div>
              <p className="hero-content-title">{movie.title}</p>
              <div className="hero-content-labels">
                <div className="hero-content-red-label">
                  {movie.ageRating.minAge}+
                </div>
                <div className="hero-content-gray-label">
                  <img src="/stopwatch.svg" />
                  {movie.runtimeMinutes} Min
                </div>
                {movie.formats &&
                  movie.formats.map((format: MovieFormat) => {
                    return (
                      <div key={format.id} className="hero-content-gray-label">
                        {format.name.toUpperCase()}
                      </div>
                    );
                  })}
              </div>
              <p className="hero-section-synopsis">{movie.synopsis}</p>
              <div className="hero-section-cta-container">
                <div className="custom-button-large clickable red-button">
                  <img src="/ticket.svg" />
                  Buy tickets
                </div>
                <div className="custom-button-large clickable gray-button">
                  All sessions
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div className="hero-progress-elements-container">
        <div className="hero-progress-bar-container">
          {movies.map((movie: MovieDetail, i: number) => {
            return (
              <div
                key={i}
                className={`hero-progress-bar ${i === index ? "active" : ""}`}
              ></div>
            );
          })}
        </div>
        <div className="hero-progress-button-container">
          <div
            className="hero-progress-button clickable"
            onClick={() => handleSeek(true)}
          >
            <img src="/hero-left.svg" />
          </div>
          <div
            className="hero-progress-button clickable"
            onClick={() => handleSeek(false)}
          >
            <img src="/hero-right.svg" />
          </div>
        </div>
      </div>
    </section>
  );
}
