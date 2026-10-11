"use server"
import { cookies } from "next/headers";
import { api, ApiError } from "./server.api";
import { Order, orderSchema } from "./types/booking.types";

export type RefundResult =
  | { ok: true; order: Order | null }
  | { ok: false; status: number; message: string };


export async function refundOrder(orderReference: string): Promise<RefundResult> {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return { ok: false, status: 401, message: "Please sign in to continue." };
  }

  try {
    const data = await api<any>(`/orders/${orderReference}/refund`, {
      method: "POST",
      token,
    });

    const parsed = orderSchema.safeParse(data?.data ?? data);
    if (!parsed.success) console.error("Refund response failed validation", parsed.error.issues);

    return { ok: true, order: parsed.success ? parsed.data : null };
  } catch (err) {
    if (!(err instanceof ApiError)) {
      return { ok: false, status: 0, message: "Couldn't reach the server. Please try again." };
    }
    const body = err.body as any;
    return {
      ok: false,
      status: err.status,
      message: body?.message ?? "Refund failed. Please try again.",
    };
  }
}