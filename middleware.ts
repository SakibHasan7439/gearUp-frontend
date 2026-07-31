import { NextRequest, NextResponse } from "next/server";

const roleRoutePrefix: Record<string, string> = {
  ADMIN: "/dashboard/admin",
  PROVIDER: "/dashboard/provider",
  CUSTOMER: "/dashboard/customer",
};

function decodeJwtPayload(token: string): { role?: string } | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (isDashboardRoute && !accessToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isDashboardRoute && accessToken) {
    const decoded = decodeJwtPayload(accessToken);
    const role = decoded?.role;
    const allowedPrefix = role ? roleRoutePrefix[role] : undefined;

    if (allowedPrefix && !pathname.startsWith(allowedPrefix)) {
      return NextResponse.redirect(new URL(allowedPrefix, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};