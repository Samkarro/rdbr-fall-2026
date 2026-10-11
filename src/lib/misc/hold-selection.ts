import type { SeatHold, SelectedTicket } from "@/lib/api/types/booking.types";

export function selectionMatchesHold(
  hold: SeatHold | null,
  tickets: SelectedTicket[],
): boolean {
  if (!hold || hold.seats.length !== tickets.length) return false;

  const held = new Map(hold.seats.map((s) => [s.seatId, s.ticketType.slug]));
  return tickets.every(({ seat, type }) => held.get(seat.id) === type);
}