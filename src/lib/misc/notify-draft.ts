const KEY = "kino:notify-draft";
const TTL_MS = 2 * 60 * 1000; // the login flow is quick, so this can't fire "much later"

export function savePendingNotify(slug: string) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ slug, savedAt: Date.now() }));
  } catch { }
}

export function takePendingNotify(slug: string): boolean {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return false;
    const entry = JSON.parse(raw) as { slug: string; savedAt: number };
    if (entry.slug !== slug) return false;
    sessionStorage.removeItem(KEY);
    return Date.now() - entry.savedAt <= TTL_MS;
  } catch {
    return false;
  }
}