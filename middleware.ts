import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// ==========================================
// Path Constants
// ==========================================
const PUBLIC_PATHS = [
  "/",
  "/about",
  "/academics",
  "/admissions",
  "/admissions/apply",
  "/blog",
  "/contact",
  "/events",
  "/faculty",
  "/faq",
  "/gallery",
  "/news",
  "/notice-board",
  "/results",
  "/privacy-policy",
  "/terms",
];

const API_PUBLIC_PATHS = [
  "/api/auth",
  "/api/contact",
  "/api/subscribe",
  "/api/admissions",
];

// ==========================================
// Helper Functions
// ==========================================
function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  
  if (
    pathname.startsWith("/news/") ||
    pathname.startsWith("/blog/") ||
    pathname.startsWith("/events/") ||
    pathname.startsWith("/gallery/")
  ) {
    return true;
  }

  if (API_PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return true;

  if (
    pathname.startsWith("/_next") ||
    (pathname.startsWith("/api") === false &&
      (pathname.includes(".") ||
        pathname.startsWith("/images/") ||
        pathname.startsWith("/icons/") ||
        pathname.startsWith("/favicon.ico") ||
        pathname.startsWith("/manifest.json") ||
        pathname.startsWith("/robots.txt") ||
        pathname.startsWith("/sitemap.xml") ||
        pathname.startsWith("/sw.js")))
  ) {
    return true;
  }

  return false;
}

// ==========================================
// Middleware Handler
// ==========================================
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // 1. نیکسٹ آتھ کے اپنے اندرونی API روٹس کو فوراً بائی پاس کریں تاکہ لاگ ان لوپ نہ بنے
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // 2. ایڈمن لاگ ان پیج کی پروٹیکشن
  const isAdminLogin = pathname === "/admin/login";
  if (isAdminLogin) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return applySecurityHeaders(NextResponse.next());
  }

  // 3. پروٹیکٹڈ ایڈمن روٹس (UI)
  const isAdminRoute = pathname.startsWith("/admin");
  if (isAdminRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return applySecurityHeaders(NextResponse.next());
  }

  // 4. پروٹیکٹڈ API روٹس کی پروٹیکشن
  const isApiRoute = pathname.startsWith("/api");
  if (isApiRoute && !isPublicPath(pathname)) {
    if (!isLoggedIn) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  // 5. ڈیولپمنٹ لاگنگ
  if (process.env.NODE_ENV === "development") {
    console.log(
      `📝 ${req.method} ${pathname} | Auth: ${isLoggedIn ? "✅" : "❌"} | Role: ${userRole || "N/A"}`
    );
  }

  return applySecurityHeaders(NextResponse.next());
});

// ==========================================
// Helper to Apply Security Headers Safely
// ==========================================
function applySecurityHeaders(response: NextResponse) {
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return response;
}

// ==========================================
// Matcher Configuration
// ==========================================
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)",
  ],
};
