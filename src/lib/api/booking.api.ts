"use server"

import { cookies } from "next/headers";
import { api, ApiError } from "./server.api"
import { FieldErrors, HoldResult, Order, OrderResult, orderSchema, SeatHold, seatHoldSchema, SeatMap, TicketType } from "./types/booking.types"

export type HoldLookup =
  | { status: "live"; hold: SeatHold }
  | { status: "expired" }
  | { status: "gone" };

export const getMyTickets = async (type: "upcoming" | "past") => {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  const res = await api<{ data: Order[] }>(`/tickets?${type}`, { token })
  return res.data;
}

export const getSeatMap = async (sessionId: number, token?: string) => {
  const res = await api<{ data: SeatMap }>(`/sessions/${sessionId}/seats`, { token, cache: "no-store" });
  return res.data;
}

// Booking operations
function firstFieldError(errors: unknown): string | null {
  if (!errors || typeof errors !== "object") return null;
  const first = Object.values(errors as Record<string, unknown>)[0];
  return Array.isArray(first) && typeof first[0] === "string" ? first[0] : null;
}

function toFieldErrors(errors: unknown): FieldErrors {
  if (!errors || typeof errors !== "object") return {};
  return Object.fromEntries(
    Object.entries(errors as Record<string, unknown>).flatMap(([key, value]) => {
      const msg = Array.isArray(value) ? value[0] : value;
      return typeof msg === "string" ? [[key, msg]] : [];
    }),
  );
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

export async function getHold(holdId: string): Promise<HoldLookup> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return { status: "gone" };

  try {
    const data = await api<{ data: SeatHold }>(`/holds/${holdId}`, { token });
    const parsed = seatHoldSchema.safeParse(data?.data ?? data);

    // 404 is unhandled so any uncaught fail means the hold is not found
    if (!parsed.success) return { status: "gone" };

    const hold = parsed.data;
    const live = hold.isLive && new Date(hold.expiresAt).getTime() > Date.now();
    return live ? { status: "live", hold } : { status: "expired" };
  } catch {
    return { status: "gone" };
  }
}

export async function releaseHold(holdId: string): Promise<void> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return;

  try {
    await api(`/holds/${holdId}`, { token, method: "DELETE" });
  } catch (error) { }
}

export async function submitOrder(
  holdId: string,
  formData: FormData,
): Promise<OrderResult> {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return { ok: false, status: 401, message: "Please sign in to continue." };
  }

  const field = (key: string) => String(formData.get(key) ?? "").trim();

  try {
    const data = await api<any>("/orders", {
      method: "POST",
      token,
      body: JSON.stringify({
        holdId,
        fullName: field("fullName"),
        email: field("email"),
        mobileNumber: field("mobileNumber"),
        cardNumber: field("cardNumber"),
        expiry: field("expiry"),
        cvv: field("cvv"),
      }),
    });

    const parsed = orderSchema.safeParse(data?.data ?? data);
    return parsed.success
      ? { ok: true, order: parsed.data }
      : { ok: false, status: 500, message: parsed.error.message };
  } catch (err) {
    if (!(err instanceof ApiError)) {
      return { ok: false, status: 0, message: "Couldn't reach the server. Please try again." };
    }

    const body = err.body as any;

    if (err.status === 409) {
      return {
        ok: false,
        status: 409,
        message: body?.message ?? "Some of your seats were just taken.",
        contested: Array.isArray(body?.contested) ? body.contested.map(String) : [],
      };
    }

    return {
      ok: false,
      status: err.status,
      message: body?.message ?? "Payment failed. Please try again.",
      fieldErrors: err.status === 422 ? toFieldErrors(body?.errors) : undefined,
    };
  }
}