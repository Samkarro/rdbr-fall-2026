import { api } from "./server.api";
import { Movie, MovieDetail, movieDetailSchema } from "./types/movie.types";

export async function searchFilms(query: string, signal: AbortSignal) {
  const res = await api<{ data: Movie[] }>(`/search?q=${encodeURIComponent(query)}`, { signal });
  return res.data;
}

export async function getFeaturedTitles(): Promise<Movie[]> {
  const { data: featured } = await api<{ data: Movie[] }>("/movies/featured", {});
  return featured;
}