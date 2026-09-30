import {state} from './platform-state';
import bcrypt from "bcryptjs";

export async function verifyCredentials(email: string, password: string) {
  const okEmail =
    email.trim().toLowerCase() === (process.env.ADMIN_EMAIL || "").toLowerCase();
  const stored=await state(s=>s.security.passwordHash);
  const hash = stored || (process.env.ADMIN_PASSWORD_HASH_BASE64 ? Buffer.from(process.env.ADMIN_PASSWORD_HASH_BASE64, "base64").toString("utf8") : process.env.ADMIN_PASSWORD_HASH || "");
  const okPass = hash ? await bcrypt.compare(password, hash) : false;
  return okEmail && okPass;
}
