"use server"
import { cache } from "react";
import { api, ApiError } from "./server.api";
import { Movie, MovieDetail, movieDetailSchema } from "./types/movie.types";
import { cookies } from "next/headers";
import { NotifyResult } from "../components/homepage/notify-button";

export async function searchFilms(query: string) {
  const { data: searchResults } = await api<{ data: Movie[] }>(`/search?q=${encodeURIComponent(query)}`, {});
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

export async function getComingSoon(limit?: number, token?: string): Promise<Movie[]> {
  const { data: comingSoon } = await api<{ data: Movie[] }>(
    `/movies/coming-soon${limit && limit > 0 ? `?limit=${limit}` : ""}`,
    { token }
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
  const { data } = await api<{ data: any }>("/filter-options", { next: { tags: ["filter-options"] } })
  return data;
})

export async function notifyMe(movieSlug: string): Promise<NotifyResult> {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return { ok: false, status: 401, message: "Please sign in to continue." };
  }

  try {
    const res = await api<any>(`/movies/${movieSlug}/notify`, {
      method: "POST",
      token,
    });


    if (res?.data?.subscribed === true) return { ok: true };
    return { ok: false, status: 404, message: res?.message ?? "Couldn't subscribe. Please try again." };
  } catch (err) {
    if (err instanceof ApiError) {
      const body = err.body as any;
      return {
        ok: false,
        status: err.status,
        message: body?.message ?? "Something went wrong. Please try again.",
      };
    }
    return { ok: false, status: 0, message: "Couldn't reach the server. Please try again." };
  }
}