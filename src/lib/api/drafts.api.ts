import { SelectedTicket } from "@/app/movies/[movie]/(components)/booking-content";
import { Seat, SeatHold, SeatMap, TicketType } from "./types/booking.types";

const holdKey = (sessionId: string | number) => `kino:hold:${sessionId}`;

export const saveHoldId = (sessionId: string | number, holdId: string) => {
  try { sessionStorage.setItem(holdKey(sessionId), holdId); } catch { }
};
export const loadHoldId = (sessionId: string | number) => {
  try { return sessionStorage.getItem(holdKey(sessionId)); } catch { return null; }
};
export const clearHoldId = (sessionId: string | number) => {
  try { sessionStorage.removeItem(holdKey(sessionId)); } catch { }
};

export function ticketsFromHold(hold: SeatHold, seatMap: SeatMap): SelectedTicket[] {
  const seats = new Map<Seat["id"], Seat>();
  seatMap.sections.forEach((s) =>
    s.rows.forEach((r) => r.seats.forEach((seat) => seats.set(seat.id, seat))),
  );
  return hold.seats.flatMap(({ seatId, ticketType }) => {
    const seat = seats.get(seatId);
    return seat ? [{ seat, type: ticketType.slug as TicketType }] : [];
  });
}