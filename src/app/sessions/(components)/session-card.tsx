import { Movie } from "@/lib/api/types/movie.types";
import { Session } from "@/lib/api/types/sessions.types";
import "./styles/session-card.styles.css";
import Ticket from "@/lib/misc/ticket";

export default function SessionCard({
  movie,
  sessions,
}: {
  movie: Movie;
  sessions: Session[];
}) {
  return (
    // TODO: Handle sold out cases
    <div className="session-card">
      <div className="session-card-movie-detail-container">
        <img src={movie.posterUrl ?? undefined} />
        <div className="session-card-movie-detail">
          <div className="session-card-movie-heading-container">
            {" "}
            <h3 className="session-card-movie-heading">{movie.title}</h3>{" "}
            <div className="session-card-movie-detail-label label-s">
              {movie.ageRating.code}
            </div>
          </div>
          <p className="session-card-movie-sub body-m">
            {movie.runtimeMinutes} min
          </p>
        </div>
      </div>
      <div className="session-list">
        {sessions.map((session) => {
          return (
            <div className="clickable">
              <div className="session-time-container ">
                <h3>{session.time}</h3>
                <div className="session-category label-s">
                  {session.format.name}
                </div>
              </div>
              <div className="session-additional-info-container">
                <div className="session-additional-info">
                  <p className="session-language body-s">
                    {session.language.name}
                  </p>
                  <p className="session-location label-s">
                    {session.venue.name} · {session.venue.city}
                  </p>
                </div>
                <div className="session-ticket-info">
                  <p
                    className={`ticket-amount body-s ${session.seatsLeft <= 50 ? "red" : ""}`}
                  >
                    <Ticket
                      fill={session.seatsLeft <= 50 ? "#EC3013" : "#4ADE80"}
                    />
                    {session.seatsLeft} left
                  </p>
                  <p className="session-price label-s">₾{session.price}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
}
