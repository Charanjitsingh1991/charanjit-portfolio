import 'server-only';
import {state} from './platform-state';
import {sendMail,smtpConfigured} from './smtp';
import {setSupportEmail,type SupportConversation} from './store';

export const SUPPORT_HOURS='Monday–Friday, 9:00 AM–6:00 PM GST';
export async function supportPresence(){
 const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',weekday:'short',hour:'numeric',hour12:false}).formatToParts();
 const weekday=parts.find(p=>p.type==='weekday')?.value||'';const hour=Number(parts.find(p=>p.type==='hour')?.value||0);
 const businessHours=!['Sat','Sun'].includes(weekday)&&hour>=9&&hour<18;
 const adminActive=await state(s=>s.security.sessions.some(x=>x.expires>Date.now()));
 return {online:businessHours&&adminActive,businessHours,adminActive,hours:SUPPORT_HOURS};
}
export async function notifySupport(conversation:SupportConversation,messageId:string,body:string,toVisitor=false){
 let status='unconfigured';
 try{if(!smtpConfigured())throw Error('SMTP is not configured');
  if(toVisitor)await sendMail({to:conversation.email,subject:'Reply from Charanjit Singh support',text:`Hi ${conversation.firstName},\n\n${body}\n\nReply by visiting ${process.env.SITE_URL||'https://thecharanjitsingh.com'} and opening Support.`});
  else if(process.env.CONTACT_EMAIL)await sendMail({to:process.env.CONTACT_EMAIL,replyTo:conversation.email,subject:`New support message from ${conversation.firstName} ${conversation.lastName}`,text:`From: ${conversation.firstName} ${conversation.lastName}\nEmail: ${conversation.email}\n\n${body}\n\nOpen the admin Support panel to reply.`});
  else throw Error('CONTACT_EMAIL is not configured');status='sent';
 }catch{status=smtpConfigured()?'failed':'unconfigured';}
 await setSupportEmail(messageId,status);return status;
}
