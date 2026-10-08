import { NextResponse, type NextRequest } from "next/server";
import { api, ApiError } from "@/lib/api/server.api";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) return NextResponse.next();
  try {
    await api("/me", { token, signal: AbortSignal.timeout(3000) });
    return NextResponse.next();
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      request.cookies.delete("token");
      const response = NextResponse.next({
        request: { headers: request.headers },
      });
      response.cookies.delete("token");
      return response;
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|.*\\..*).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};