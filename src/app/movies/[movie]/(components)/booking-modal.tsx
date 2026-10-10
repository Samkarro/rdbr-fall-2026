import { getSeatMap } from "@/lib/api/booking.api";
import { SeatMap } from "@/lib/api/types/booking.types";
import { Session } from "@/lib/api/types/sessions.types";
import BookingModalContent from "./booking-content";
import ModalShell from "./modal-shell";
import { getMe } from "@/lib/api/user.api";
import { cookies } from "next/headers";

export default async function BookingModal({
  session,
  movieTitle,
  movieAgeRating,
}: {
  session: Session;
  movieTitle: string;
  movieAgeRating: string;
}) {
  const token = (await cookies()).get("token")?.value;
  let seatMap: SeatMap | null = null;
  const user = await getMe();
  try {
    seatMap = await getSeatMap(session.id, token);
  } catch (err) {
    console.error("getSeatMap failed", err);
  }

  const sessionDetails = `${session.venue.name} · Hall ${session.hall.name} · ${session.date} · ${session.time} · ${session.format.name} · ${session.language.name}`;

  return (
    <ModalShell>
      <div className="booking-modal-header">
        <div className="booking-modal-info">
          <h2 className="booking-modal-session-title">{movieTitle}</h2>
          <p className="booking-modal-session-details body-s">
            {session.venue.name} · Hall {session.hall.name} · {session.date} ·{" "}
            {session.time} · {session.format.name} · {session.language.name}
          </p>
        </div>
      </div>
      {seatMap ? (
        <BookingModalContent
          session={session}
          seatMap={seatMap}
          user={user}
          movieAgeRating={movieAgeRating}
          movieTitle={movieTitle}
          sessionDetails={sessionDetails}
        />
      ) : (
        <p>Couldn't load seats. Close this and try again.</p>
      )}
    </ModalShell>
  );
}
