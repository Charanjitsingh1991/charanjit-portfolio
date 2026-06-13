"use client";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const links = [
  ["About", "#about"], ["Services", "#services"], ["Skills", "#skills"],
  ["CropWise", "#cropwise"], ["Work", "#works"], ["Experience", "#experience"], ["Contact", "#contact"],
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const h = document.documentElement;
      const p = (window.scrollY / (h.scrollHeight - h.clientHeight)) * 100;
      const bar = document.getElementById("progress");
      if (bar) bar.style.width = p + "%";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div id="progress" />
      <nav className={scrolled ? "scrolled" : ""}>
        <div className="wrap nav-inner">
          <a className="logo" href="#hero">CHARANJIT<b>.</b>SINGH</a>
          <div className={"nav-links" + (open ? " open" : "")}>
            {links.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
            ))}
            <a className="btn ghost" href="https://thecharanjitsingh.com/wp-content/uploads/2024/10/Charanjit_Singh_-_Full_Stack_Developer__Digital_Marketing_Specialist.pdf" target="_blank" rel="noopener">CV ↓</a>
            <ThemeToggle />
          </div>
          <button id="burger" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>
    </>
  );
}
