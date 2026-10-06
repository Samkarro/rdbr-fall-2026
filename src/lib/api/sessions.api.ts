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
  console.log(sp)
  const res = await api<{ data: any }>(`/sessions?${buildSessionsQuery(sp)}`, {})
  return res.data;
}