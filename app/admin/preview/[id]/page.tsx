import Link from 'next/link';
import {notFound,redirect} from 'next/navigation';
import {isAdmin} from '@/lib/http';
import {listProjects} from '@/lib/store';
import ProjectVisual from '@/components/ProjectVisual';
export const dynamic='force-dynamic';
export const metadata={title:'Private project preview',robots:{index:false,follow:false}};
export default async function Preview({params}:{params:Promise<{id:string}>}){
 if(!await isAdmin())redirect('/admin/login');
 const {id}=await params;const p=(await listProjects(true)).find(p=>p.id===Number(id));if(!p)notFound();
 return <main id="main" className="case-study wrap"><div className="admin-notice">Private preview · {p.published?'Published':'Draft — only visible to you'} · <Link href="/admin">Return to admin →</Link></div><div className="case-heading"><span className="eyebrow">{p.category} / {p.year}</span><h1>{p.title}</h1><p>{p.description}</p></div><ProjectVisual project={p} priority/><div className="case-story">{[['01','The challenge',p.challenge],['02','The approach',p.solution],['03','The outcome',p.outcome]].map(([n,t,body])=><section key={n}><span className="eyebrow">{n}</span><h2>{t}</h2><p>{body||'Add this part of the story in the editor.'}</p></section>)}</div><div className="case-gallery">{p.gallery.map((src,i)=><figure key={src}><img src={src} alt={p.title+' — detail '+(i+1)}/></figure>)}</div></main>;
}
