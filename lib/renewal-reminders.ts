import 'server-only';
import {getManagedSite,listManagedSites,setReminderLog,type ManagedSite} from './managed-sites';
import {sendMail,smtpConfigured} from './smtp';
import {aed,renewalDays,renewalThresholds} from './renewal-forecast';
function recipient(){if(!smtpConfigured()||!process.env.CONTACT_EMAIL)throw Error('Hostinger SMTP and CONTACT_EMAIL must be configured.');return process.env.CONTACT_EMAIL;}
export function reminderText(site:ManagedSite,type:'domain'|'server'){
 const date=type==='domain'?site.domainRenewal:site.serverRenewal,charge=type==='domain'?site.domainCharge:site.serverCharge;
 return `${site.clientName}\n${site.label}\n${site.url}\n\n${type} renewal: ${date?.slice(0,10)||'Not set'}\nProvider: ${(type==='domain'?site.domainProvider:site.serverProvider)||'Not set'}\nExpected client charge: ${charge==null?'Not entered - review private notes':aed(charge)}\n\nPrivate notes:\n${site.notes||'None'}\n\nOpen Admin / Client sites to review.`;
}
export async function sendTestRenewalReminder(id:string){const to=recipient(),site=await getManagedSite(id);if(!site)throw Error('Managed website not found.');await sendMail({to,subject:`TEST: ${site.label} renewal reminder`,text:`Test only. Scheduled reminder history has not changed.\n\n${reminderText(site,'domain')}\n\n${reminderText(site,'server')}`});return {sent:1};}
export async function sendRenewalReminders(now=new Date()){
 const to=recipient(),sites=await listManagedSites();let sent=0;
 for(const site of sites.filter(s=>s.active))for(const type of ['domain','server'] as const){const raw=type==='domain'?site.domainRenewal:site.serverRenewal;if(!raw)continue;const days=renewalDays(raw,now);if(!renewalThresholds.includes(days))continue;const key=`${type}:${raw.slice(0,10)}:${days}`;if(site.reminderLog[key])continue;await sendMail({to,subject:`${days===0?'Due today':days+' days'}: ${site.label} ${type} renewal`,text:reminderText(site,type)});site.reminderLog[key]=now.toISOString();await setReminderLog(site.id,site.reminderLog);sent++;}return {checked:sites.length,sent};
}
