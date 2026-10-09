import { getSeatMap } from "@/lib/api/booking.api";
import { SeatMap } from "@/lib/api/types/booking.types";
import { Session, Venue } from "@/lib/api/types/sessions.types";
import BookingModalContent from "./booking-content";
import ModalShell from "./modal-shell";

export default async function BookingModal({
  session,
  title,
}: {
  session: Session;
  title: string;
}) {
  let seatMap: SeatMap | null = null;
  console.log(session);
  try {
    seatMap = await getSeatMap(session.id);
  } catch (err) {
    console.error("getSeatMap failed", err);
  }

  return (
    <ModalShell>
      <div className="booking-modal-header">
        <div className="booking-modal-info">
          <h2 className="booking-modal-session-title">{title}</h2>
          <p className="booking-modal-session-details">
            {session.venue.name} · {session.hall.name} · {session.date} ·{" "}
            {session.time} · {session.format.name} · {session.language.name}
          </p>
        </div>
      </div>
      {seatMap ? (
        <BookingModalContent session={session} seatMap={seatMap} />
      ) : (
        <p>Couldn't load seats. Close this and try again.</p>
      )}
    </ModalShell>
  );
}
