"use client";

import {useEffect, useRef, useState} from 'react';
import dynamic from 'next/dynamic';
import {useSiteContent} from './SiteContentProvider';

const HeroScene = dynamic(() => import('./HeroScene'), {ssr: false});
const AREAS = [
  {id: 'web', scene: 'dev', symbol: '⌘', name: 'Development', verb: 'Make it work.', detail: 'Websites · Applications · AI'},
  {id: 'design', scene: 'design', symbol: '✦', name: 'Design', verb: 'Make it felt.', detail: 'Identity · Interface · Motion'},
  {id: 'data', scene: 'data', symbol: '◈', name: 'Data science', verb: 'Find the meaning.', detail: 'Analysis · Insight · Growth'},
  {id: 'it', scene: 'it', symbol: '⛨', name: 'IT & security', verb: 'Keep it connected.', detail: 'Infrastructure · Resilience · Cloud'},
] as const;

function Counter({to, suffix = ''}: {to: number; suffix?: string}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      const start = performance.now();
      function tick(now: number) {
        const k = Math.min(1, (now - start) / 1400);
        if (el) el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + suffix;
        if (k < 1) frame = requestAnimationFrame(tick);
      }
      frame = requestAnimationFrame(tick);
    }, {threshold: .6});
    observer.observe(el);
    return () => {observer.disconnect(); cancelAnimationFrame(frame);};
  }, [to, suffix]);
  return <em ref={ref}>{to}{suffix}</em>;
}

export default function HeroV2() {
  const site = useSiteContent();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const sceneRef = useRef<string>('dev');
  const interacted = useRef(false);
  const area = AREAS[active];
  const content = site.areas.find(item => item.id === area.id);
  const skills = (content?.skills || '').split(/[,·]/).map(item => item.trim()).filter(Boolean).slice(0, 4);

  useEffect(() => {
    sceneRef.current = area.scene;
    document.documentElement.dataset.role = area.scene;
    document.documentElement.dataset.motion = paused ? 'paused' : 'running';
  }, [area.scene, paused]);

  useEffect(() => {
    if (paused || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => {
      if (!interacted.current && !document.hidden) setActive(index => (index + 1) % AREAS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [paused]);

  return <section id="hero" className="hero-reimagined">
    <div className="wrap hero-inner">
      <div className="hero-copy">
        <span className="eyebrow hero-availability"><span className="availability-dot"/>{site.tagline}</span>
        <h1><span className="hero-name">{site.name}</span><span className="hero-statement">One mind.<br/><span className="tint">Four disciplines.</span></span></h1>
        <p className="hero-sub">{site.bio}</p>
        <div className="hero-cta"><a className="btn solid" href="#works">Explore the work <span aria-hidden="true">↗</span></a><a className="btn ghost" href="#contact">Start a conversation</a></div>
        <div className="hero-stats">{site.stats.map(([value, label]) => <div className="hstat" key={label}><b><Counter to={parseFloat(value) || 0} suffix={value.replace(/[0-9.]/g, '')}/></b><span>{label}</span></div>)}</div>
      </div>
      <div className="hero-lab" aria-label="Explore four connected work areas">
        <div className="hero-lab-top"><span>THE PRACTICE / 001—004</span><span className="hero-lab-live"><i/> FOUR CONNECTED WORLDS</span></div>
        <div className="hero-scene"><HeroScene roleRef={sceneRef} paused={paused}/><div className="hero-scene-index" aria-hidden="true">0{active + 1}<span>/ 04</span></div><div className="hero-scene-corner" aria-hidden="true">{area.symbol}</div></div>
        <div className="hero-lab-info" key={area.id}><div><span className="hero-lab-kicker">0{active + 1} / {area.detail}</span><h2>{content?.title || area.name}</h2><strong>{area.verb}</strong><p>{content?.description}</p></div><div className="hero-lab-skills">{skills.map(skill => <span key={skill}>{skill}</span>)}</div></div>
        <div className="hero-lab-controls"><div className="hero-discipline-tabs" role="group" aria-label="Choose a work area">{AREAS.map((item, index) => <button key={item.id} type="button" className={index === active ? 'active' : ''} aria-pressed={index === active} onClick={() => {interacted.current = true; setActive(index);}}><span>{item.symbol}</span><span>{item.name}</span></button>)}</div><button className="motion-toggle" type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? 'Play' : 'Pause'}</button></div>
      </div>
    </div>
    <a className="scroll-hint" href="#about">Scroll to explore<i/></a>
  </section>;
}
