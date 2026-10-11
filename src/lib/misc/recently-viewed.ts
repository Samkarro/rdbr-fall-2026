const KEY = "kino:recently-viewed";
const MAX = 10;

export type RecentMovie = {
  slug: string;
  title: string;
  genre: string;
  runtimeMins: number;
  posterUrl: string;
  ageRating: string;
}

export function getRecent(): RecentMovie[] {
  try {

    const recent = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    console.log("get recent called, ", recent)

    return recent;
  } catch {
    return [];
  }
}

export function addRecent(movie: RecentMovie) {
  const next = [movie, ...getRecent().filter((s) => s.slug !== movie.slug)].slice(0, MAX);
  console.log("add recent called, ", next)
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch (e) {
    console.error("addRecent failed", e);
  }
}