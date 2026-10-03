import { Movie } from "../api/types/movie.types";

export default function NowPlayingCard({ movie }: { movie: Movie }) {
  return (
    <div className="now-playing-card clickable">
      <img src={movie.posterUrl ?? undefined} alt={`${movie.title} poster`} />
      <div className="now-playing-card-info-container">
        <h3 className="now-playing-card-title">{movie.title}</h3>
        <p className="now-playing-card-sub">
          {movie.genres[0].name ?? "Other"} · {movie.runtimeMinutes} min
        </p>
        <div className="now-playing-card-label">{movie.ageRating.minAge}+</div>
      </div>
      <div className="now-playing-card-synopsis">{movie.synopsis}</div>
      <div className="now-playing-card-cta-container">
        <p className="now-playing-card-price">From ₾ {movie.fromPrice}</p>
        <div className="custom-button-large clickable red-button now-playing">
          Buy Ticket
        </div>
      </div>
    </div>
  );
}
