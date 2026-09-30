import { SignJWT, jwtVerify } from 'jose';
export const SESSION_COOKIE = 'cs_session';
function secret() {
 const value = process.env.AUTH_SECRET;
 if (!value || value.length < 32 || value.includes('replace-with')) throw new Error('Configure AUTH_SECRET with at least 32 random characters.');
 return new TextEncoder().encode(value);
}
export async function createSession(email: string, sid: string) {
 return new SignJWT({email,role:'admin',sid}).setProtectedHeader({alg:'HS256'}).setIssuer('charanjit-portfolio').setAudience('portfolio-admin').setIssuedAt().setExpirationTime('12h').sign(secret());
}
export async function verifySession(token?: string) {
 if (!token) return null;
 try {
  const {payload} = await jwtVerify(token,secret(),{algorithms:['HS256'],issuer:'charanjit-portfolio',audience:'portfolio-admin'});
  if(payload.role!=='admin'||typeof payload.email!=='string'||payload.email.toLowerCase()!==process.env.ADMIN_EMAIL?.toLowerCase())return null;
  return {email:payload.email,role:'admin',sid:typeof payload.sid==='string'?payload.sid:''};
 } catch { return null; }
}