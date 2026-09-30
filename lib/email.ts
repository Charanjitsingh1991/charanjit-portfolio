import {sendMail,smtpConfigured} from './smtp';import { type Inquiry, updateInquiry } from './store';
export async function notifyInquiry(inquiry:Inquiry){
 if(inquiry.emailStatus==='sent')return 'sent';
 if(!smtpConfigured()||!process.env.CONTACT_EMAIL){await updateInquiry(inquiry.id,{emailStatus:'unconfigured'});return 'unconfigured';}
 try{
  await sendMail({to:process.env.CONTACT_EMAIL,replyTo:inquiry.email,subject:'Portfolio inquiry: '+inquiry.service+' — '+inquiry.name,text:['New portfolio inquiry','Name: '+inquiry.name,'Email: '+inquiry.email,'Company: '+inquiry.company,'Service: '+inquiry.service,'Budget: '+inquiry.budget,'Project: '+(inquiry.project||'General inquiry'),'Source: '+(inquiry.source||'/contact'),'',inquiry.message,'','Manage: '+(process.env.SITE_URL||'http://localhost:3000')+'/admin'].join('\n')});
  await updateInquiry(inquiry.id,{emailStatus:'sent'});return 'sent';
 }catch{await updateInquiry(inquiry.id,{emailStatus:'failed'});return 'failed';}
}
