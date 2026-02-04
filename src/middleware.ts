import NextAuth from "next-auth";
// Middleware Config
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

export default NextAuth(authConfig).auth((req) => {
    const isLoggedIn = !!req.auth;
    const isOnAuthPage = req.nextUrl.pathname.startsWith("/auth");
    const isOnPublicPage = req.nextUrl.pathname === "/" ||
        req.nextUrl.pathname.startsWith("/landing") ||
        req.nextUrl.pathname.startsWith("/api") ||
        req.nextUrl.pathname.startsWith("/about") ||
        req.nextUrl.pathname.startsWith("/privacy") ||
        req.nextUrl.pathname.startsWith("/terms") ||
        req.nextUrl.pathname.startsWith("/contact");



    // Redirect logged-in users away from auth pages
    if (isOnAuthPage && isLoggedIn) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Redirect unauthenticated users to signin page (protect all other routes)
    if (!isLoggedIn && !isOnAuthPage && !isOnPublicPage) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
