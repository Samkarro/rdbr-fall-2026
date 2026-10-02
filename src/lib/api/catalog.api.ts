import { api } from "./server.api";

export async function searchFilms(query: string, signal: AbortSignal) {
  const res = await api(`/search?q=${encodeURIComponent(query)}`, { signal });
  return res;
}