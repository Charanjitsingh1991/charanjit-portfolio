import 'server-only';
import {NextResponse} from 'next/server';

export async function verifyCaptcha(token:unknown,action:'inquiry'|'support'){
  const secret=process.env.RECAPTCHA_SECRET_KEY;
  const siteKey=process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if(!secret&&!siteKey)return null;
  if(!secret||!siteKey)return NextResponse.json({error:'Spam protection is not fully configured. Please contact me by email.'},{status:503});
  if(typeof token!=='string'||!token||token.length>4096)return NextResponse.json({error:'Complete the CAPTCHA before sending.'},{status:400});
  try{
    const response=await fetch('https://www.google.com/recaptcha/api/siteverify',{method:'POST',body:new URLSearchParams({secret,response:token}),signal:AbortSignal.timeout(10000)});
    if(!response.ok)throw Error('CAPTCHA service unavailable');
    const result=await response.json();
    const host=new URL(process.env.SITE_URL||'https://thecharanjitsingh.com').hostname;
    const allowed=new Set([host,host.startsWith('www.')?host.slice(4):'www.'+host]);
    if(result.success!==true||!allowed.has(result.hostname)||result.action!==action||typeof result.score!=='number'||result.score<0.5)return NextResponse.json({error:'Spam protection could not verify this request. Please try again or contact me by email.'},{status:400});
    return null;
  }catch{return NextResponse.json({error:'CAPTCHA verification is temporarily unavailable. Try again shortly.'},{status:503});}
}
