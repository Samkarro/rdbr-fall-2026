"use client";
import { getRecent, RecentMovie } from "@/lib/recently-viewed";
import { useEffect, useState } from "react";

export default function RecentlyViewed() {
  const [movies, setMovies] = useState<RecentMovie[] | null>(null);

  useEffect(() => {
    const movies = getRecent();
    if (!movies.length) return setMovies([]);
    setMovies(movies);
  }, []);

  if (!movies?.length) return null;

  return (
    <section id="recently-viewed">
      <h1 className="recently-viewed-heading">Recently viewed</h1>
      <div className="recently-viewed-list">
        {movies.map((movie: RecentMovie) => {
          return (
            <div className="recently-viewed-card">
              <img src={movie.posterUrl} />
              <div className="recently-viwed-text">
                <p className="recently-viewed-heading">{movie.title}</p>
                <p className="recently-viewed-sub body-s">
                  {movie.genre} · {movie.runtimeMins} min
                </p>
                <div className="recently-viewed-age-rating">
                  {movie.ageRating}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
