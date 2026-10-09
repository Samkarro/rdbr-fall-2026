"use-client";
import { getSeatMap } from "@/lib/api/booking.api";
import { SeatMap } from "@/lib/api/types/booking.types";
import { Session } from "@/lib/api/types/sessions.types";

export default async function BookingModal({ session }: { session: Session }) {
  const seatMap: SeatMap = await getSeatMap(session.id);

  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal-container">
        <div className="booking-modal-header">
          <div className="booking-modal-info">
            <h2 className="booking-modal-session-title">
              {session.movie.title}
            </h2>
            <p className="booking-modal-session-details">
              {session.venue.name} · {session.hall.name} · {session.date} ·{" "}
              {session.time} · {session.format.name} · {session.language.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
