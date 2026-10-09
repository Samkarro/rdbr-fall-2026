"use client";

import { Seat, SeatMap } from "@/lib/api/types/booking.types";
import { Session } from "@/lib/api/types/sessions.types";
import { useEffect, useState } from "react";
import SeatPicker, { MAX_SEATS } from "./seat-picker";
import SelectedSeatCard from "./selected-seat-card";

type BookingPhase = "seats" | "checkout" | "confirmation";

export default function BookingModalContent({
  session,
  seatMap,
}: {
  session: Session;
  seatMap: SeatMap;
}) {
  const [phase, setPhase] = useState<BookingPhase>("seats");
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  useEffect(() => {}, [selectedSeats]);

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
            className={`booking-phase-switcher label-s ${phase === "checkout" ? "active" : ""}`}
          >
            CHECKOUT
          </button>
        </div>
        {/* TODO: implement onNext logic for each one of these */}
        {phase === "seats" && (
          <SeatPicker
            seatMap={seatMap}
            selectedSeats={selectedSeats}
            setSelectedSeats={setSelectedSeats}
          />
        )}
        {phase === "checkout" && <div className="payment-left-container"></div>}
      </div>
      <div className="booking-modal-separator"></div>
      <div className="booking-modal-right-content">
        <div className="selected-seats-container">
          <p className="selected-seats-heading">Your seats · Max {MAX_SEATS}</p>
          {selectedSeats.length > 0 ? (
            selectedSeats.map((seat: Seat) => {
              return (
                <SelectedSeatCard
                  key={seat.id}
                  seat={seat}
                  price={session.price}
                />
              );
            })
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
            <p className="subtotal-amt h1">₾ {32}</p>
          </div>
          <button
            className={`custom-button-large red-button ${selectedSeats.length === 0 ? "disabled" : ""}`}
          >
            Next: Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
