import { auth } from "@/auth";

export default auth((req) => {
  const publicRoutes = ["/", "/forgot-password"];
  const publicPrefixes = ["/reset-password"]; 
  
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname) ||
    publicPrefixes.some(prefix => req.nextUrl.pathname.startsWith(prefix));

  if (!req.auth && !isPublicRoute) {
    const newUrl = new URL("/", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
  if (req.auth && req.nextUrl.pathname === "/") {
    const newUrl = new URL("/dashboard", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.webp$|.*\\.ico$).*)",
  ],
};
