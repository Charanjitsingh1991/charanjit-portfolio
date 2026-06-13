import Reveal from "./Reveal";

export function About() {
  return (
    <section id="about" className="alt-bg">
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <span className="eyebrow">Who I am</span>
            <h2>One technologist,<br /><span className="tint">five disciplines.</span></h2>
            <p>
              I own problems end to end — from a line of code to a brand to the infrastructure it runs on.
              I write production software and ship AI-powered products, design the identity around them,
              run the enterprise IT and security they depend on, turn their data into decisions as an
              IBM-certified data scientist, and grow them through digital marketing. Eight-plus years,
              one through-line: disciplines that rarely live in the same person, delivered by one.
            </p>
          </div>
        </Reveal>
        <div className="tracks">
          {[
            { c: "#2DD4BF", t: "Full Stack Development", d: "Websites, Android apps, custom CMS and AI-assisted workflows that ship production systems faster.",
              li: ["Built RNZ CropWise (AI crop advisory app) solo, end-to-end", "React, Next.js, Node, Laravel, Django, WordPress", "Prompt-engineering systems & build-pipeline automation", "E-commerce builds that lifted conversions 32%"] },
            { c: "#E9B872", t: "Design & Brand", d: "Complete corporate identity — packaging, catalogues, exhibitions, motion and design systems.",
              li: ["Group-wide brand system & style guide", "Print, packaging, motion graphics & social", "Adobe Illustrator, Photoshop, After Effects", "60% brand-awareness lift via campaigns"] },
            { c: "#F472B6", t: "Data Science · IBM Certified", d: "I turn the numbers products generate into decisions — analysis, modelling, insight.",
              li: ["IBM Data Science Professional Specialization", "Python, R, SQL, exploratory analysis", "Machine learning with Python", "Data-driven marketing & product decisions"] },
            { c: "#5BC0EB", t: "Digital Marketing", d: "SEO, paid and analytics that convert good work into measurable growth.",
              li: ["40% organic traffic growth via SEO", "Google / Meta / LinkedIn / X ads", "HubSpot CRM & email marketing", "Google Analytics & Search Console"] },
            { c: "#8B9DF5", t: "IT Infrastructure & Security", d: "Enterprise IT across three sites — M365, networking, incident response, servers, CCTV.",
              li: ["Microsoft 365 (57 licenses) · Exchange · Entra ID", "Remediated a live Business Email Compromise", "FortiGate firewall, SSL-VPN, Nessus audits", "Hikvision CCTV across KIZAD, JAFZA & DIC"] },
            { c: "#2DD4BF", t: "AI & Automation", d: "Developer tooling and AI workflows that remove repetitive work entirely.",
              li: ["RAG chat assistants with source citations", "Workflow & build-pipeline automation", "Custom developer plugins", "Saved a client 80 hours/month"] },
          ].map((tk, i) => (
            <Reveal key={tk.t} delay={(i % 3) * 0.08}>
              <article className="track" style={{ ["--tk" as any]: tk.c }}>
                <div className="ico">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v10M7 12h10" /></svg>
                </div>
                <h3>{tk.t}</h3>
                <p>{tk.d}</p>
                <ul>{tk.li.map((x) => <li key={x}>{x}</li>)}</ul>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="metrics">
            {[["40%", "Traffic growth via SEO"], ["32%", "E-commerce conversion uplift"], ["60%", "Brand awareness growth"], ["80h", "Saved / month via automation"], ["3s", "Load on content-heavy site"]].map(([b, s]) => (
              <div className="metric" key={s as string}><b>{b}</b><span>{s}</span></div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Marquee() {
  const items = "React ✦ Next.js ✦ Node.js ✦ Laravel ✦ Android ✦ Firebase ✦ WordPress ✦ AI & Prompt Engineering ✦ Adobe Suite ✦ SEO ✦ Microsoft 365 ✦ FortiGate ✦ Python ✦ R ✦ Data Science ✦ Vercel ✦ GCP ✦ ";
  return (
    <div className="marquee" aria-hidden>
      <div className="inner">
        <span dangerouslySetInnerHTML={{ __html: (items + items).replace(/✦/g, "<b>✦</b>") }} />
      </div>
    </div>
  );
}

export function Services() {
  const svc = [
    ["S/01", "Website Design & Development", "Fast, responsive, SEO-ready sites — WordPress, custom CMS, React/Next.js and e-commerce."],
    ["S/02", "Mobile Apps & AI Products", "Android apps with Firebase backends, RAG-grounded AI assistants and admin consoles — concept to store."],
    ["S/03", "UI/UX & Graphic Design", "Brand identities, packaging, catalogues, exhibition graphics, motion and full design systems."],
    ["S/04", "Data Science & Analytics", "IBM-certified analysis, modelling and dashboards that turn raw data into decisions."],
    ["S/05", "SEO & Digital Marketing", "Technical SEO, keyword strategy, Google/Meta/LinkedIn ads, HubSpot CRM and email."],
    ["S/06", "IT Infrastructure & Security", "Microsoft 365, firewall & VPN, vulnerability assessment, incident response and hardening."],
  ];
  return (
    <section id="services">
      <div className="wrap">
        <Reveal><div className="sec-head"><span className="eyebrow">Services</span><h2>What I can do <span className="tint">for you</span></h2></div></Reveal>
        <div className="svc-grid">
          {svc.map(([n, h, p], i) => (
            <Reveal key={n} delay={(i % 3) * 0.05}>
              <a className="svc" href="#contact"><span className="n">{n}</span><span className="go">↗</span><h3>{h}</h3><p>{p}</p></a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Skills() {
  const cols: [string, string[]][] = [
    ["Web & Frontend", ["HTML/CSS", "JavaScript", "TypeScript", "React", "Next.js", "Vue.js", "AngularJS", "Tailwind", "Framer Motion", "Bootstrap"]],
    ["Backend & Database", ["Node.js", "PHP", "Laravel", "Django", "MySQL", "PostgreSQL", "Prisma", "REST APIs", "Firebase"]],
    ["Mobile & CMS", ["Android", "Push Notifications", "WordPress", "Custom CMS", "Sanity v3", "Headless CMS", "OpenCart"]],
    ["AI & Automation", ["AI-Assisted Dev", "Prompt Engineering", "RAG Chat", "Workflow Automation", "Build Pipelines", "Dev Tooling"]],
    ["Design & Marketing", ["Photoshop", "Illustrator", "UI/UX", "Design Systems", "Print & Packaging", "Motion", "SEO", "Google Ads", "HubSpot"]],
    ["Data, IT & Cloud", ["Python", "R", "Data Science", "Microsoft 365", "Entra ID", "FortiGate", "Nessus", "PowerShell", "Vercel", "AWS", "GCP"]],
  ];
  return (
    <section id="skills" className="alt-bg">
      <div className="wrap">
        <Reveal><div className="sec-head"><span className="eyebrow">Stack</span><h2>Tools I <span className="tint">master</span></h2></div></Reveal>
        <div className="skill-cols">
          {cols.map(([h, list], i) => (
            <Reveal key={h} delay={(i % 3) * 0.05}>
              <div className="skill-card"><h4>{h}</h4><div className="chips">{list.map((c) => <span className="chip" key={c}>{c}</span>)}</div></div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CropWise() {
  return (
    <section id="cropwise">
      <div className="wrap">
        <Reveal><div className="sec-head"><span className="eyebrow">Featured product</span><h2>RNZ <span className="tint">CropWise</span></h2><p>An AI-powered crop advisory Android app — designed, developed and delivered end-to-end by one developer.</p></div></Reveal>
        <div className="spot">
          <Reveal>
            <div className="body">
              <p>CropWise puts the entire RNZ product ecosystem in a farmer&apos;s pocket: a smart catalogue, an AI advisor, and a chat assistant that cites its sources.</p>
              <ul className="feat-list">
                <li><b>Smart product catalogue</b> — filterable by crop, soil type, region and moisture level.</li>
                <li><b>AI Crop Advisor</b> — tailored crop-care recommendations from simple form inputs.</li>
                <li><b>RAG chat assistant</b> — grounded in the RNZ corpus, answering with source citations (title, page, URL).</li>
                <li><b>Full ecosystem</b> — favourites, brochure library, request-a-quote, and an admin console with push notifications.</li>
              </ul>
              <a className="btn solid" href="#contact">Want an app like this? →</a>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="phone">
              <div className="screen">
                <div className="scr-top"><b>RNZ <em>CropWise</em></b><span>AI CROP ADVISOR</span></div>
                <div className="bubble u">Best fertilizer for tomatoes in sandy soil, low moisture?</div>
                <div className="bubble a">For sandy soil with low moisture, a balanced NPK with added micronutrients works best early-stage…<cite>⌕ Source: RNZ Catalogue — p.14, Micronutrients</cite></div>
                <div className="scr-tags"><i>CROP: TOMATO</i><i>SOIL: SANDY</i><i>REGION: GCC</i><i>★ SAVED</i></div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Experience() {
  const main = [
    ["May 2024 — Present", "Developer · Designer · Marketer · IT Admin", "RNZ Agrotech Industries Ltd — Abu Dhabi, UAE", "Built RNZ CropWise solo, run the group's websites and SEO (+40% traffic), own the complete branding function group-wide, and administer enterprise IT across three sites — including remediating a live BEC incident.", ["WordPress", "Android + AI", "Adobe Suite", "SEO", "Microsoft 365", "FortiGate"]],
    ["Sep 2023 — May 2024", "E-commerce & Digital Marketing Specialist", "Ajooba Stationery & Gift LLC — Dubai, UAE", "Managed 7 websites end-to-end — WordPress builds to full SEO — boosting conversions 32% and integrating payment gateways.", ["WooCommerce", "OpenCart", "API", "SEO"]],
    ["Aug 2020 — Aug 2023", "Digital Marketing Specialist", "Tutsin Agency — Jalandhar, India", "Email campaigns that raised conversions 20%, SEO-led organic growth, and data analysis that sharpened strategy.", ["Google Ads", "Email", "SEO", "Python"]],
    ["Aug 2018 — Aug 2020", "Senior Web Developer", "Tutsin Agency — Jalandhar, India", "Led UI/UX across client projects, built a custom e-commerce platform with filtering and reviews, and trained junior developers.", ["PHP", "JavaScript", "CMS", "Mentoring"]],
    ["Sep 2012 — Dec 2013", "Lead PHP Full Stack Developer", "NIIT Technologies — Jalandhar, India", "Built B2B finance auth workflows, a 2,500-product catalogue, and RESTful APIs for enterprise systems.", ["PHP", "REST APIs", "MySQL"]],
  ];
  const free = [
    ["Sep 2022 — Dec 2022", "Senior Web Developer — Kalia Law Firm 🇨🇦", "WordPress + Google Cloud + Maps API — ranked top in its province, 3-second loads."],
    ["Jun 2021 — Mar 2022", "Full Stack Developer — ForexAMG", "Laravel module integration, SOAP/WSDL services, and automation simulators/validators."],
    ["Aug 2020 — Apr 2021", "Lead Full Stack Developer — iapply.io", "Unified-login platform querying multiple data types from one search, built as a responsive SPA."],
    ["Jan 2020 — Jul 2020", "Lead Web-App Developer — Nav", "Django+Vue image-recognition app, an API ingesting millions of pages for risk modelling, automation saving 80h/month."],
    ["May 2019 — Dec 2019", "Senior Full Stack Developer — Sanskriti Bazaar 🇮🇳", "Angular components, +15% page speed, +2 min time-on-page, test coverage cutting complaints 7%."],
  ];
  return (
    <section id="experience" className="alt-bg">
      <div className="wrap">
        <Reveal><div className="sec-head"><span className="eyebrow">Journey</span><h2>Where I&apos;ve <span className="tint">delivered</span></h2></div></Reveal>
        <div className="timeline">
          {main.map(([w, h, o, p, tags]) => (
            <Reveal key={h as string}>
              <div className="tl-item">
                <span className="when">{w}</span><h3>{h}</h3><div className="org">{o}</div><p>{p}</p>
                <div className="tags">{(tags as string[]).map((t) => <i key={t}>{t}</i>)}</div>
              </div>
            </Reveal>
          ))}
          <p className="tl-sub">— Freelance track record · 6 international clients · Canada / UAE / India —</p>
          {free.map(([w, h, p]) => (
            <Reveal key={h as string}>
              <div className="tl-item"><span className="when">{w}</span><h3>{h}</h3><p>{p}</p></div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Education() {
  const edu = [
    ["2017 — 2020", "Master of Computer Applications (MCA)", "Apeejay Institute of Management & Engineering — 72%."],
    ["2013 — 2016", "Bachelor of Computer Applications (BCA)", "Apeejay College of Fine Arts, India."],
    ["2013", "Diploma — ZEND Server Technology", "NIIT Limited, India."],
    ["2011 — 2012", "Diploma — Developing Interactive Websites", "NIIT Limited, India."],
  ];
  const certs = [
    ["AWS Fundamentals — Going Cloud-Native", "Coursera"], ["IBM Data Science Specialization", "Coursera"],
    ["Applied Data Science Specialization", "Coursera"], ["Data Science Foundations using R", "Coursera"],
    ["Machine Learning with Python", "Coursera"], ["Data Analysis with Python", "Coursera"],
    ["Databases & SQL for Data Science", "Coursera"], ["Exploratory Data Analysis", "Coursera"],
    ["R Programming", "Coursera"], ["Tools for Data Science", "Coursera"],
    ["Fundamentals of Digital Marketing", "Google"], ["Inbound Marketing Certification", "HubSpot"],
  ];
  return (
    <section id="education">
      <div className="wrap">
        <Reveal><div className="sec-head"><span className="eyebrow">Foundation</span><h2>Education & <span className="tint">certifications</span></h2></div></Reveal>
        <div className="edu-grid">
          {edu.map(([w, h, p], i) => (
            <Reveal key={h as string} delay={(i % 2) * 0.05}>
              <div className="edu"><span className="when">{w}</span><h3>{h}</h3><p>{p}</p></div>
            </Reveal>
          ))}
        </div>
        <div className="cert-grid">
          {certs.map(([b, s]) => (
            <Reveal key={b}><div className="cert"><span className="dot" /><div><b>{b}</b><span>{s}</span></div></div></Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="wrap footer-inner">
        <p>© {new Date().getFullYear()} Charanjit Singh — Built with code, design & a little AI.</p>
        <div className="socials">
          <a href="https://www.linkedin.com/in/charanjitsingh1991/" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.05c.53-1 1.84-2.2 3.8-2.2 4.06 0 4.8 2.67 4.8 6.15V24h-4v-8.5c0-2.03-.04-4.64-2.83-4.64-2.83 0-3.27 2.2-3.27 4.5V24H8V8z" /></svg></a>
          <a href="https://github.com/Charanjitsingh1991" target="_blank" rel="noopener" aria-label="GitHub"><svg viewBox="0 0 24 24"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55v-2.17c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .3.21.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" /></svg></a>
          <a href="https://www.instagram.com/cs_bharaj/" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23a3.7 3.7 0 0 1-.9 1.38 3.7 3.7 0 0 1-1.38.9c-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.9 5.9 0 0 0-2.13 1.38A5.9 5.9 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13a5.9 5.9 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.4a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44z" /></svg></a>
        </div>
      </div>
    </footer>
  );
}
