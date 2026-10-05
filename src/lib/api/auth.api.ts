"use server"
import { cookies } from "next/headers";
import { api, ApiError } from "./server.api";
import { cache } from "react";
import { User } from "./types/user.types";

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

export async function authenticate(
  mode: "login" | "signup",
  payload: Record<string, string>,
) {
  try {
    const res = await api<{ token: string }>(
      mode === "signup" ? "/register" : "/login",
      { method: "POST", body: JSON.stringify(payload) },
    );

    (await cookies()).set("token", res.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { ok: true };
  } catch (err) {
    if (err instanceof ApiError) return { ok: false, body: err.body };
    throw err;
  }
}

export async function logout() {
  (await cookies()).delete("token");
}