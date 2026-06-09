import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/auth-core";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    const session = await getAdminSessionFromRequest(request);
    if (session) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/admin") {
    const session = await getAdminSessionFromRequest(request);
    return NextResponse.redirect(
      new URL(session ? "/admin/dashboard" : "/admin/login", request.url)
    );
  }

  if (pathname.startsWith("/admin")) {
    const session = await getAdminSessionFromRequest(request);
    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
