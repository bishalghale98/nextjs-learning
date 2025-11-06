import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // ✅ If user is logged in — restrict access to auth pages
  if (
    token &&
    (pathname.startsWith("/sign-up") ||
      pathname.startsWith("/verify") ||
      pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ✅ If user is NOT logged in and tries to access protected routes
  if (
    !token &&
    (pathname.startsWith("/dashboard") || pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // ✅ Otherwise, allow the request to continue
  return NextResponse.next();
}

// ✅ Apply middleware to these routes
export const config = {
  matcher: ["/", "/sign-in", "/sign-up", "/dashboard/:path*", "/verify/:path*"],
};
