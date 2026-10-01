"use client";
import {useState} from 'react';
import Link from 'next/link';

export default function Recovery(){
  const [email,setEmail]=useState('');
  const [code,setCode]=useState('');
  const [password,setPassword]=useState('');
  const [sent,setSent]=useState(false);
  const [done,setDone]=useState(false);
  const [message,setMessage]=useState('');
  const [busy,setBusy]=useState(false);
  async function submit(action:'request'|'reset'){
    setBusy(true);setMessage('');
    try{
      const response=await fetch('/api/auth/recovery',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(action==='request'?{action,email}:{action,code,password})});
      const result=await response.json();
      setMessage(result.message||result.error||'Unable to complete recovery.');
      if(response.ok&&action==='request')setSent(true);
      if(response.ok&&action==='reset'){setDone(true);setPassword('');setCode('');}
    }catch{setMessage('Unable to connect. Please try again.');}
    finally{setBusy(false);}
  }
  return <main id="main" className="login-page"><div className="login-card">
    <h1>Recover access.</h1>
    <p>{done?'Your password has been updated.':sent?'Enter the 8-digit code sent to your admin email. It expires in 10 minutes.':'Get an 8-digit verification code by email to reset your password.'}</p>
    {!done&&<form onSubmit={async event=>{event.preventDefault();await submit(sent?'reset':'request');}}>
      {!sent?<label>Admin email<input type="email" autoComplete="email" value={email} onChange={event=>setEmail(event.target.value)} required maxLength={254}/></label>:<>
        <label>Email verification code<input type="text" inputMode="numeric" pattern="[0-9]{8}" autoComplete="one-time-code" value={code} onChange={event=>setCode(event.target.value.replace(/\D/g,'').slice(0,8))} required maxLength={8}/></label>
        <label>New password<input type="password" autoComplete="new-password" value={password} onChange={event=>setPassword(event.target.value)} required minLength={12} maxLength={72}/></label>
      </>}
      <button className="button button-dark" disabled={busy}>{busy?'Working…':sent?'Reset password':'Send verification code'}</button>
    </form>}
    {sent&&!done&&<button className="small-button" disabled={busy} onClick={()=>submit('request')}>Send a new code</button>}
    <p role="status" aria-live="polite">{message}</p>
    <Link href="/admin/login">{done?'Sign in with your new password':'Back to sign in'}</Link>
  </div></main>;
}
