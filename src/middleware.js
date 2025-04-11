import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = ["/", "/profile", "/user/[id]"];
const publicRoutes = ["/login", "/register"];

export default async function middleware(req) {
  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) => {
    if (route.includes("[id]")) {
      const baseRoute = route.split("[id]")[0];
      return path.startsWith(baseRoute);
    }
    return path === route;
  });

  const isPublicRoute = publicRoutes.includes(path);

  const cookieStore = await cookies();
  const cookie = cookieStore.get("authToken")?.value;

  console.log("Middleware - Path:", path);
  console.log("Middleware - Is Protected Route:", isProtectedRoute);
  console.log("Middleware - Is Public Route:", isPublicRoute);
  console.log("Middleware - Token in Cookie:", cookie);

  if (isProtectedRoute && !cookie) {
    console.log("No token found, redirecting to /login");
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && cookie) {
    console.log("Token found, redirecting to /dashboard");
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register", "/profile/:path*", "/user/:path*"],
};
