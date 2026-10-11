import type { SelectedTicket, TicketType } from "@/lib/api/types/booking.types";

const RATIOS: Record<TicketType, number> = {
  adult: 100,
  student: 75,
  child: 60,
};

export function calculateSubtotal(
  tickets: SelectedTicket[],
  basePrice: number,
): number {
  const total = tickets.reduce(
    (sum, { type }) => sum + Math.round(basePrice * RATIOS[type]),
    0,
  );
  return total / 100;
}

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function formatTicketCounts(labels: string[]): string {
  const counts = new Map<string, number>();
  labels.forEach((label) => counts.set(label, (counts.get(label) ?? 0) + 1));
  return [...counts].map(([label, count]) => `${count} x ${label}`).join(", ");
}