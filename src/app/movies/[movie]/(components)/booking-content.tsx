"use client";

import { SeatMap } from "@/lib/api/types/booking.types";
import { Session } from "@/lib/api/types/sessions.types";
import { useState } from "react";

type BookingPhase = "seats" | "payment" | "confirmation";

export default function BookingModalContent({
  session,
  seatMap,
}: {
  session: Session;
  seatMap: SeatMap;
}) {
  const [phase, setPhase] = useState<BookingPhase>("seats");

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
            className={`booking-phase-switcher label-s ${phase === "seats" ? "active" : ""}`}
          >
            CHECKOUT
          </button>
        </div>
        {/* TODO: implement onNext logic for each one of these */}
        {phase === "seats" && (
          <div className="seat-picker-left-container"></div>
        )}
        {phase === "payment" && <div className="payment-left-container"></div>}
      </div>
    </div>
  );
}
