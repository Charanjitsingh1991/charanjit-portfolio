"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const submit = async () => {
    setErr(""); setBusy(true);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        setErr(d.error || "Login failed");
      } else {
        router.replace("/admin");
        router.refresh();
      }
    } catch {
      setErr("Network error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-shell">
      <div className="wrap">
        <div className="panel login-card">
          <h2>Admin sign in</h2>
          <div className="fld"><label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="admin email" /></div>
          <div className="fld"><label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="password" /></div>
          <button className="btn solid" style={{ width: "100%", justifyContent: "center" }} onClick={submit} disabled={busy}>
            {busy ? "Signing in…" : "Sign in →"}
          </button>
          {err && <p className="error">{err}</p>}
          <p className="note">Protected area. Set ADMIN_EMAIL & ADMIN_PASSWORD_HASH in your env.</p>
        </div>
      </div>
    </div>
  );
}
