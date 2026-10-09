"use client";

import { useState } from "react";
import { Seat, SeatMap, TicketType } from "@/lib/api/types/booking.types";
import { Session } from "@/lib/api/types/sessions.types";
import { User } from "@/lib/api/types/user.types";
import SeatPicker, { MAX_SEATS } from "./seat-picker";
import SelectedSeatCard from "./selected-seat-card";

type BookingPhase = "seats" | "checkout" | "confirmation";

export type SelectedTicket = {
  seat: Seat;
  type: TicketType;
};

export default function BookingModalContent({
  session,
  seatMap,
  user,
}: {
  session: Session;
  seatMap: SeatMap;
  user: User | null;
}) {
  const [phase, setPhase] = useState<BookingPhase>("seats");

  const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]);

  const handleTicketTypeChange = (seatId: Seat["id"], type: TicketType) => {
    setSelectedTickets((prev) =>
      prev.map((ticket) =>
        ticket.seat.id === seatId ? { ...ticket, type } : ticket,
      ),
    );
  };

  const calculateSubtotal = () => {
    let sum = 0;

    selectedTickets.forEach(({ type }) => {
      switch (type) {
        case "child":
          sum += Math.round(session.price * 60);
          break;
        case "student":
          sum += Math.round(session.price * 75);
          break;
        default:
          sum += Math.round(session.price * 100);
          break;
      }
    });

    return sum / 100;
  };

  return (
    <div className="booking-modal-content">
      <div className="booking-modal-left-content">
        <div className="booking-phase-switcher-container">
          <button
            className={`booking-phase-switcher label-s ${phase === "seats" ? "active" : ""}`}
          >
            SEATS
          </button>
          <button
            className={`booking-phase-switcher label-s ${
              phase === "checkout" ? "active" : ""
            }`}
          >
            CHECKOUT
          </button>
        </div>

        {phase === "seats" && (
          <SeatPicker
            seatMap={seatMap}
            selectedTickets={selectedTickets}
            setSelectedTickets={setSelectedTickets}
          />
        )}

        {phase === "checkout" && <div className="payment-left-container" />}
      </div>

      <div className="booking-modal-separator" />

      <div className="booking-modal-right-content">
        <div className="selected-seats-container">
          <p className="selected-seats-heading">Your seats · Max {MAX_SEATS}</p>

          {selectedTickets.length > 0 ? (
            selectedTickets.map(({ seat, type }) => (
              <SelectedSeatCard
                key={seat.id}
                seat={seat}
                type={type}
                price={session.price}
                onTypeChange={(newType) =>
                  handleTicketTypeChange(seat.id, newType)
                }
              />
            ))
          ) : (
            <p className="seat-guide-message body-s">
              Pick up to {MAX_SEATS} seats from the map. Each seat can carry its
              own ticket type.
            </p>
          )}
        </div>
        <div className="subtotal-container">
          <div className="subtotal-text-container">
            <p className="subtotal-text label-s">SUBTOTAL</p>
            <p className="subtotal-amt h1">₾ {calculateSubtotal()}</p>
          </div>
          <button
            className={`custom-button-large red-button clickable ${
              selectedTickets.length === 0 ? "disabled" : ""
            }`}
            disabled={selectedTickets.length === 0}
            onClick={() => setPhase("checkout")}
          >
            Next: Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
