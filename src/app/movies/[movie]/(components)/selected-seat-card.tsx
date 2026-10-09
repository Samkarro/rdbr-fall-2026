"use client";

import { SeatSelection } from "./booking-content";
import "./styles/selected-seat-card.styles.css";

export default function SelectedSeatCard({
  seat,
  price,
}: {
  seat: SeatSelection;
  price: number;
}) {
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
        <button className="ticket-type body-s clickable">Child 60%</button>
        <button className="ticket-type body-s clickable">Student 75%</button>
        <button className="ticket-type body-s clickable active">
          Adult 100%
        </button>
      </div>
    </div>
  );
}
