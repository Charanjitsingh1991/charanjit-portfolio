import 'server-only';
import {NextResponse} from 'next/server';

type Assessment = {
  tokenProperties?: {valid?:boolean; hostname?:string; action?:string; invalidReason?:string};
  riskAnalysis?: {score?:number};
};

const error=(message:string,status:number)=>NextResponse.json({error:message},{status});

export async function verifyCaptcha(token:unknown,action:'inquiry'|'support'){
  const apiKey=process.env.RECAPTCHA_ENTERPRISE_API_KEY;
  const projectId=process.env.RECAPTCHA_ENTERPRISE_PROJECT_ID;
  const siteKey=process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if(!apiKey&&!projectId&&!siteKey)return null;
  if(!apiKey||!projectId||!siteKey)return error('Spam protection is not fully configured. Please contact me by email.',503);
  if(typeof token!=='string'||!token||token.length>4096)return error('Complete the CAPTCHA before sending.',400);

  try{
    const url=`https://recaptchaenterprise.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/assessments?key=${encodeURIComponent(apiKey)}`;
    const response=await fetch(url,{
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify({event:{token,siteKey,expectedAction:action}}),
      signal:AbortSignal.timeout(10000),
    });
    if(!response.ok)return error('Spam protection is temporarily unavailable. Try again shortly.',503);
    const result=await response.json() as Assessment;
    const host=new URL(process.env.SITE_URL||'https://thecharanjitsingh.com').hostname.toLowerCase();
    const allowed=new Set([host,host.startsWith('www.')?host.slice(4):`www.${host}`]);
    const tokenProperties=result.tokenProperties;
    const valid=tokenProperties?.valid===true
      &&typeof tokenProperties.hostname==='string'
      &&allowed.has(tokenProperties.hostname.toLowerCase())
      &&tokenProperties.action?.toLowerCase()===action
      &&typeof result.riskAnalysis?.score==='number'
      &&result.riskAnalysis.score>=0.5;
    if(!valid)return error('Spam protection could not verify this request. Please try again or contact me by email.',400);
    return null;
  }catch{
    return error('Spam protection is temporarily unavailable. Try again shortly.',503);
  }
}
