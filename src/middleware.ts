import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPaths = ["/", "/login", "/register"];
  const isPublicPath = publicPaths.includes(pathname);
  const token = request.cookies.get("accessToken")?.value;

  // Redirecciones específicas para la ruta raíz
  if (pathname === "/") {
    if (token) {
      const url = new URL("/dashboard", request.url);
      return NextResponse.redirect(url);
    }
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  if (!isPublicPath && !token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Sin roles: cualquier usuario autenticado puede acceder a todo

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};


