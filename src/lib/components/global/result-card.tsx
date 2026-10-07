"use client";
import { useRouter } from "next/navigation";
import { Movie } from "../../api/types/movie.types";
import "./styles/result-card.styles.css";
import { Dispatch, SetStateAction } from "react";

// functions to highlight query
function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function HighlightedTitle({ title, query }: { title: string; query: string }) {
  const term = query.trim();
  if (!term) return <>{title}</>;

  const parts = title.split(new RegExp(`(${escapeRegExp(term)})`, "gi"));

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="result-card-highlight">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

export default function ResultCard({
  movie,
  query,
  setIsOpen,
}: {
  movie: Movie;
  query: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();

  return (
    <div
      className="clickable result-card"
      onClick={() => {
        setIsOpen(false);
        router.push(`/movies/${movie.slug}`);
      }}
    >
      <div className="result-card-movie-info-container">
        {/* ternary to handle missing posters */}
        {movie.posterUrl ? (
          <img
            className="result-card-movie-poster"
            src={movie.posterUrl}
            alt={`${movie.title} poster`}
          />
        ) : (
          <div className="result-card-movie-poster result-card-poster-placeholder" />
        )}
        <div className="result-card-movie-info-text-container">
          <p className="result-card-movie-title label-m">
            <HighlightedTitle title={movie.title} query={query} />
          </p>
          <p className="result-card-movie-detail body-s">
            {movie.kind} · {movie.ageRating.minAge}+ · {movie.runtimeMinutes}{" "}
            min
          </p>
        </div>
      </div>
      {movie.isComingSoon ? (
        <p className="result-card-coming-soon label-m">Coming Soon</p>
      ) : (
        <p className="result-card-pricing label-m">from ₾{movie.fromPrice}</p>
      )}
    </div>
  );
}
