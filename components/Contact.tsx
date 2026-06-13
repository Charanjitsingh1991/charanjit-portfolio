"use client";
import { useState } from "react";

export default function Contact() {
  const [f, setF] = useState({ name: "", email: "", subject: "", message: "" });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));
  const send = () => {
    const s = encodeURIComponent(f.subject || "Project inquiry from portfolio");
    const b = encodeURIComponent(`Name: ${f.name}\nEmail: ${f.email}\n\n${f.message}`);
    window.location.href = `mailto:charanjit@thecharanjitsingh.com?subject=${s}&body=${b}`;
  };
  return (
    <section id="contact">
      <div className="wrap">
        <div className="contact-grid">
          <div>
            <span className="eyebrow">Contact</span>
            <h2 className="big-cta" style={{ marginTop: 16 }}>Let&apos;s build something <span className="tint">remarkable.</span></h2>
            <ul className="c-list">
              <li><span className="k">Email</span><a href="mailto:charanjit@thecharanjitsingh.com">charanjit@thecharanjitsingh.com</a></li>
              <li><span className="k">Phone</span><a href="tel:+971557714245">+971 55 771 4245</a></li>
              <li><span className="k">Location</span><span>Abu Dhabi, United Arab Emirates</span></li>
              <li><span className="k">LinkedIn</span><a href="https://www.linkedin.com/in/charanjitsingh1991/" target="_blank" rel="noopener">/in/charanjitsingh1991</a></li>
              <li><span className="k">GitHub</span><a href="https://github.com/Charanjitsingh1991" target="_blank" rel="noopener">@Charanjitsingh1991</a></li>
            </ul>
          </div>
          <div className="form">
            <div className="row">
              <div className="fld"><label>Name</label><input value={f.name} onChange={set("name")} placeholder="Your name" /></div>
              <div className="fld"><label>Email</label><input type="email" value={f.email} onChange={set("email")} placeholder="you@company.com" /></div>
            </div>
            <div className="fld"><label>Subject</label><input value={f.subject} onChange={set("subject")} placeholder="Project, role, or idea" /></div>
            <div className="fld"><label>Message</label><textarea value={f.message} onChange={set("message")} placeholder="Tell me what you need…" /></div>
            <button className="btn solid" style={{ width: "100%", justifyContent: "center" }} onClick={send}>Send message →</button>
            <p className="note" style={{ textAlign: "center" }}>Opens your email client with the message pre-filled.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
