"use client";

import { Seat, TicketType } from "@/lib/api/types/booking.types";
import "./styles/selected-seat-card.styles.css";

export default function SelectedSeatCard({
  seat,
  type,
  price,
  ageRating,
  onTypeChange,
}: {
  seat: Seat;
  type: TicketType;
  price: number;
  ageRating: string;
  onTypeChange: (type: TicketType) => void;
}) {
  const ageRatingCheck = `${ageRating === "16+" || ageRating === "18+" ? "disabled" : ""}`;
  return (
    <div className="selected-seat-card">
      <div className="seat-info-container">
        <div className="seat-info">
          <p className="seat-label body-s">Seat</p>
          <p className="label-s">{seat.code}</p>
        </div>
        <div className="seat-price-x">
          <p className="seat-price label-s">₾{price}</p>
          <img className="clickable" src="/x-small.svg" alt="" />
        </div>
      </div>
      <hr />
      <div className="ticket-type-selection-container">
        <button
          className={`ticket-type body-s clickable ${type === "child" ? "active" : ""} ${ageRatingCheck}`}
          disabled={ageRating === "16+" || ageRating === "18+"}
          onClick={() => {
            if (type !== "child") {
              onTypeChange("child");
            }
          }}
        >
          Child 60%
        </button>
        <button
          className={`ticket-type body-s clickable ${type === "student" ? "active" : ""}`}
          onClick={() => {
            if (type !== "student") {
              onTypeChange("student");
            }
          }}
        >
          Student 75%
        </button>
        <button
          className={`ticket-type body-s clickable ${type === "adult" ? "active" : ""}`}
          onClick={() => {
            if (type !== "adult") {
              onTypeChange("adult");
            }
          }}
        >
          Adult 100%
        </button>
      </div>
    </div>
  );
}
