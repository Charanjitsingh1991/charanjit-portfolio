"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type P = {
  id?: number; title: string; slug?: string; category: string; description: string;
  coverImage: string; liveUrl?: string; repoUrl?: string; tech?: string; year?: string;
  featured?: boolean; published?: boolean; order?: number;
};

const EMPTY: P = {
  title: "", category: "web", description: "", coverImage: "",
  liveUrl: "", repoUrl: "", tech: "", year: "", featured: false, published: true, order: 0,
};

const CATS = [["web", "Website / App"], ["design", "Branding / Design"], ["app", "Mobile App"], ["data", "Data / Analytics"], ["other", "Other"]];

export default function Admin() {
  const [items, setItems] = useState<P[]>([]);
  const [form, setForm] = useState<P>(EMPTY);
  const [editId, setEditId] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ t: "ok" | "err"; m: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const load = useCallback(() => {
    fetch("/api/projects").then((r) => r.json()).then((d) => setItems(Array.isArray(d) ? d : []));
  }, []);
  useEffect(() => { load(); }, [load]);

  const set = (k: keyof P) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const v = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((s) => ({ ...s, [k]: v }));
  };

  const reset = () => { setForm(EMPTY); setEditId(null); };

  const save = async () => {
    setMsg(null);
    if (!form.title || !form.coverImage) { setMsg({ t: "err", m: "Title and cover image are required." }); return; }
    setBusy(true);
    try {
      const url = editId ? `/api/projects/${editId}` : "/api/projects";
      const method = editId ? "PUT" : "POST";
      const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!r.ok) { const d = await r.json().catch(() => ({})); setMsg({ t: "err", m: d.error || "Save failed" }); }
      else { setMsg({ t: "ok", m: editId ? "Project updated." : "Project added — it's live on the site." }); reset(); load(); }
    } catch { setMsg({ t: "err", m: "Network error" }); }
    finally { setBusy(false); }
  };

  const edit = (p: P) => {
    setEditId(p.id!);
    setForm({ ...EMPTY, ...p, liveUrl: p.liveUrl || "", repoUrl: p.repoUrl || "", tech: p.tech || "", year: p.year || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const del = async (id: number) => {
    if (!confirm("Delete this project permanently?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    load();
  };

  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.replace("/admin/login"); router.refresh(); };

  return (
    <div className="admin-shell">
      <div className="wrap">
        <div className="admin-head">
          <h1>Projects admin</h1>
          <div style={{ display: "flex", gap: 12 }}>
            <a className="btn ghost" href="/" target="_blank">View site ↗</a>
            <button className="btn ghost" onClick={logout}>Sign out</button>
          </div>
        </div>

        <div className="admin-grid">
          <div className="panel">
            <h2>{editId ? "Edit project" : "Add a project"}</h2>
            <div className="fld"><label>Title *</label><input value={form.title} onChange={set("title")} placeholder="My new app" /></div>
            <div className="row-2">
              <div className="fld"><label>Category</label>
                <select value={form.category} onChange={set("category")} className="" style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--line2)", borderRadius: "var(--r-sm)", color: "var(--text)", padding: "13px 15px", fontFamily: "var(--ff-b)", fontSize: "14.5px" }}>
                  {CATS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div className="fld"><label>Year</label><input value={form.year} onChange={set("year")} placeholder="2026" /></div>
            </div>
            <div className="fld"><label>Cover image URL *</label><input value={form.coverImage} onChange={set("coverImage")} placeholder="https://…/cover.png" /></div>
            <div className="fld"><label>Description</label><textarea value={form.description} onChange={set("description")} placeholder="What it is, what you built, the result." /></div>
            <div className="fld"><label>Live URL</label><input value={form.liveUrl} onChange={set("liveUrl")} placeholder="https://…" /></div>
            <div className="fld"><label>Repo URL (optional)</label><input value={form.repoUrl} onChange={set("repoUrl")} placeholder="https://github.com/…" /></div>
            <div className="fld"><label>Tech (comma-separated)</label><input value={form.tech} onChange={set("tech")} placeholder="Next.js, Postgres, Three.js" /></div>
            <div className="row-2">
              <div className="fld"><label>Order</label><input type="number" value={form.order} onChange={set("order")} /></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, justifyContent: "center" }}>
                <label className="check"><input type="checkbox" checked={!!form.featured} onChange={set("featured")} /> Featured</label>
                <label className="check"><input type="checkbox" checked={form.published !== false} onChange={set("published")} /> Published</label>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn solid" onClick={save} disabled={busy}>{busy ? "Saving…" : editId ? "Update" : "Add project"}</button>
              {editId && <button className="btn ghost" onClick={reset}>Cancel</button>}
            </div>
            {msg && <p className={msg.t === "ok" ? "ok" : "error"}>{msg.m}</p>}
            <p className="note">Tip: host images on your domain or any public URL, then paste the link here.</p>
          </div>

          <div className="panel">
            <h2>All projects ({items.length})</h2>
            <div className="adm-list">
              {items.length === 0 && <p className="note">No projects yet.</p>}
              {items.map((p) => (
                <div className="adm-row" key={p.id}>
                  <img src={p.coverImage} alt="" />
                  <div className="meta">
                    <b>{p.title}</b>
                    <span>{p.category}{p.year ? ` · ${p.year}` : ""}{p.featured ? " · ★" : ""}{p.published === false ? " · draft" : ""}</span>
                  </div>
                  <div className="acts">
                    <button className="icon-btn" onClick={() => edit(p)}>Edit</button>
                    <button className="icon-btn danger" onClick={() => del(p.id!)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
