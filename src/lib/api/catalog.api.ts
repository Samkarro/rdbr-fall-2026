import { cache } from "react";
import { api } from "./server.api";
import { Movie, MovieDetail, movieDetailSchema } from "./types/movie.types";

export async function searchFilms(query: string, signal: AbortSignal) {
  const { data: searchResults } = await api<{ data: Movie[] }>(`/search?q=${encodeURIComponent(query)}`, { signal });
  return searchResults;
}

export async function getFeaturedTitles(): Promise<Movie[]> {
  const { data: featured } = await api<{ data: Movie[] }>("/movies/featured", {});
  return featured;
}

export async function getNowPlaying(limit?: number): Promise<Movie[]> {
  const { data: nowPlaying } = await api<{ data: Movie[] }>(
    `/movies/now-playing${limit && limit > 0 ? `?limit=${limit}` : ""}`,
    {}
  );
  return nowPlaying;
}

export async function getComingSoon(limit?: number): Promise<Movie[]> {
  const { data: comingSoon } = await api<{ data: Movie[] }>(
    `/movies/coming-soon${limit && limit > 0 ? `?limit=${limit}` : ""}`,
    {}
  );
  return comingSoon;
}

export const getMovieDetail = async (slug: string): Promise<MovieDetail> => {
  const { data: movieDetail } = await api<{ data: MovieDetail }>(
    `/movies/${slug}`,
    {}
  );

  return movieDetail;
}

export const getFilterOptions = cache(async () => {
  const { data } = await api<{ data: any }>("/filter-options", { next: { revalidate: 3600, tags: ["filter-options"] } })
  return data;
})