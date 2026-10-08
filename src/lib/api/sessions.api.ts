import { api } from "./server.api";

type SP = Record<string, string | string[] | undefined>;

const toArray = (v: string | string[] | undefined) =>
  v === undefined ? [] : Array.isArray(v) ? v : [v];

export function buildSessionsQuery(sp: SP) {
  const q = new URLSearchParams();

  for (const key of ["date", "search", "sort", "page"]) {
    const value = toArray(sp[key])[0];
    if (value) q.set(key, value);
  }
  for (const key of ["venues", "formats", "languages", "bands"]) {
    toArray(sp[key]).forEach((v) => q.append(`${key}[]`, v));
  }
  return q.toString();
}

export async function getSessions(sp: SP) {
  const res = await api<{ data: any, meta: any }>(`/sessions?${buildSessionsQuery(sp)}`, { cache: "no-store" })
  return res;
}

export async function getMovieSessionData(sp: SP, slug: string) {
  const res = await api<{ data: any }>(`/movies/${slug}/sessions?${buildSessionsQuery(sp)}`, { cache: "no-store" })
  return res.data;
}