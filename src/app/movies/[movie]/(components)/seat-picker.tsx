"use client";

import {
  Seat,
  SeatMap,
  SeatRow,
  SeatSection,
} from "@/lib/api/types/booking.types";
import "./styles/seat-picker.styles.css";
import { Fragment } from "react/jsx-runtime";

type SeatStatus = "available" | "unavailable" | "sold" | "held";

function SeatBlock({
  status,
  number,
  legend = false,
}: {
  status: SeatStatus | "selected";
  number?: string;
  legend?: boolean;
}) {
  if (status === "unavailable") {
    return <div className="unavailable-seat"></div>;
  }

  return (
    <div className={`seat ${status} ${legend ? "legend-seat" : ""}`}>
      {number}
    </div>
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
            <SeatBlock status={status as SeatStatus} legend={true} />
            <p className="legend-description body-s">{message[index]}</p>
          </div>
        );
      })}
    </div>
  );
}

export default function SeatPicker({ seatMap }: { seatMap: SeatMap }) {
  const sectionAmt = seatMap.sections.length;

  return (
    <div className="seat-picker-left-container">
      <div className="screen label-s">SCREEN</div>
      <div className="seats-container">
        <div className="grid-rows-container">
          {seatMap.sections.map((section: SeatSection) => {
            return (
              <div className="seat-section-container">
                <p className="section-label label-s">
                  {section.name.toUpperCase()} · ROWS {section.rows[0].label}-
                  {section.rows.at(-1)!.label}
                </p>
                {section.rows.map((row: SeatRow) => {
                  return (
                    <div className="seat-row-container">
                      <div className="row-seats-container">
                        <p className="row-label">{row.label}</p>

                        {row.seats.map((seat) => (
                          <Fragment key={seat.id}>
                            <SeatBlock
                              status={seat.state}
                              number={seat.label}
                            />
                            {seat.aisleAfter && <span className="aisle" />}
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <Legend />
    </div>
  );
}
