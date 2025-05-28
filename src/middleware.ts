import { NextRequest, NextResponse } from "next/server";
import { ADMIN_PASSWORD, ADMIN_USERNAME } from "./lib/env";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;
  const isAuthenticated = btoa(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`) === token;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname === "/admin/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (pathname !== "/admin/login" && !isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
