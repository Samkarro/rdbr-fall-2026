"use server"

import { cookies } from "next/headers";
import { api, ApiError } from "./server.api"
import { HoldResult, Order, seatHoldSchema, SeatMap, TicketType } from "./types/booking.types"


export const getMyTickets = async (type: "upcoming" | "past") => {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  const res = await api<{ data: Order[] }>(`/tickets?${type}`, { token })
  return res.data;
}

export const getSeatMap = async (sessionId: number) => {
  const res = await api<{ data: SeatMap }>(`/sessions/${sessionId}/seats`, {});

  return res.data;
}

// Booking operations
function firstFieldError(errors: unknown): string | null {
  if (!errors || typeof errors !== "object") return null;
  const first = Object.values(errors as Record<string, unknown>)[0];
  return Array.isArray(first) && typeof first[0] === "string" ? first[0] : null;
}

export async function holdSeats(
  sessionId: number | string,
  seats: { seatId: number; ticketType: TicketType }[],
): Promise<HoldResult> {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return { ok: false, status: 401, message: "Please sign in to continue." };
  }

  try {
    const data = await api<any>(`/sessions/${sessionId}/holds`, {
      method: "POST",
      body: JSON.stringify({ seats }),
      token,
    });

    const parsed = seatHoldSchema.safeParse(data?.data ?? data);
    return parsed.success
      ? { ok: true, hold: parsed.data }
      : { ok: false, status: 500, message: "Unexpected response from the server." };
  } catch (err) {
    if (!(err instanceof ApiError)) {
      return { ok: false, status: 0, message: "Couldn't reach the server. Please try again." };
    }

    const body = err.body as any;

    if (err.status === 409) {
      const contested = Array.isArray(body?.contested) ? body.contested.map(String) : [];
      return {
        ok: false,
        status: 409,
        contested,
        message: body?.message ?? "Some of your seats were just taken.",
      };
    }

    if (err.status === 422) {
      return {
        ok: false,
        status: 422,
        message: firstFieldError(body?.errors) ?? body?.message ?? "Couldn't hold these seats.",
      };
    }

    return {
      ok: false,
      status: err.status,
      message: body?.message ?? "Something went wrong. Please try again.",
    };
  }
}