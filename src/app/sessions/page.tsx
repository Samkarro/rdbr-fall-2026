import { getFilterOptions } from "@/lib/api/catalog.api";
import "./styles/sessions.styles.css";
import SessionFilters from "./(components)/session-filters";
import { getSessions } from "@/lib/api/sessions.api";
import { Movie } from "@/lib/api/types/movie.types";
import { Session } from "@/lib/api/types/sessions.types";
import SessionCard from "./(components)/session-card";
import { getNextSevenDays } from "@/lib/utils/dates";
import SessionSorter from "./(components)/session-sorter";
import SessionPagination from "./(components)/session-pagination";

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const spString = searchParams.toString();

  const [filters, sessionData] = await Promise.all([
    getFilterOptions(),
    getSessions(sp),
  ]);
  const days = getNextSevenDays();

  return (
    <section id="sessions">
      <div className="sessions-heading-container">
        <h1 className="sessions-heading">Sessions</h1>
        <p className="sessions-sub body-m">
          Browse showtimes across all venues
        </p>
      </div>
      <div className="sessions-content">
        <SessionFilters filters={filters} days={days}></SessionFilters>
        <div className="sessions-movie-list">
          <SessionSorter sorts={filters.sorts} meta={sessionData.meta} />
          {sessionData.data.map(
            (
              sessionDataItem: { movie: Movie; sessions: Session[] },
              index: number,
            ) => {
              return (
                <SessionCard
                  key={sessionDataItem.movie.id}
                  movie={sessionDataItem.movie}
                  sessions={sessionDataItem.sessions}
                  last={index === sessionData.data.length - 1}
                ></SessionCard>
              );
            },
          )}
          <div className="session-data-pagination">
            <SessionPagination meta={sessionData.meta} />
          </div>
        </div>
      </div>
    </section>
  );
}
