import {cookies} from 'next/headers';import {SESSION_COOKIE,verifySession} from './session';
export async function adminSession(){const session=await verifySession((await cookies()).get(SESSION_COOKIE)?.value);if(!session?.sid)return null;const {sessionActive}=await import('./admin-security');return await sessionActive(session.sid)?session:null;}
export async function isAdmin(){return !!await adminSession();}
export function sameOrigin(req:Request){const origin=req.headers.get('origin');if(!origin)return false;return origin===new URL(process.env.SITE_URL||req.url).origin;}
export async function readJson(req:Request,limit=40000){
 if(Number(req.headers.get('content-length'))>limit)throw Error('Request too large');
 const reader=req.body?.getReader();if(!reader)throw Error('Missing body');const chunks:Uint8Array[]=[];let size=0;
 try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>limit){await reader.cancel();throw Error('Request too large');}chunks.push(value);}}finally{reader.releaseLock();}
 return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}