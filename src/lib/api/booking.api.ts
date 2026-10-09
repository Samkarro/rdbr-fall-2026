"use server"

import { cookies } from "next/headers";
import { api } from "./server.api"
import { Order, SeatMap } from "./types/booking.types"


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