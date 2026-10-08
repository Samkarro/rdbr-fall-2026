"use server"
import { cookies } from "next/headers";
import { api, ApiError } from "./server.api";

export async function authenticate(
  mode: "login" | "signup",
  payload: Record<string, string>,
) {
  try {
    const res = await api<{ data: { token: string } }>(
      mode === "signup" ? "/register" : "/login",
      { method: "POST", body: JSON.stringify(payload) },
    );

    (await cookies()).set("token", res.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { ok: true };
  } catch (err) {
    if (err instanceof ApiError) {
      return { ok: false as const, status: err.status, body: err.body };
    }
    throw err;
  }
}

export async function logout() {
  (await cookies()).delete("token");
}