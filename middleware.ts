import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json(
      { success: false, message: "missing authorization" },
      { status: 401 }
    );
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, message: "missing authorization" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  const payload = await verifyJwt<{ id: string; email: string; role: string }>(
    token
  );

  if (!payload) {
    return NextResponse.json(
      { success: false, message: "invalid authorization" },
      { status: 401 }
    );
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", payload.id);
  requestHeaders.set("x-user-email", payload.email);
  requestHeaders.set("x-user-role", payload.role);
  requestHeaders.set("x-user-token", token);

  // Check role
  if (req.nextUrl.pathname.startsWith("/api/admin")) {
    if (!payload.role) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (payload.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/api/internal/:path*", "/api/admin/:path*"],
};