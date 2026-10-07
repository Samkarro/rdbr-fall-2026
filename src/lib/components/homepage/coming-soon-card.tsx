import { Movie } from "../../api/types/movie.types";
import "./styles/coming-soon.styles.css";

export default function ComingSoonCard({ movie }: { movie: Movie }) {
  return (
    <div className="coming-soon-card clickable">
      {" "}
      <img
        src={movie.backdropUrl ?? undefined}
        alt={`${movie.title} backdrop.`}
      />
      <div className="coming-soon-card-right-container">
        <div className="coming-soon-card-info-container">
          <p className="coming-soon-card-release-date label-s">
            in cinemas{" "}
            {new Intl.DateTimeFormat("en-US", {
              day: "numeric",
              month: "long",
            }).format(new Date(movie.releaseDate))}
          </p>
          <p className="coming-soon-card-title label-s">{movie.title}</p>
          <p className="coming-soon-card-sub body-s">
            {movie.genres[0].name} · {movie.runtimeMinutes}
          </p>
          <div className="coming-soon-card-age-rating label-s">
            {movie.ageRating.code}
          </div>
        </div>
        <div className="coming-soon-card-notify-button label-s">
          <img src="./bell.svg" />
          Notify Me
        </div>
      </div>
    </div>
  );
}
