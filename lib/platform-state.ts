import 'server-only';
import {promises as fs} from 'fs';import path from 'path';import {randomUUID} from 'crypto';
import {prisma} from './prisma';import {defaultContent,type SiteContent} from './site-content';import type {Project} from './catalog';
export type Media={id:string;url:string;name:string;alt:string;folder:string;type:string;size:number;createdAt:string};
export type Revision={id:string;kind:'project'|'site';target:string;label:string;data:Project|SiteContent;createdAt:string};
export type Session={id:string;agent:string;createdAt:number;expires:number};
export type Platform={analyticsSeen?:Record<string,string>;content:SiteContent;media:Media[];revisions:Revision[];drafts:Record<string,{data:unknown;updatedAt:string}>;activity:{id:string;message:string;createdAt:string}[];analytics:Record<string,{views:number;inquiries:number}>;security:{passwordHash?:string;totp?:string;pendingTotp?:string;pendingUntil?:number;lastStep?:number;recovery:string[];sessions:Session[];reset?:{hash:string;expires:number}}};
const initial=():Platform=>({content:structuredClone(defaultContent),media:[],revisions:[],drafts:{},activity:[],analytics:{},security:{recovery:[],sessions:[]}});
const localAllowed=()=>!process.env.DATABASE_URL&&!process.env.VERCEL&&(process.env.NODE_ENV!=='production'||process.env.ALLOW_LOCAL_STORAGE==='true');
let queue:Promise<unknown>=Promise.resolve();
export async function state<T>(fn:(s:Platform)=>T|Promise<T>,write=false):Promise<T>{
 if(process.env.DATABASE_URL){
  if(!write){const row=await prisma.siteState.findUnique({where:{key:'platform'}});return fn(row?row.value as unknown as Platform:initial());}
  return prisma.$transaction(async tx=>{
   await tx.$executeRaw`INSERT INTO SiteState (\`key\`, \`value\`) VALUES ('platform', JSON_OBJECT()) ON DUPLICATE KEY UPDATE \`key\` = \`key\``;
   const rows=await tx.$queryRaw<{value:Platform}[]>`SELECT \`value\` FROM SiteState WHERE \`key\` = 'platform' FOR UPDATE`;
   const data=rows[0]?.value?.content?rows[0].value:initial();const result=await fn(data);
   await tx.siteState.update({where:{key:'platform'},data:{value:JSON.parse(JSON.stringify(data))}});return result;
  });
 }
 if(!localAllowed()){if(write)throw Error('Configure persistent storage first.');return fn(initial());}
 const operation=queue.then(async()=>{const file=path.join(process.cwd(),process.env.LOCAL_DATA_DIR||'.data','platform.json');let data:Platform;try{data=JSON.parse(await fs.readFile(file,'utf8'));}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;data=initial();}const result=await fn(data);if(write){await fs.mkdir(path.dirname(file),{recursive:true});const temp=file+'.'+randomUUID()+'.tmp';await fs.writeFile(temp,JSON.stringify(data));await fs.rename(temp,file);}return result;});queue=operation.catch(()=>{});return operation;
}
export const getContent=()=>state(s=>s.content);
export function activity(s:Platform,message:string){s.activity.unshift({id:randomUUID(),message,createdAt:new Date().toISOString()});s.activity=s.activity.slice(0,300);}
export async function recordRevision(kind:Revision['kind'],target:string,label:string,data:Revision['data']){return state(s=>{s.revisions.unshift({id:randomUUID(),kind,target,label,data,createdAt:new Date().toISOString()});s.revisions=s.revisions.slice(0,150);activity(s,label);},true);}
export async function metric(page:string,event:'views'|'inquiries',identity?:string){return state(s=>{if(!s.content.analyticsEnabled)return;const day=new Date().toISOString().slice(0,10);if(identity){s.analyticsSeen||={};if(s.analyticsSeen[identity])return;s.analyticsSeen[identity]=day;const before=new Date(Date.now()-90*86400000).toISOString().slice(0,10);for(const [id,date] of Object.entries(s.analyticsSeen))if(date<before)delete s.analyticsSeen[id];}const key=day+'|'+page;const row=s.analytics[key]||{views:0,inquiries:0};row[event]++;s.analytics[key]=row;const cutoff=new Date(Date.now()-90*86400000).toISOString().slice(0,10);for(const k of Object.keys(s.analytics))if(k.slice(0,10)<cutoff)delete s.analytics[k];},true);}
