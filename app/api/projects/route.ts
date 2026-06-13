import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifySession, SESSION_COOKIE } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function requireAdmin() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return await verifySession(token);
}

export async function GET() {
  try {
    const rows = await prisma.project.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const b = await req.json();
  if (!b.title || !b.category || !b.coverImage)
    return NextResponse.json({ error: "title, category, coverImage required" }, { status: 400 });

  let slug = b.slug ? slugify(b.slug) : slugify(b.title);
  const exists = await prisma.project.findUnique({ where: { slug } });
  if (exists) slug = `${slug}-${Date.now().toString(36)}`;

  const created = await prisma.project.create({
    data: {
      title: b.title,
      slug,
      category: b.category,
      description: b.description || "",
      coverImage: b.coverImage,
      liveUrl: b.liveUrl || null,
      repoUrl: b.repoUrl || null,
      tech: b.tech || null,
      year: b.year || null,
      featured: !!b.featured,
      published: b.published === false ? false : true,
      order: Number.isFinite(+b.order) ? +b.order : 0,
    },
  });
  return NextResponse.json(created, { status: 201 });
}
