"use client";

import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import {
  Seat,
  SeatMap,
  SeatRow,
  SeatSection,
} from "@/lib/api/types/booking.types";
import "./styles/seat-picker.styles.css";
import { SeatSelection } from "./booking-content";

export const MAX_SEATS = 3;
const DRAG_THRESHOLD_PX = 5;

type SeatStatus = "available" | "unavailable" | "sold" | "held";

function SeatBlock({
  status,
  number,
  label,
  onClick,
  legend = false,
}: {
  status: SeatStatus | "selected";
  number?: string;
  label?: string;
  onClick?: (e: React.MouseEvent) => void;
  legend?: boolean;
}) {
  if (status === "unavailable") {
    return <div className="unavailable-seat" />;
  }
  const className = `seat ${status} ${legend ? "legend-seat" : ""}`;
  if (legend) return <div className={className} />;

  return (
    <button
      className={`${className} clickable`}
      onClick={onClick}
      disabled={status === "sold" || status === "held"}
    >
      {number}
    </button>
  );
}

const LEGEND: { status: SeatStatus | "selected"; text: string }[] = [
  { status: "available", text: "Available" },
  { status: "selected", text: "Selected" },
  { status: "sold", text: "Sold" },
  { status: "held", text: "Held by another user" },
];

function Legend() {
  return (
    <div className="legend">
      {LEGEND.map(({ status, text }) => (
        <div key={status} className="legend-item">
          <SeatBlock status={status} legend />
          <p className="legend-description body-s">{text}</p>
        </div>
      ))}
    </div>
  );
}

function ZoomControls() {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <div className="zoom-controls">
      <button className="zoom-btn" onClick={() => zoomIn()}>
        +
      </button>
      <button className="zoom-btn" onClick={() => zoomOut()}>
        −
      </button>
      <button className="zoom-btn" onClick={() => resetTransform()}>
        ⟲
      </button>
    </div>
  );
}

export default function SeatPicker({
  seatMap,
  selectedIds,
  setSelectedIds,
}: {
  seatMap: SeatMap;
  selectedIds: SeatSelection[];
  setSelectedIds: Dispatch<SetStateAction<SeatSelection[]>>;
}) {
  const pointerDown = useRef<{ x: number; y: number } | null>(null);

  const seatsById = useMemo(() => {
    const map = new Map<Seat["id"], Seat>();
    seatMap.sections.forEach((s) =>
      s.rows.forEach((r) => r.seats.forEach((seat) => map.set(seat.id, seat))),
    );
    return map;
  }, [seatMap]);

  useEffect(() => {
    setSelectedIds((prev) => {
      const next = prev.filter(
        ({ id }) => seatsById.get(id)?.state === "available",
      );
      return next.length === prev.length ? prev : next;
    });
  }, [seatsById, setSelectedIds]);

  const handleSeatClick = (e: React.MouseEvent, seat: Seat) => {
    const start = pointerDown.current;
    if (
      start &&
      Math.hypot(e.clientX - start.x, e.clientY - start.y) > DRAG_THRESHOLD_PX
    ) {
      return;
    }

    setSelectedIds((prev) => {
      if (prev.some((s) => s.id === seat.id))
        return prev.filter((s) => s.id !== seat.id);
      if (prev.length >= MAX_SEATS) return prev;
      return [...prev, { id: seat.id, code: seat.code }];
    });
  };

  return (
    <div className="seat-picker-left-container">
      <div className="seat-map-view">
        <TransformWrapper
          minScale={0.5}
          maxScale={0.75}
          initialScale={0.5}
          centerOnInit
          doubleClick={{ disabled: true }}
          panning={{ velocityDisabled: true }}
          wheel={{ step: 0.01 }}
        >
          <ZoomControls />
          <TransformComponent
            wrapperStyle={{ width: "100%", height: "100%" }}
            contentStyle={{ width: "max-content" }}
          >
            <div
              className="seat-map-content"
              onPointerDownCapture={(e) => {
                pointerDown.current = { x: e.clientX, y: e.clientY };
              }}
            >
              <div className="screen label-s">SCREEN</div>
              <div className="grid-rows-container">
                {seatMap.sections.map((section: SeatSection) => {
                  if (!section.rows.length) return null;
                  return (
                    <div key={section.name} className="seat-section-container">
                      <p className="section-label label-s">
                        {section.name.toUpperCase()} · ROWS{" "}
                        {section.rows[0].label}-
                        {section.rows[section.rows.length - 1].label}
                      </p>
                      {section.rows.map((row: SeatRow) => (
                        <div key={row.label} className="seat-row-container">
                          <div className="row-seats-container">
                            <p className="row-label">{row.label}</p>
                            {row.seats.map((seat: Seat) => (
                              <Fragment key={seat.id}>
                                <SeatBlock
                                  status={
                                    selectedIds.some(
                                      (el: SeatSelection) => el.id === seat.id,
                                    )
                                      ? "selected"
                                      : seat.state
                                  }
                                  number={seat.label}
                                  label={`Seat ${seat.code}`}
                                  onClick={(e) => handleSeatClick(e, seat)}
                                />
                                {seat.aisleAfter && <span className="aisle" />}
                              </Fragment>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
      <Legend />
    </div>
  );
}
