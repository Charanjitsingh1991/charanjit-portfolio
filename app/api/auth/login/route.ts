import {newSession,verifySecondFactor} from '@/lib/admin-security';
import {NextResponse} from 'next/server';
import {verifyCredentials} from '@/lib/credentials';
import {createSession,SESSION_COOKIE} from '@/lib/session';
import {sameOrigin,readJson} from '@/lib/http';
import {rateLimit} from '@/lib/store';
export async function POST(req:Request){
 if(!sameOrigin(req))return NextResponse.json({error:'Invalid origin'},{status:403});
 try{
  if(!process.env.ADMIN_EMAIL||!(process.env.ADMIN_PASSWORD_HASH||process.env.ADMIN_PASSWORD_HASH_BASE64)||!process.env.AUTH_SECRET)return NextResponse.json({error:'Admin access has not been configured. Follow the setup guide.'},{status:503});
  const body=await readJson(req,2000);
  if(typeof body.email!=='string'||typeof body.password!=='string'||body.email.length>254||body.password.length>200)return NextResponse.json({error:'Invalid credentials'},{status:400});
  const allowed=await rateLimit('login:'+body.email.toLowerCase(),8,15*60*1000);
  if(!allowed)return NextResponse.json({error:'Too many attempts. Try again in 15 minutes.'},{status:429,headers:{'Retry-After':'900'}});
  if(!await verifyCredentials(body.email,body.password))return NextResponse.json({error:'Invalid email or password'},{status:401});
  if(typeof (body.code||'')!=='string'||!await verifySecondFactor(body.code||''))return NextResponse.json({error:'Enter a valid authenticator or recovery code.'},{status:401});
  const sid=await newSession(req.headers.get('user-agent')||'Unknown browser');const res=NextResponse.json({ok:true});res.cookies.set(SESSION_COOKIE,await createSession(body.email,sid),{httpOnly:true,secure:process.env.NODE_ENV==='production'&&process.env.ALLOW_LOCAL_STORAGE!=='true',sameSite:'strict',path:'/',maxAge:43200});return res;
 }catch{return NextResponse.json({error:'Sign-in unavailable. Check server configuration.'},{status:503});}
}