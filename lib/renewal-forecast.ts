import type {ManagedSite} from './managed-sites';
export const renewalThresholds=[30,20,15,7,1,0];
export const dubaiDate=(now=new Date())=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Dubai',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
export const renewalDays=(due:string,now=new Date())=>Math.round((Date.parse(due.slice(0,10))-Date.parse(dubaiDate(now)))/86400000);
export const aed=(amount:number)=>new Intl.NumberFormat('en-AE',{style:'currency',currency:'AED'}).format(amount);
export function renewalForecast(sites:ManagedSite[],month:string){
 const entries=sites.filter(s=>s.active).flatMap(site=>(['domain','server'] as const).flatMap(type=>{
 const date=type==='domain'?site.domainRenewal:site.serverRenewal,charge=type==='domain'?site.domainCharge:site.serverCharge;
 return date?.slice(0,7)===month?[{id:site.id,label:site.label,client:site.clientName,type,date:date.slice(0,10),charge:charge??null}]:[];
 })).sort((a,b)=>a.date.localeCompare(b.date));
 return {entries,total:entries.reduce((sum,x)=>sum+Math.round((x.charge??0)*100),0)/100,missing:entries.filter(x=>x.charge===null).length};
}
