export default function BookingHeader({
  movieTitle,
  sessionDetails,
}: {
  movieTitle: string;
  sessionDetails: string;
}) {
  return (
    <div className="booking-modal-header">
      <div className="booking-modal-info">
        <h2 className="booking-modal-session-title">{movieTitle}</h2>
        <p className="booking-modal-session-details body-s">{sessionDetails}</p>
      </div>
    </div>
  );
}
