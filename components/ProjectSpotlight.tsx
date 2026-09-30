"use client";

import {useState} from 'react';
import Link from 'next/link';
import type {Project} from '@/lib/catalog';
import {categoryLabel} from '@/lib/catalog';
import ProjectVisual from './ProjectVisual';

export default function ProjectSpotlight({projects}: {projects: Project[]}) {
  const featured = projects.filter(project => project.featured && project.published).slice(0, 5);
  const choices = featured.length ? featured : projects.filter(project => project.published).slice(0, 3);
  const [index, setIndex] = useState(0);
  if (!choices.length) return null;
  const project = choices[index % choices.length];
  const go = (step: number) => setIndex(value => (value + step + choices.length) % choices.length);
  return <section id="cropwise" className="project-spotlight">
    <div className="wrap">
      <div className="spotlight-heading"><div><span className="eyebrow">Proof of work / Featured projects</span><h2>Ideas made <span className="tint">real.</span></h2></div><p>Selected work across code, design, data and digital systems — built to solve real problems and create lasting value.</p></div>
      <div className="spotlight-card" key={project.id}>
        <div className="spotlight-visual"><div className="spotlight-visual-head"><span><i/><i/><i/></span><span>{project.slug.replaceAll('-', ' / ').toUpperCase()}</span><span>↗</span></div><ProjectVisual project={project} priority={index === 0}/><span className="spotlight-visual-caption">CHARANJIT SINGH / SELECTED WORK / {project.year || 'PROJECT'}</span></div>
        <div className="spotlight-copy"><span className="spotlight-counter">FEATURED CASE STUDY <b>0{index + 1} / 0{choices.length}</b></span><div><span className="spotlight-category">{categoryLabel(project.category)}{project.year ? ' · ' + project.year : ''}</span><h3>{project.title}</h3><p>{project.description}</p><div className="spotlight-meta"><div><span>CLIENT</span><strong>{project.client || project.title}</strong></div><div><span>ROLE</span><strong>{project.role || 'Digital experience'}</strong></div></div><div className="spotlight-tags">{project.tech.split(',').map(item => item.trim()).filter(Boolean).slice(0, 5).map(item => <span key={item}>{item}</span>)}</div></div><div className="spotlight-actions"><Link className="btn solid" href={'/work/' + project.slug}>Explore case study ↗</Link>{project.liveUrl && <a className="spotlight-live" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Visit live project ↗</a>}</div></div>
      </div>
      <div className="spotlight-footer"><div className="spotlight-progress" aria-label="Choose a featured project">{choices.map((item, value) => <button type="button" key={item.id} aria-label={'Show ' + item.title} aria-current={value === index ? 'true' : undefined} onClick={() => setIndex(value)}><span/></button>)}</div><div className="spotlight-arrows"><button type="button" onClick={() => go(-1)} aria-label="Previous project">←</button><button type="button" onClick={() => go(1)} aria-label="Next project">→</button></div><Link href="/portfolio">View all projects ↗</Link></div>
    </div>
  </section>;
}
