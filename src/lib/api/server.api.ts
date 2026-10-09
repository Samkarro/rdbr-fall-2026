const BASE_URL = "https://api.kinoxii.redberryinternship.ge/api";

type Options = Omit<RequestInit, "body"> & {
  token?: string;
  body?: BodyInit | null;
};

export class ApiError extends Error {
  constructor(public status: number, public body: any) {
    super(`Request failed: ${status}`);
  }
}


// Base API function handles the fetching in one place
export async function api<T>(
  path: string,
  { token, headers, body, ...rest }: Options,
) {
  const isFormData = body instanceof FormData;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    body,
    headers: {
      Accept: "application/json",
      // For FormData, fetch must set Content-Type itself so it can add the multipart boundary
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!res.ok && res.status !== 404) {
    throw new ApiError(res.status, await res.json().catch(() => null));
  }
  return res.json() as Promise<T>;
}