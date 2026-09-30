import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID, createHash } from 'crypto';
import { prisma } from './prisma';
import { catalog, type Project } from './catalog';
import type { InquiryInput } from './validation';
export type Inquiry = {project:string;source:string;followUp:string;confirmationStatus:string;id:string;requestId:string;name:string;email:string;company:string;service:string;budget:string;message:string;status:string;notes:string;emailStatus:string;createdAt:string;updatedAt:string};
export type SupportMessage={id:string;conversationId:string;sender:'visitor'|'admin'|'system';body:string;emailStatus:string;createdAt:string};
export type SupportConversation={id:string;firstName:string;lastName:string;email:string;status:string;unreadAdmin:number;unreadVisitor:number;createdAt:string;updatedAt:string;messages:SupportMessage[]};
type LocalSupport=SupportConversation&{visitorTokenHash:string};
type Local = {projects:Project[];inquiries:Inquiry[];rates:Record<string,{count:number;expires:number}>;support?:LocalSupport[]};
export const hasDatabase = () => !!process.env.DATABASE_URL;
export const localEnabled = () => !hasDatabase() && (process.env.NODE_ENV !== 'production' || process.env.ALLOW_LOCAL_STORAGE === 'true') && !process.env.VERCEL;
const file = path.join(process.cwd(),process.env.LOCAL_DATA_DIR || '.data','portfolio.json');
let queue:Promise<unknown> = Promise.resolve();
async function local<T>(fn:(data:Local)=>T|Promise<T>,write=false):Promise<T>{
 if(!localEnabled())throw Error('Database is not configured.');
 const operation=queue.then(async()=>{
  let data:Local;
  try{data=JSON.parse(await fs.readFile(file,'utf8'));}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;data={projects:structuredClone(catalog),inquiries:[],rates:{}};}
  const result=await fn(data);
  if(write){await fs.mkdir(path.dirname(file),{recursive:true});const temp=file+'.'+randomUUID()+'.tmp';await fs.writeFile(temp,JSON.stringify(data,null,2));await fs.rename(temp,file);}
  return result;
 });
 queue=operation.catch(()=>{});return operation;
}
function project(row:unknown):Project {const p=row as Project;return {...p,tech:p.tech||'',year:p.year||'',gallery:Array.isArray(p.gallery)?p.gallery.filter((v):v is string=>typeof v==='string'):[]};}
export async function listProjects(admin=false,trash=false):Promise<Project[]> {
 if(hasDatabase())return (await prisma.project.findMany({where:{deleted:trash,...(admin?{}:{published:true})},orderBy:[{featured:'desc'},{order:'asc'},{id:'desc'}]})).map(project);
 if(localEnabled())return local(d=>d.projects.filter(p=>!!p.deleted===trash&&(admin||p.published)).sort((a,b)=>Number(b.featured)-Number(a.featured)||a.order-b.order));
 if(admin)throw Error('Database is not configured.');
 return catalog.filter(p=>p.published);
}
export async function saveProject(input:Omit<Project,'id'>,id?:number){
 if(hasDatabase())return project(id?await prisma.project.update({where:{id},data:input}):await prisma.project.create({data:input}));
 return local(d=>{if(d.projects.some(p=>p.slug===input.slug&&p.id!==id))throw Error('This slug is already in use.');if(id&&!d.projects.some(p=>p.id===id))throw Error('Project not found.');const p={...input,id:id||Math.max(0,...d.projects.map(x=>x.id))+1};d.projects=id?d.projects.map(x=>x.id===id?p:x):[...d.projects,p];return p;},true);
}
export async function deleteProject(id:number){
 if(hasDatabase()){await prisma.project.update({where:{id},data:{deleted:true,published:false}});return;}
 return local(d=>{if(!d.projects.some(p=>p.id===id))throw Error('Project not found.');const item=d.projects.find(p=>p.id===id)!;item.deleted=true;item.published=false;},true);
}
export async function addInquiry(input:InquiryInput):Promise<Inquiry>{
 const {consent:_,website:__,...data}=input;
 if(hasDatabase()){const row=await prisma.inquiry.upsert({where:{requestId:data.requestId},update:{},create:data});return {...row,createdAt:row.createdAt.toISOString(),updatedAt:row.updatedAt.toISOString()};}
 return local(d=>{const existing=d.inquiries.find(x=>x.requestId===data.requestId);if(existing)return existing;const row:Inquiry={...data,id:randomUUID(),status:'new',notes:'',emailStatus:'pending',confirmationStatus:'pending',followUp:'',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};d.inquiries.unshift(row);return row;},true);
}
export async function listInquiries():Promise<Inquiry[]>{
 if(hasDatabase())return (await prisma.inquiry.findMany({orderBy:{createdAt:'desc'},take:1000})).map(p=>({...p,createdAt:p.createdAt.toISOString(),updatedAt:p.updatedAt.toISOString()}));
 return local(d=>d.inquiries);
}
export async function updateInquiry(id:string,update:Partial<Pick<Inquiry,'status'|'notes'|'emailStatus'|'confirmationStatus'|'followUp'>>){
 if(hasDatabase()){const row=await prisma.inquiry.update({where:{id},data:update});return {...row,createdAt:row.createdAt.toISOString(),updatedAt:row.updatedAt.toISOString()};}
 return local(d=>{const row=d.inquiries.find(x=>x.id===id);if(!row)throw Error('Inquiry not found.');Object.assign(row,update,{updatedAt:new Date().toISOString()});return row;},true);
}
export async function rateLimit(identity:string,limit:number,windowMs:number):Promise<boolean>{
 const now=Date.now(),bucket=Math.floor(now/windowMs),key=createHash('sha256').update(identity+':'+bucket).digest('hex');
 if(hasDatabase()){
  const row=await prisma.rateLimit.upsert({where:{key},create:{key,count:1,expiresAt:new Date((bucket+1)*windowMs)},update:{count:{increment:1}}});
  if(Math.random()<.02)await prisma.rateLimit.deleteMany({where:{expiresAt:{lt:new Date(now)}}});
  return row.count<=limit;
 }
 return local(d=>{for(const k of Object.keys(d.rates))if(d.rates[k].expires<now)delete d.rates[k];const row=d.rates[key]||{count:0,expires:(bucket+1)*windowMs};row.count++;d.rates[key]=row;return row.count<=limit;},true);
}
const tokenHash=(token:string)=>createHash('sha256').update(token).digest('hex');
type SupportSource={id:string;firstName:string;lastName:string;email:string;status:string;unreadAdmin:number;unreadVisitor:number;createdAt:string|Date;updatedAt:string|Date;messages:{id:string;conversationId:string;sender:string;body:string;emailStatus:string;createdAt:string|Date}[]};
const supportRow=(row:SupportSource):SupportConversation=>({id:row.id,firstName:row.firstName,lastName:row.lastName,email:row.email,status:row.status,unreadAdmin:row.unreadAdmin,unreadVisitor:row.unreadVisitor,createdAt:new Date(row.createdAt).toISOString(),updatedAt:new Date(row.updatedAt).toISOString(),messages:row.messages.map(m=>({...m,sender:(['visitor','admin','system'].includes(m.sender)?m.sender:'system') as SupportMessage['sender'],createdAt:new Date(m.createdAt).toISOString()}))});
export async function supportByToken(token:string,markRead=false){
 const hash=tokenHash(token);
 if(hasDatabase()){const row=await prisma.supportConversation.findUnique({where:{visitorTokenHash:hash},include:{messages:{orderBy:{createdAt:'asc'}}}});if(!row)return null;if(markRead&&row.unreadVisitor)await prisma.supportConversation.update({where:{id:row.id},data:{unreadVisitor:0}});return supportRow({...row,unreadVisitor:markRead?0:row.unreadVisitor});}
 return local(d=>{const row=(d.support||[]).find(x=>x.visitorTokenHash===hash);if(row&&markRead)row.unreadVisitor=0;return row?supportRow(row):null;},markRead);
}
export async function startSupport(token:string,input:{firstName:string;lastName:string;email:string;body:string}){
 const hash=tokenHash(token),now=new Date().toISOString();
 if(hasDatabase()){const existing=await prisma.supportConversation.findUnique({where:{visitorTokenHash:hash}});const row=existing?await prisma.supportConversation.update({where:{id:existing.id},data:{unreadAdmin:{increment:1},status:'open',messages:{create:{sender:'visitor',body:input.body,emailStatus:'pending'}}},include:{messages:{orderBy:{createdAt:'asc'}}}}):await prisma.supportConversation.create({data:{visitorTokenHash:hash,firstName:input.firstName,lastName:input.lastName,email:input.email,unreadAdmin:1,messages:{create:{sender:'visitor',body:input.body,emailStatus:'pending'}}},include:{messages:{orderBy:{createdAt:'asc'}}}});return supportRow(row);}
 return local(d=>{d.support||=[];let row=d.support.find(x=>x.visitorTokenHash===hash);if(!row){row={id:randomUUID(),visitorTokenHash:hash,firstName:input.firstName,lastName:input.lastName,email:input.email,status:'open',unreadAdmin:0,unreadVisitor:0,createdAt:now,updatedAt:now,messages:[]};d.support.unshift(row);}row.messages.push({id:randomUUID(),conversationId:row.id,sender:'visitor',body:input.body,emailStatus:'pending',createdAt:now});row.unreadAdmin++;row.status='open';row.updatedAt=now;return supportRow(row);},true);
}
export async function listSupport(){if(hasDatabase())return (await prisma.supportConversation.findMany({include:{messages:{orderBy:{createdAt:'asc'}}},orderBy:{updatedAt:'desc'},take:500})).map(supportRow);return local(d=>(d.support||[]).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)).map(supportRow));}
export async function adminSupportAction(id:string,body?:string,status?:string){
 const now=new Date().toISOString();
 if(hasDatabase()){const row=await prisma.supportConversation.update({where:{id},data:{unreadAdmin:0,...(status?{status}:{}),...(body?{unreadVisitor:{increment:1},messages:{create:{sender:'admin',body,emailStatus:'pending'}}}:{})},include:{messages:{orderBy:{createdAt:'asc'}}}});return supportRow(row);}
 return local(d=>{const row=(d.support||[]).find(x=>x.id===id);if(!row)throw Error('Conversation not found.');row.unreadAdmin=0;if(status)row.status=status;if(body){row.messages.push({id:randomUUID(),conversationId:id,sender:'admin',body,emailStatus:'pending',createdAt:now});row.unreadVisitor++;}row.updatedAt=now;return supportRow(row);},true);
}
export async function setSupportEmail(messageId:string,emailStatus:string){if(hasDatabase()){await prisma.supportMessage.update({where:{id:messageId},data:{emailStatus}});return;}return local(d=>{for(const row of d.support||[]){const m=row.messages.find(x=>x.id===messageId);if(m){m.emailStatus=emailStatus;break;}}},true);}
