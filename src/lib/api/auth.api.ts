import { api } from "./server.api";

export async function GetMe(token: string) {
  try {
    const data = await api(`/me`, { token, method: "GET" },)
    return data;
  } catch (error: any) {
    // TODO: Temporary error handling, improve later.
    console.log(error.message)
    return null;
  }
}