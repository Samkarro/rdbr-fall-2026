"use client";
import { useEffect, useState } from "react";
import { Movie } from "../api/types/movie.types";
import "./styles/hero.styles.css";

const INTERVAL_MS = 5000;

export default function HeroSection({ movies }: { movies: Movie[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Dynamic carousel sizing based on amt of featured stuff
    // Just in case the amount changes from a fixed 4
    if (movies.length < 2) return;
    const id = setTimeout(
      () => setIndex((i) => (i + 1) % movies.length),
      INTERVAL_MS,
    );
    return () => clearTimeout(id);
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
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
