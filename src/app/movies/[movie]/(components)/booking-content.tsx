"use client";

import { Seat, SeatMap } from "@/lib/api/types/booking.types";
import { Session } from "@/lib/api/types/sessions.types";
import { useState } from "react";
import SeatPicker from "./seat-picker";

type BookingPhase = "seats" | "checkout" | "confirmation";
export type SeatId = Seat["id"];

export default function BookingModalContent({
  session,
  seatMap,
}: {
  session: Session;
  seatMap: SeatMap;
}) {
  const [phase, setPhase] = useState<BookingPhase>("seats");
  const [selectedIds, setSelectedIds] = useState<SeatId[]>([]);

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
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
          />
        )}
        {phase === "checkout" && <div className="payment-left-container"></div>}
      </div>
      <div className="booking-modal-separator"></div>
      <div className="booking-modal-right-content">
        <div className="selected-seats-container">
          <p className="selected-seats-heading">Your seats · Max 3</p>
          {selectedIds.length > 0 ? (
            selectedIds.map((el: SeatId) => {
              return (
                <div key={el} className="selected-seat-card">
                  {el}
                </div>
              );
            })
          ) : (
            <p className="seat-guide-message body-s">
              Pick up to 3 seats from the map. Each seat can carry its own
              ticket type.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
