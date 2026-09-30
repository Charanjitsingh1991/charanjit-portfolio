import {promises as fs} from 'fs';
import path from 'path';
import {catalog} from '../lib/catalog';
async function main(){
 const file=path.resolve('.data/portfolio.json');
 let data;try{data=JSON.parse(await fs.readFile(file,'utf8'));}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT'){console.log('No local store yet. It will start with the current catalog.');return;}throw e;}
 let added=0;
 for(const p of catalog){if(!data.projects.some((x:{slug:string})=>x.slug===p.slug)){const id=Math.max(0,...data.projects.map((x:{id:number})=>x.id))+1;data.projects.push({...p,id});added++;}}
 const temp=file+'.tmp';await fs.writeFile(temp,JSON.stringify(data,null,2));await fs.rename(temp,file);console.log('Added '+added+' missing catalog projects. Existing edits preserved.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
