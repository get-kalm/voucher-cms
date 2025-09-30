import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";

export async function middleware(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json(
      { success: false, message: "missing authorization" },
      { status: 500 }
    );
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, message: "missing authorization" },
      { status: 500 }
    );
  }

  const token = authHeader.split(" ")[1];
  
  const payload = await verifyJwt<{ id: string; email: string }>(token);

  if (!payload) {
    return NextResponse.json(
      { success: false, message: "invalid authorization" },
      { status: 500 }
    );
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", payload.id);
  requestHeaders.set("x-user-email", payload.email);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/api/internal/:path*", "/api/admin/:path*"],
};
