import { Movie } from "../api/types/movie.types";
import "./styles/result-card.styles.css";

export default function ResultCard({ movie }: { movie: Movie }) {
  return (
    <div className="clickable result-card">
      <div className="result-card-movie-info-container">
        {/* TODO: Check if we can put undefined here */}
        <img
          className="result-card-movie-poster"
          src={movie.posterUrl ?? undefined}
          alt={`${movie.title} poster.`}
        />
        <div className="result-card-movie-info-text-container">
          {/* TODO: Result card should have matching text highlighted */}
          <p className="result-card-movie-title">{movie.title}</p>
          <p className="result-card-movie-detail">
            {movie.kind} · {movie.ageRating.minAge}+ · {movie.runtimeMinutes}{" "}
            min
          </p>
        </div>
      </div>
      {movie.isComingSoon ? (
        <p className="result-card-coming-soon">Coming Soon</p>
      ) : (
        <p className="result-card-pricing">from ₾{movie.fromPrice}</p>
      )}
    </div>
  );
}
