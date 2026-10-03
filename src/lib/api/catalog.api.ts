import { api } from "./server.api";
import { Movie, MovieDetail, movieDetailSchema } from "./types/movie.types";

export async function searchFilms(query: string, signal: AbortSignal) {
  const res = await api<{ data: Movie[] }>(`/search?q=${encodeURIComponent(query)}`, { signal });
  return res.data;
}

export async function getFeaturedTitles(): Promise<MovieDetail[]> {
  const { data: featured } = await api<{ data: Movie[] }>("/movies/featured", {
    next: { revalidate: 300 },
  });

  const results = await Promise.allSettled(
    featured.map(async (movie) => {
      const res = await api<{ data: unknown }>(`/movies/${movie.slug}`, {
        next: { revalidate: 300 },
      });
      return movieDetailSchema.parse(res.data);
    })
  );

  return results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
}