"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import "./styles/movie-detail-sessions.styles.css";
import { formatDateParts } from "@/lib/utils/dates";
import { Session, Venue } from "@/lib/api/types/sessions.types";
import Ticket from "@/lib/misc/ticket";
import { useHoldReleaseOnClose } from "@/lib/hooks/use-hold-release-on-close";
import EmptyState from "@/lib/components/global/empty-state";

export default function DetailSessions({
  days,
  sessionData,
  disabled = false,
}: {
  days: string[];
  sessionData: { venue: Venue; sessions: Session[] }[];
  disabled?: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  useHoldReleaseOnClose();

  const updateParams = (
    mutate: (params: URLSearchParams) => void,
    { push = false }: { push?: boolean } = {},
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    const url = `${pathname}?${params.toString()}`;
    push
      ? router.push(url, { scroll: false })
      : router.replace(url, { scroll: false });
  };

  const selectedDate = searchParams.get("date") ?? days[0];

  const setDate = (date: string) =>
    updateParams((params) => {
      params.set("date", date);
      params.delete("session");
    });

  const openSession = (id: string) => {
    if (disabled) return;
    updateParams((params) => params.set("session", id), { push: true });
  };

  // Handling empty states with these
  const hasSessionsOn = (day: string) =>
    sessionData.some(({ sessions }) => sessions.some((s) => s.date === day));

  const dayIsEmpty = !hasSessionsOn(selectedDate);
  const nextDayWithSessions = days.find(
    (d) => d > selectedDate && hasSessionsOn(d),
  );

  return (
    <div
      id="movie-detail-session-section"
      className={disabled ? "disabled" : undefined}
    >
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
      {dayIsEmpty && (
        <EmptyState
          title="No sessions on this day"
          message={"There's nothing scheduled for this date."}
        ></EmptyState>
      )}
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
                    <div className="movie-detail-session-list">
                      {hallSessions.map((session) => (
                        <div
                          key={session.id}
                          className="session-ticket-container clickable"
                          onClick={() => openSession(String(session.id))}
                        >
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
