import {promises as fs} from 'fs';
import path from 'path';
import {Prisma, PrismaClient} from '@prisma/client';
import legacy from '../lib/legacy-projects.json';
import {projectEditorial} from '../lib/project-editorial';
import type {Project} from '../lib/catalog';

type Values = Record<string, unknown>;
const oldDescription = (slug:string) => legacy.find(project => project.slug === slug);

function original(slug:string):Values {
  const old = oldDescription(slug);
  const design = old?.category === 'design';
  return {
    description: old?.description || (slug === 'sanskriti-bazaar' ? 'Frontend development, performance improvements, and broader test coverage for an e-commerce experience.' : ''),
    coverImage: '/work/covers/' + slug + '.svg',
    coverAlt: (old?.title || '') + ' — illustrated project cover',
    client: old ? old.title.startsWith('RNZ') ? 'RNZ Group' : old.title.startsWith('Expocrop') ? 'Expocrop' : old.title.startsWith('Ajooba') ? 'Ajooba' : old.title : '',
    role: design ? 'Brand & visual designer' : 'Developer & digital experience designer',
    challenge: design ? 'Translate a business and its products into a clear visual language across customer touchpoints.' : 'Create a useful digital presence that makes information easier to discover and the business easier to engage with.',
    solution: old?.description || '',
    outcome: design ? 'A coordinated collection of brand assets for digital and physical use.' : 'A delivered web experience, supported by the technologies and responsibilities listed below.',
    tech: old?.tech || '',
    liveUrl: old ? old.liveUrl.includes('thecharanjitsingh.com') ? null : old.liveUrl : null,
    seoTitle: '', seoDescription: '', socialImage: '',
  };
}

function changes(project:Project):Partial<Project> {
  const update = projectEditorial[project.slug];
  if (!update) return {};
  const baseline = original(project.slug);
  const result:Values = {};
  for (const [key, value] of Object.entries(update)) {
    const current = (project as unknown as Values)[key];
    if (current === value) continue;
    if (current === undefined || current === null || current === '' || current === baseline[key]) result[key] = value;
  }
  return result as Partial<Project>;
}

async function main() {
  let updated = 0;
  if (process.env.DATABASE_URL) {
    const db = new PrismaClient();
    try {
      for (const project of await db.project.findMany()) {
        const data = changes(project as unknown as Project);
        if (Object.keys(data).length) {await db.project.update({where:{id:project.id},data:data as Prisma.ProjectUpdateInput}); updated++;}
      }
    } finally {await db.$disconnect();}
  } else if (process.argv.includes('--local')) {
    const file = path.resolve('.data/portfolio.json');
    let stored: {projects:Project[]};
    try {stored = JSON.parse(await fs.readFile(file, 'utf8'));} catch (error) {if ((error as NodeJS.ErrnoException).code === 'ENOENT') {console.log('No local project store to update.'); return;} throw error;}
    stored.projects = stored.projects.map(project => {const data = changes(project); if (Object.keys(data).length) updated++; return {...project, ...data};});
    if (updated) {await fs.copyFile(file, file + '.before-editorial-update'); const temp = file + '.tmp'; await fs.writeFile(temp, JSON.stringify(stored, null, 2)); await fs.rename(temp, file);}
  }
  console.log('Enriched ' + updated + ' existing projects; custom admin edits were preserved.');
}
main().catch(error => {console.error(error); process.exitCode = 1;});
