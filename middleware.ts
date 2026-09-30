import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLogin = ["/admin/login","/admin/recovery"].includes(pathname);
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);

  if (pathname.startsWith("/admin")) {
    if (!session && !isLogin) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
