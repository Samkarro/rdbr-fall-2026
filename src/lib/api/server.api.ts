const BASE_URL = "https://api.kinoxii.redberryinternship.ge/api";

type Options = RequestInit & { token?: string };

// Base API function handles the fetching in one place
export async function api<T>(path: string, { token, headers, ...rest }: Options) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  // Temporary basic error handling TODO: implement custom handling
  if (!res.ok && res.status !== 404) throw new Error(await res.json().catch(() => null));
  return res.json() as Promise<T>;
}