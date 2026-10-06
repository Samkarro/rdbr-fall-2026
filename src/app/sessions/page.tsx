import { getFilterOptions } from "@/lib/api/catalog.api";
import "../../lib/components/styles/sessions.styles.css";
import SessionFilters from "./(components)/session-filters";
import { getSessions } from "@/lib/api/sessions.api";
import { Movie } from "@/lib/api/types/movie.types";
import { Session } from "@/lib/api/types/sessions.types";
import SessionCard from "./(components)/session-card";

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const [filters, sessionData] = await Promise.all([
    getFilterOptions(),
    getSessions(sp),
  ]);

  return (
    <section id="sessions">
      <div className="sessions-heading-container">
        <h1 className="sessions-heading">Sessions</h1>
        <p className="sessions-sub body-m">
          Browse showtimes across all venues
        </p>
      </div>
      <div className="sessions-content">
        <SessionFilters filters={filters}></SessionFilters>
        <div className="sessions-movie-list">
          {sessionData.map(
            (sessionData: { movie: Movie; sessions: Session[] }) => {
              return (
                <SessionCard
                  key={sessionData.movie.id}
                  movie={sessionData.movie}
                  sessions={sessionData.sessions}
                ></SessionCard>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}
