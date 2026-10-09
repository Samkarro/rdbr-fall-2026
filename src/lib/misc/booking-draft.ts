import { SelectedTicket } from "@/app/movies/[movie]/(components)/booking-content";
import { MAX_SEATS } from "@/app/movies/[movie]/(components)/seat-picker";
import type { Seat, SeatMap, TicketType } from "@/lib/api/types/booking.types";


const TTL_MS = 30 * 60 * 1000;
const TICKET_TYPES: TicketType[] = ["adult", "student", "child"];
const key = (sessionId: string | number) => `kino:booking-draft:${sessionId}`;

type Draft = {
  savedAt: number;
  tickets: { seatId: Seat["id"]; type: TicketType }[];
};

export function saveDraft(sessionId: string | number, tickets: SelectedTicket[]) {
  try {
    const draft: Draft = {
      savedAt: Date.now(),
      tickets: tickets.map(({ seat, type }) => ({ seatId: seat.id, type })),
    };
    sessionStorage.setItem(key(sessionId), JSON.stringify(draft));
  } catch { }
}

export function clearDraft(sessionId: string | number) {
  try {
    sessionStorage.removeItem(key(sessionId));
  } catch { }
}

export function restoreDraft(
  sessionId: string | number,
  seatMap: SeatMap,
): SelectedTicket[] {
  try {
    const raw = sessionStorage.getItem(key(sessionId));
    if (!raw) return [];
    const draft = JSON.parse(raw) as Draft;
    if (!draft || Date.now() - draft.savedAt > TTL_MS || !Array.isArray(draft.tickets)) {
      clearDraft(sessionId);
      return [];
    }

    const seats = new Map<Seat["id"], Seat>();
    seatMap.sections.forEach((s) =>
      s.rows.forEach((r) => r.seats.forEach((seat) => seats.set(seat.id, seat))),
    );

    const seen = new Set<Seat["id"]>();
    const result: SelectedTicket[] = [];
    for (const { seatId, type } of draft.tickets) {
      const seat = seats.get(seatId);
      if (!seat || seat.state !== "available" || seen.has(seatId)) continue;
      if (!TICKET_TYPES.includes(type)) continue;
      seen.add(seatId);
      result.push({ seat, type });
      if (result.length === MAX_SEATS) break;
    }
    return result;
  } catch {
    return [];
  }
}