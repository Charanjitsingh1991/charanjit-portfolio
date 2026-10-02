"use client";
import {useState} from 'react';
import Script from 'next/script';
type API={ready:(callback:()=>void)=>void;execute:(key:string,options:{action:string})=>Promise<string>};
declare global {interface Window {grecaptcha?:API}}
export async function getCaptchaToken(action:'inquiry'|'support'){
  const siteKey=process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if(!siteKey)return '';
  return new Promise<string>((resolve,reject)=>{
    const timeout=setTimeout(()=>{clearInterval(poll);reject(Error('Spam protection is still loading. Please try again shortly.'));},12000);
    const run=()=>{const api=window.grecaptcha;if(!api?.ready||!api.execute)return;clearInterval(poll);api.ready(()=>{api.execute(siteKey,{action}).then(token=>{clearTimeout(timeout);resolve(token);}).catch(()=>{clearTimeout(timeout);reject(Error('Spam protection could not verify this request. Please try again.'));});});};
    const poll=setInterval(run,100);run();
  });
}
export default function GoogleCaptcha(){
  const [failed,setFailed]=useState(false),siteKey=process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if(!siteKey)return null;
  return <div className="captcha-control"><Script id="google-recaptcha" src={'https://www.google.com/recaptcha/api.js?render='+encodeURIComponent(siteKey)} strategy="afterInteractive" onError={()=>setFailed(true)}/>{failed?<p role="alert">Spam protection could not load. Check your connection or reload the page.</p>:<p>Protected by Google reCAPTCHA. <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacy</a> · <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">Terms</a></p>}</div>;
}
