"use client";

import {
  Seat,
  SeatMap,
  SeatRow,
  SeatSection,
} from "@/lib/api/types/booking.types";
import "./styles/seat-picker.styles.css";
import { Fragment } from "react/jsx-runtime";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

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
    <div className={`seat clickable ${status} ${legend ? "legend-seat" : ""}`}>
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
      <TransformWrapper
        minScale={0.7}
        maxScale={1}
        initialScale={1}
        centerOnInit
        doubleClick={{ disabled: true }}
        panning={{ velocityDisabled: true }}
        wheel={{ step: 0.01 }}
      >
        <TransformComponent
          wrapperStyle={{ width: "100%", maxHeight: 560 }}
          contentStyle={{ width: "max-content" }}
        >
          <div className="hall-container">
            <div className="screen label-s">SCREEN</div>
            <div className="seats-container">
              <div className="grid-rows-container">
                {seatMap.sections.map((section: SeatSection, index: number) => {
                  return (
                    <div
                      key={`${section.name}-${index}`}
                      className="seat-section-container"
                    >
                      <p className="stalls-label label-s">
                        {section.name.toUpperCase()} · ROWS{" "}
                        {section.rows[0].label}-{section.rows.at(-1)!.label}
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
                                  {seat.aisleAfter && (
                                    <span className="aisle" />
                                  )}
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
          </div>
        </TransformComponent>
      </TransformWrapper>

      <Legend />
    </div>
  );
}
