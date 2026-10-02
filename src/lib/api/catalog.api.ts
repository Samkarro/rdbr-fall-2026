import { api } from "./server.api";
import { Movie } from "./types/movie.types";

export async function searchFilms(query: string, signal: AbortSignal) {
  const res = await api<{ data: Movie[] }>(`/search?q=${encodeURIComponent(query)}`, { signal });
  return res.data;
}