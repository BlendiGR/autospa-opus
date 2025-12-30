import { auth } from "@/auth";

/** Routes accessible without authentication */
const publicRoutes = ["/", "/forgot-password", "/test-auth"];

/** Route prefixes accessible without authentication */
const publicPrefixes = ["/reset-password"];

/** Auth middleware - redirects unauthenticated users to login, authenticated users away from login */
export default auth((req) => {
  const isPublicRoute =
    publicRoutes.includes(req.nextUrl.pathname) ||
    publicPrefixes.some((prefix) => req.nextUrl.pathname.startsWith(prefix));

  // Redirect to login if not authenticated and accessing protected route
  if (!req.auth && !isPublicRoute) {
    const newUrl = new URL("/", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  // Redirect to dashboard if authenticated and accessing login page
  if (req.auth && req.nextUrl.pathname === "/") {
    const newUrl = new URL("/dashboard", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

/** Matcher config - excludes static assets from middleware */
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.webp$|.*\\.ico$).*)",
  ],
};
