"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import "./styles/movie-detail-sessions.styles.css";
import { formatDateParts } from "@/lib/utils/dates";
import { Session, Venue } from "@/lib/api/types/sessions.types";
import { Movie } from "@/lib/api/types/movie.types";
import Ticket from "@/lib/misc/ticket";

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
                        <div className="session-ticket-container">
                          <div className="session-ticket-left">
                            <div className="session-ticket-clip top"></div>
                            <div className="session-ticket-clip bottom"></div>
                            <p className="session-ticket-time h2">
                              {session.time}
                            </p>
                            <p className="session-ticket-language body-s">
                              {session.language.code}
                              <span className="session-ticket-format label-s">
                                {session.format.name}
                              </span>
                            </p>
                          </div>
                          <div className="session-ticket-right">
                            <p className="session-ticket-price h3">
                              ₾ {session.price}
                            </p>
                            <p className="remaining-tickets body-s">
                              <Ticket fill="#A9A9A9" />
                              {session.seatsLeft} left
                            </p>
                          </div>
                        </div>
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
