"use client";
import { getRecent, RecentMovie } from "@/lib/recently-viewed";
import { useEffect, useState } from "react";
import "./styles/recently-viewed.styles.css";
import { useRouter } from "next/navigation";
import HorizontalScroller from "../global/horizontal-scroller";

export default function RecentlyViewed() {
  const [movies, setMovies] = useState<RecentMovie[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    const movies = getRecent();
    if (!movies.length) return setMovies([]);
    setMovies(movies);
  }, []);

  if (!movies?.length) return null;

  return (
    <section id="recently-viewed">
      <h1 className="recently-viewed-heading">Recently viewed</h1>
      <div className="recently-viewed-list-clipper">
        <div className="recently-viewed-list-overlay"></div>
        <HorizontalScroller className="recently-viewed-list">
          {movies.map((movie: RecentMovie) => {
            return (
              <div
                key={movie.slug}
                className="recently-viewed-card clickable"
                onClick={() => router.push(`/movies/${movie.slug}`)}
              >
                <img src={movie.posterUrl} />
                <div className="recently-viwed-text">
                  <p className="recently-viewed-card-heading">{movie.title}</p>
                  <p className="recently-viewed-card-sub body-s">
                    {movie.genre} · {movie.runtimeMins} min
                  </p>
                  <div className="recently-viewed-card-age-rating label-s">
                    {movie.ageRating}
                  </div>
                </div>
              </div>
            );
          })}
        </HorizontalScroller>
      </div>

      <hr />
    </section>
  );
}
