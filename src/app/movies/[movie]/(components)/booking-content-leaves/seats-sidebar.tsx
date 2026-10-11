import type {
  Seat,
  SelectedTicket,
  TicketType,
} from "@/lib/api/types/booking.types";
import SubtotalBar from "./subtotal-bar";
import SelectedSeatCard from "./selected-seat-card";
import { MAX_SEATS } from "./seat-picker";

export default function SeatsSidebar({
  selectedTickets,
  ageRating,
  basePrice,
  subtotal,
  isHolding,
  onTypeChange,
  onRemove,
  onNext,
}: {
  selectedTickets: SelectedTicket[];
  ageRating: string;
  basePrice: number;
  subtotal: number;
  isHolding: boolean;
  onTypeChange: (seatId: Seat["id"], type: TicketType) => void;
  onRemove: (seatId: Seat["id"]) => void;
  onNext: () => void;
}) {
  const disabled = selectedTickets.length === 0 || isHolding;

  return (
    <div className="seats-right-container">
      <div className="selected-seats-container">
        <p className="selected-seats-heading">Your seats · Max {MAX_SEATS}</p>

        {selectedTickets.length > 0 ? (
          selectedTickets.map(({ seat, type }) => (
            <SelectedSeatCard
              key={seat.id}
              seat={seat}
              ageRating={ageRating}
              type={type}
              price={basePrice}
              onTypeChange={(newType) => onTypeChange(seat.id, newType)}
              // onRemove={() => onRemove(seat.id)}
            />
          ))
        ) : (
          <p className="seat-guide-message body-s">
            Pick up to {MAX_SEATS} seats from the map. Each seat can carry its
            own ticket type.
          </p>
        )}
      </div>

      <SubtotalBar subtotal={subtotal}>
        <button
          className={`custom-button-large red-button clickable ${disabled ? "disabled" : ""}`}
          disabled={disabled}
          onClick={onNext}
        >
          Next: Checkout
        </button>
      </SubtotalBar>
    </div>
  );
}
