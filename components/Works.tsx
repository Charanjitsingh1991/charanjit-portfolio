"use client";
import { useEffect, useMemo, useState } from "react";

type P = {
  id: number; title: string; slug: string; category: string; description: string;
  coverImage: string; liveUrl?: string | null; tech?: string | null; year?: string | null;
  published?: boolean;
};

const FILTERS = [
  ["all", "All"], ["web", "Websites & Apps"], ["design", "Branding & Design"],
  ["app", "Apps"], ["data", "Data"],
] as const;

export default function Works() {
  const [items, setItems] = useState<P[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d: P[]) => setItems(Array.isArray(d) ? d.filter((p) => p.published !== false) : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const present = useMemo(() => {
    const cats = new Set(items.map((i) => i.category));
    return FILTERS.filter(([k]) => k === "all" || cats.has(k));
  }, [items]);

  const shown = filter === "all" ? items : items.filter((i) => i.category === filter);

  return (
    <section id="works">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Selected work</span>
          <h2>Projects that <span className="tint">performed</span></h2>
          <p>Live work, pulled from my project database. New builds appear here automatically.</p>
        </div>

        {present.length > 1 && (
          <div className="filters">
            {present.map(([k, label]) => (
              <button key={k} className={"fbtn" + (filter === k ? " active" : "")} onClick={() => setFilter(k)}>
                {label}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="works-empty">Loading projects…</p>
        ) : shown.length === 0 ? (
          <p className="works-empty">No projects yet — add them from the admin panel.</p>
        ) : (
          <div className="works">
            {shown.map((p) => {
              const Card: any = p.liveUrl ? "a" : "div";
              return (
                <Card key={p.id} className="work" href={p.liveUrl || undefined}
                  target={p.liveUrl ? "_blank" : undefined} rel={p.liveUrl ? "noopener" : undefined}>
                  <div className="thumb"><img loading="lazy" src={p.coverImage} alt={p.title} /></div>
                  <div className="info">
                    <span className="cat">{(p.tech || p.category).split(",")[0]}{p.year ? ` · ${p.year}` : ""}</span>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
