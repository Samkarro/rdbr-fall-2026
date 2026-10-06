import { getFilterOptions } from "@/lib/api/catalog.api";
import "../../lib/components/styles/sessions.styles.css";
import SessionFilters from "./(components)/session-filters";
import { getSessions } from "@/lib/api/sessions.api";

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const [filters, sessions] = await Promise.all([
    getFilterOptions(),
    getSessions(sp),
  ]);
  console.log(sessions);

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
      </div>
      {sessions.map((session: any) => {
        return <p key={session.movie.id}>{session.movie.title}</p>;
      })}
    </section>
  );
}
