import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // ✅ Logged-in users should not access auth pages
  if (
    token &&
    (pathname.startsWith("/sign-in") ||
     pathname.startsWith("/sign-up") ||
     pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ✅ Not logged-in users should not access protected routes
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ✅ Otherwise continue
  return NextResponse.next();
}

// ✅ Apply middleware to these routes
export const config = {
  matcher: ["/", "/sign-in", "/sign-up", "/dashboard/:path*", "/verify/:path*"],
};
