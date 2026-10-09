"use server"
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

export async function updateProfile(payload: Record<string, string>) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return {
      ok: false as const,
      status: 401,
      body: { message: "Unauthenticated." },
    };
  }

  const formData = new FormData();
  for (const key of ["fullName", "mobileNumber", "dateOfBirth", "preferredVenueId"]) {
    formData.append(key, payload[key] ?? "");
  }

  try {
    const res = await api<{ data: unknown }>("/profile", {
      method: "PUT",
      body: formData,
      token,
    });
    return { ok: true as const, data: res.data };
  } catch (err) {
    if (err instanceof ApiError) {
      return { ok: false as const, status: err.status, body: err.body };
    }
    throw err;
  }
}