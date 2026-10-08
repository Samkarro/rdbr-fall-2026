"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import "./styles/movie-detail-sessions.styles.css";

export default function DetailSessions({ days }: { days: string[] }) {
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
          return (
            <button
              key={day}
              className={`movie-detail-session-date-button clickable ${day === selectedDate ? "active" : ""}`}
              onClick={() => setDate(day)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
