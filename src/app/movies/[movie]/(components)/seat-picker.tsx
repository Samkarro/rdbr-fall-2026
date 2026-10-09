"use client";

import { SeatMap } from "@/lib/api/types/booking.types";
import "./styles/seat-picker.styles.css";

type SeatStatus = "available" | "selected" | "sold" | "held";

function Seat({
  status,
  number,
  legend = false,
}: {
  status: SeatStatus;
  number?: number;
  legend?: boolean;
}) {
  return (
    <div className={`seat ${status} ${legend ? "legend-seat" : ""}`}></div>
  );
}

function Legend() {
  const stati = ["available", "selected", "sold", "held"];
  const message = ["Available", "Selected", "Sold", "Held by another user"];
  return (
    <div className="legend">
      {stati.map((status: string, index: number) => {
        return (
          <div key={index} className="legend-item">
            {" "}
            <Seat status={status as SeatStatus} legend={true} />
            <p className="legend-description body-s">{message[index]}</p>
          </div>
        );
      })}
    </div>
  );
}

export default function SeatPicker({ seatMap }: { seatMap: SeatMap }) {
  return (
    <div className="seat-picker-left-container">
      <div className="screen label-s">SCREEN</div>
      <div className="stalls-container"></div>
      <Legend />
    </div>
  );
}
