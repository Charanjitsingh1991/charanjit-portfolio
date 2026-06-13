import { prisma } from "./prisma";
import type { Project } from "@prisma/client";

export type { Project };

export function projectToView(p: Project) {
  return {
    ...p,
    techList: (p.tech || "").split(",").map((t) => t.trim()).filter(Boolean),
  };
}

export async function getPublishedProjects() {
  try {
    const rows = await prisma.project.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return rows.map(projectToView);
  } catch (e) {
    console.error("DB unavailable, returning empty project list:", e);
    return [];
  }
}
