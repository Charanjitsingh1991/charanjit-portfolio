"use client";
import { useEffect, useRef, useState } from "react";
import HeroThree from "./HeroThree";

const ROLES: Record<string, { label: string; phrases: string[] }> = {
  dev: { label: "⌘ Developer", phrases: ["I build products.", "I ship AI apps.", "I write code."] },
  design: { label: "✦ Designer", phrases: ["I design brands.", "I craft identity.", "I shape systems."] },
  it: { label: "⛨ IT & Security", phrases: ["I secure networks.", "I run infrastructure.", "I stop attacks."] },
  data: { label: "◈ Data Scientist", phrases: ["I model data.", "I find the signal.", "IBM-certified."] },
};
const ORDER = ["dev", "design", "it", "data"];

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(el);
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const dur = reduced ? 1 : 1400, t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / dur);
        el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + suffix;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }), { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, suffix]);
  return <em ref={ref}>0{suffix}</em>;
}

export default function Hero() {
  const [role, setRole] = useState("dev");
  const [text, setText] = useState("");
  const roleRef = useRef("dev");
  const interacted = useRef(false);

  // typewriter
  useEffect(() => {
    roleRef.current = role;
    document.documentElement.setAttribute("data-role", role);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const phrases = ROLES[role].phrases;
    let pi = 0, ci = 0, del = false, timer: ReturnType<typeof setTimeout>;
    const loop = () => {
      const w = phrases[pi % phrases.length];
      if (reduced) { setText(w); return; }
      if (!del) {
        ci++; setText(w.slice(0, ci));
        if (ci === w.length) { del = true; timer = setTimeout(loop, 1900); return; }
        timer = setTimeout(loop, 55);
      } else {
        ci--; setText(w.slice(0, ci));
        if (ci === 0) { del = false; pi++; timer = setTimeout(loop, 300); return; }
        timer = setTimeout(loop, 28);
      }
    };
    loop();
    return () => clearTimeout(timer);
  }, [role]);

  // auto-cycle until interaction
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0;
    const id = setInterval(() => {
      if (interacted.current) return;
      i = (i + 1) % ORDER.length;
      setRole(ORDER[i]);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const pick = (r: string) => { interacted.current = true; setRole(r); };

  return (
    <section id="hero">
      <HeroThree roleRef={roleRef} />
      <div className="wrap hero-inner">
        <span className="eyebrow">Abu Dhabi, UAE · Open to projects</span>
        <h1>Charanjit Singh</h1>
        <div className="role-line"><span>{text}</span><span className="caret" /></div>
        <p className="hero-sub">
          A multi-disciplinary technologist who builds the whole stack most teams split across four hires —
          production code & AI products, brand & design, IBM-certified data science, and the digital marketing
          and enterprise IT that tie it all together.
        </p>
        <div className="role-tabs" role="tablist">
          {ORDER.map((r) => (
            <button key={r} className={"role-tab" + (role === r ? " active" : "")} onClick={() => pick(r)}>
              {ROLES[r].label}
            </button>
          ))}
        </div>
        <div className="hero-cta">
          <a className="btn solid" href="#works">View my work →</a>
          <a className="btn ghost" href="#contact">Let&apos;s talk</a>
        </div>
        <div className="hero-stats">
          <div className="hstat"><b><Counter to={10} suffix="+" /></b><span>Years experience</span></div>
          <div className="hstat"><b><Counter to={143} /></b><span>Completed projects</span></div>
          <div className="hstat"><b><Counter to={114} /></b><span>Happy clients</span></div>
          <div className="hstat"><b><Counter to={12} suffix="+" /></b><span>Certifications</span></div>
        </div>
      </div>
      <div className="scroll-hint">Scroll<i /></div>
    </section>
  );
}
