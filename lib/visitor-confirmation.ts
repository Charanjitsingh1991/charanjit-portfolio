import {sendMail,smtpConfigured} from './smtp';import {getContent,metric} from './platform-state';import {listProjects,updateInquiry,type Inquiry} from './store';
export async function afterInquiry(inquiry:Inquiry){
 const site=await getContent();
 {const project=(await listProjects()).find(p=>p.title===inquiry.project);await metric(project?'/work/'+project.slug:inquiry.source||'/contact','inquiries',inquiry.id);}
 if(inquiry.confirmationStatus==='sent')return;
 if(!site.confirmationEmailEnabled){await updateInquiry(inquiry.id,{confirmationStatus:'disabled'});return;}
 if(!smtpConfigured()){await updateInquiry(inquiry.id,{confirmationStatus:'unconfigured'});return;}
 try{await sendMail({to:inquiry.email,replyTo:site.email,subject:'Your inquiry has been received',text:'Hello '+inquiry.name+',\n\nThank you for getting in touch. Your inquiry has been received and saved. I will respond using this email address.\n\n'+site.name+'\n'+site.email});await updateInquiry(inquiry.id,{confirmationStatus:'sent'});}catch{await updateInquiry(inquiry.id,{confirmationStatus:'failed'});}
}
