import {promises as fs} from 'fs';
import path from 'path';
import {catalog, type Project} from '../lib/catalog';
import {PrismaClient} from '@prisma/client';
// Update only previous seed presentation values; retain uploads, galleries, and saved links.
function changes(p:Project):Partial<Project>{
 const seeded=catalog.find(x=>x.slug===p.slug||(p.slug==='rnz-cropwise'&&x.slug==='agri-cropwise'));
 if(!seeded)return {};
 const update:Partial<Project>={};
 if(p.slug==='rnz-cropwise')update.slug='agri-cropwise';
 if(p.title==='RNZ CropWise')update.title='Agri Cropwise';
 if((p.slug==='rnz-cropwise'||p.slug==='agri-cropwise')&&p.client==='RNZ Group')update.client='Agri Cropwise';
 if(!p.coverImage||/^https:\/\/(www\.)?thecharanjitsingh\.com\//.test(p.coverImage)){update.coverImage=seeded.coverImage;update.coverAlt=seeded.coverAlt;}
 if(p.outcome?.includes('verified app screenshots can be added through the admin.'))update.outcome=seeded.outcome;
 return update;
}
async function main(){
 if(process.env.DATABASE_URL){const prisma=new PrismaClient();try{for(const p of await prisma.project.findMany()){const data=changes(p as Project);if(Object.keys(data).length)await prisma.project.update({where:{id:p.id},data});}}finally{await prisma.$disconnect();}}
 else {const file=path.resolve('.data/portfolio.json');let data;try{data=JSON.parse(await fs.readFile(file,'utf8'));}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return;throw e;}
 await fs.copyFile(file,file+'.before-presentation-update');
 data.projects=data.projects.map((p:Project)=>({...p,...changes(p)}));const temp=file+'.tmp';await fs.writeFile(temp,JSON.stringify(data,null,2));await fs.rename(temp,file);}
 console.log('Project names and illustrated covers updated. Existing links and uploads preserved.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
