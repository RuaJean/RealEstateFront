import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPaths = ["/", "/login", "/register"];
  const isPublicPath = publicPaths.includes(pathname);
  const token = request.cookies.get("accessToken")?.value;
  const role = request.cookies.get("role")?.value || "";

  if (!isPublicPath && !token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Rutas admin
  const adminOnly = [
    "/dashboard",
    "/owners",
    "/owners/new",
    "/properties/new",
  ];
  if (adminOnly.some((r) => pathname === r || pathname.startsWith(r + "/"))) {
    if (role.toLowerCase() !== "admin") {
      const url = new URL("/", request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};


