// lib/api/user.ts  (no "use server")
import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { api, ApiError } from "./server.api";
import type { User } from "./types/user.types";

export const getMe = cache(async () => {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  try {
    const res = await api<{ data: User }>("/me", { token });
    return res.data;
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
});