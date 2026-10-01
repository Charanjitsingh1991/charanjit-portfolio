import {sendMail,smtpConfigured} from '@/lib/smtp';
import {NextResponse} from 'next/server';
import {sameOrigin,readJson} from '@/lib/http';
import {rateLimit} from '@/lib/store';
import {requestResetCode,resetPassword} from '@/lib/admin-security';

export async function POST(req:Request){
  if(!sameOrigin(req))return NextResponse.json({error:'Invalid origin'},{status:403});
  try{
    const body=await readJson(req,2500);
    if(body.action==='reset'){
      if(!await rateLimit('password-recovery-verify',10,900000))return NextResponse.json({error:'Too many attempts. Try again later.'},{status:429});
      if(typeof body.code!=='string'||!/^\d{8}$/.test(body.code)||typeof body.password!=='string'||body.password.length<12||body.password.length>72)return NextResponse.json({error:'Enter the 8-digit email code and a password of 12–72 characters.'},{status:400});
      try{await resetPassword(body.code,body.password);}catch{return NextResponse.json({error:'Invalid or expired email code. Request a new code if needed.'},{status:400});}
      return NextResponse.json({ok:true,message:'Password updated. Sign in with your new password and authenticator code if enabled.'});
    }
    if(body.action!=='request'||typeof body.email!=='string'||body.email.length>254)return NextResponse.json({error:'Enter your admin email address.'},{status:400});
    if(!await rateLimit('password-recovery-request',5,900000))return NextResponse.json({error:'Too many requests. Try again in 15 minutes.'},{status:429});
    if(!smtpConfigured())return NextResponse.json({error:'Email recovery is not connected. Configure Hostinger SMTP first.'},{status:503});
    const adminEmail=process.env.ADMIN_EMAIL;
    if(adminEmail&&body.email.trim().toLowerCase()===adminEmail.toLowerCase()){
      const code=await requestResetCode();
      try{await sendMail({to:adminEmail,subject:'Your portfolio admin verification code',text:`Your password reset code is ${code}.\n\nEnter it at ${(process.env.SITE_URL||'http://localhost:3000')+'/admin/recovery'}. It expires in 10 minutes and works once. If you did not request this, ignore this email. Your authenticator remains required for sign-in when enabled.`});}
      catch(error){const failure=error as {code?:string;responseCode?:number};console.error('Admin recovery email delivery failed',{code:failure.code,responseCode:failure.responseCode});return NextResponse.json({error:'The verification email could not be sent. Check the Hostinger SMTP mailbox and server logs.'},{status:503});}
    }
    return NextResponse.json({ok:true,message:'If the account matches, an 8-digit code has been sent. Check your inbox.'});
  }catch(error){console.error('Admin recovery request failed',error instanceof Error?error.message:'Unknown error');return NextResponse.json({error:'Password recovery is temporarily unavailable. Check the server logs or try again later.'},{status:503});}
}
