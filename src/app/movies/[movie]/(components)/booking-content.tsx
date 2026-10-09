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

  return <div className="booking-modal-content"></div>;
}
