"use client";

import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  Seat,
  SeatMap,
  SeatRow,
  SeatSection,
  TicketType,
} from "@/lib/api/types/booking.types";
import { SelectedTicket } from "./booking-content";
import "./styles/seat-picker.styles.css";
import {
  TransformComponent,
  TransformWrapper,
  useControls,
} from "react-zoom-pan-pinch";

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
  selectedTickets,
  setSelectedTickets,
}: {
  seatMap: SeatMap;
  selectedTickets: SelectedTicket[];
  setSelectedTickets: Dispatch<SetStateAction<SelectedTicket[]>>;
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
    setSelectedTickets((prev) => {
      const next = prev.filter(
        ({ seat }) => seatsById.get(seat.id)?.state === "available",
      );

      return next.length === prev.length ? prev : next;
    });
  }, [seatsById, setSelectedTickets]);

  const handleSeatClick = (e: React.MouseEvent, seat: Seat) => {
    const start = pointerDown.current;

    if (
      start &&
      Math.hypot(e.clientX - start.x, e.clientY - start.y) > DRAG_THRESHOLD_PX
    ) {
      return;
    }

    setSelectedTickets((prev) => {
      if (prev.some((ticket) => ticket.seat.id === seat.id)) {
        return prev.filter((ticket) => ticket.seat.id !== seat.id);
      }

      if (prev.length >= MAX_SEATS) return prev;

      return [...prev, { seat, type: "adult" as TicketType }];
    });
  };

  return (
    <div className="seat-picker-left-container">
      <div className="seat-map-view">
        <TransformWrapper
          minScale={0.6}
          maxScale={0.8}
          initialScale={0.8}
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
                                    selectedTickets.some(
                                      (el) => el.seat.id === seat.id,
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
