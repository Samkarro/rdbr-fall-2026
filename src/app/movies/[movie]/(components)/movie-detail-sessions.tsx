"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import "./styles/movie-detail-sessions.styles.css";
import { formatDateParts } from "@/lib/utils/dates";
import { Session, Venue } from "@/lib/api/types/sessions.types";
import { Movie } from "@/lib/api/types/movie.types";

export default function DetailSessions({
  days,
  sessionData,
}: {
  days: string[];
  sessionData: { venue: Venue; sessions: Session[] }[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const selectedDate = searchParams.get("date") ?? days[0];

  const setDate = (date: string) =>
    updateParams((params) => params.set("date", date));

  return (
    <div id="movie-detail-session-section">
      <h2>Sessions</h2>
      <div className="movie-detail-session-date-list">
        {days.map((day: string) => {
          const { weekday, day: dayNum } = formatDateParts(day);
          return (
            <button
              key={day}
              className={`movie-detail-session-date-button clickable ${day === selectedDate ? "active" : ""}`}
              onClick={() => setDate(day)}
            >
              <p className="date-weekday label-s">{weekday}</p>
              <p className="date-num label-s">{dayNum}</p>
            </button>
          );
        })}
      </div>
      {sessionData.map(({ venue, sessions }) => {
        const dateSessions = sessions.filter(
          (session) => session.date === selectedDate,
        );

        const halls = Array.from(
          new Map(
            dateSessions.map((session) => [session.hall.id, session.hall]),
          ).values(),
        );

        if (halls.length === 0) return null;

        return (
          <div key={venue.id} className="session-venue-container">
            <p className="venue-list-heading">{venue.name}</p>

            <div className="hall-list">
              {halls.map((hall) => {
                const hallSessions = dateSessions.filter(
                  (session) => session.hall.id === hall.id,
                );

                return (
                  <div key={hall.id} className="hall-card">
                    <p className="hall-heading label-s">Hall {hall.name}</p>

                    <div className="session-list">
                      {hallSessions.map((session) => (
                        // placeholder for now
                        <button
                          key={session.id}
                          className="session-card clickable"
                        >
                          <p>₾ {session.price}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
