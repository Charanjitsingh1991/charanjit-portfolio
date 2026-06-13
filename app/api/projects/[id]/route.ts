import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifySession, SESSION_COOKIE } from "@/lib/session";

export const runtime = "nodejs";

async function requireAdmin() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return await verifySession(token);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = Number(params.id);
  const b = await req.json();
  const updated = await prisma.project.update({
    where: { id },
    data: {
      title: b.title,
      category: b.category,
      description: b.description ?? "",
      coverImage: b.coverImage,
      liveUrl: b.liveUrl || null,
      repoUrl: b.repoUrl || null,
      tech: b.tech || null,
      year: b.year || null,
      featured: !!b.featured,
      published: b.published !== false,
      order: Number.isFinite(+b.order) ? +b.order : 0,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.project.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}
