import {afterInquiry} from '@/lib/visitor-confirmation';import {NextResponse} from 'next/server';
import {inquirySchema} from '@/lib/validation';
import {sameOrigin,readJson} from '@/lib/http';
import {addInquiry,rateLimit} from '@/lib/store';
import {notifyInquiry} from '@/lib/email';
export async function POST(req:Request){
 if(!sameOrigin(req))return NextResponse.json({error:'Please submit through the contact form.'},{status:403});
 try{
  const parsed=inquirySchema.safeParse(await readJson(req,16000));
  if(!parsed.success)return NextResponse.json({error:parsed.error.issues[0].path.join('.')+': '+parsed.error.issues[0].message},{status:400});
  if(parsed.data.website)return NextResponse.json({ok:true},{status:201});
  if(!await rateLimit('inquiry:'+parsed.data.email.toLowerCase(),5,3600000)||!await rateLimit('inquiry-global',80,3600000))return NextResponse.json({error:'Too many messages. Please try later or email directly.'},{status:429,headers:{'Retry-After':'3600'}});
  const inquiry=await addInquiry(parsed.data);
  try{await notifyInquiry(inquiry);await afterInquiry(inquiry);}catch{console.error('Inquiry saved; notification status could not be updated.');}
  return NextResponse.json({ok:true,id:inquiry.id},{status:201});
 }catch{return NextResponse.json({error:'Your message could not be saved. Please try again or email charanjit@thecharanjitsingh.com.'},{status:503});}
}