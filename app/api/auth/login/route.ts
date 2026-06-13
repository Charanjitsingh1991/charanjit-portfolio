import { NextResponse } from "next/server";
import { verifyCredentials } from "@/lib/credentials";
import { createSession, SESSION_COOKIE } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password)
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });

  const ok = await verifyCredentials(email, password);
  if (!ok)
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

  const token = await createSession(email);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
