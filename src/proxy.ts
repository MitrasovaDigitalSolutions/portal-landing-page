import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

const SUPERADMIN_PATHS = ["/sites", "/users"];

function isSuperadminOnlyPath(pathname: string): boolean {
  return SUPERADMIN_PATHS.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export const proxy = auth((request): NextResponse => {
  const { pathname, search } = request.nextUrl;
  const session = request.auth;
  const isAuthenticated = Boolean(session?.accessToken);

  if (pathname === "/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    const callbackTarget = `${pathname}${search}`;
    if (callbackTarget && callbackTarget !== "/") {
      loginUrl.searchParams.set("callbackUrl", callbackTarget);
    }
    return NextResponse.redirect(loginUrl);
  }

  if (isSuperadminOnlyPath(pathname) && !session?.user.is_superadmin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api/auth|api/media|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
