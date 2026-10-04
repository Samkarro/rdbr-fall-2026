import { Movie } from "../api/types/movie.types";

export default function NowPlayingCard({ movie }: { movie: Movie }) {
  return (
    <div className="now-playing-card clickable">
      <div className="now-playing-card-info-container">
        <img src={movie.posterUrl ?? undefined} alt={`${movie.title} poster`} />

        <h3 className="now-playing-card-title">{movie.title}</h3>
        <p className="now-playing-card-sub body-s">
          {movie.genres[0].name ?? "Other"} · {movie.runtimeMinutes} min
        </p>
        <div className="now-playing-card-age-rating label-s">
          {movie.ageRating.code}
        </div>
      </div>
      <div className="now-playing-card-synopsis body-m">{movie.synopsis}</div>
      <div className="now-playing-card-cta-container">
        <p className="now-playing-card-price label-s">
          From ₾ {movie.fromPrice}
        </p>
        <div className="custom-button-large clickable red-button now-playing">
          Buy Ticket
        </div>
      </div>
    </div>
  );
}
