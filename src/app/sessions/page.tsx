import { getFilterOptions } from "@/lib/api/catalog.api";
import "../../lib/components/styles/sessions.styles.css";
import SessionFilters from "./(components)/session-filters";

export default async function SessionsPage() {
  const filters = await getFilterOptions();
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
    </section>
  );
}
