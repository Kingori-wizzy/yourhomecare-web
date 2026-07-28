import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PORTAL_PATHS = ["/portal/login", "/portal/forgot-password", "/portal/reset-password"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = NextResponse.next();

  // Security headers for all responses
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // Redirect legacy /admin to /portal
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/admin/, "/portal");
    return NextResponse.redirect(url);
  }

  const isPortal = pathname.startsWith("/portal");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isPublicPortal = PUBLIC_PORTAL_PATHS.some((p) => pathname.startsWith(p));

  if (isPortal || isAdminApi) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }

  if ((isPortal && !isPublicPortal) || isAdminApi) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET ?? "development-secret",
    });

    if (!token) {
      if (isAdminApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/portal/login";
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = String(token.role ?? "");
    const allowed =
      role === "super_admin" ||
      role === "administrator" ||
      role === "admin" ||
      role === "operations" ||
      role === "hr" ||
      role === "marketing" ||
      role === "content_manager" ||
      role === "read_only" ||
      role === "care_manager" ||
      role === "staff";

    if (!allowed) {
      if (isAdminApi) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/portal/login";
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*", "/api/admin/:path*"],
};
