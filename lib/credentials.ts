import bcrypt from "bcryptjs";

export async function verifyCredentials(email: string, password: string) {
  const okEmail =
    email.trim().toLowerCase() === (process.env.ADMIN_EMAIL || "").toLowerCase();
  const hash = process.env.ADMIN_PASSWORD_HASH || "";
  const okPass = hash ? await bcrypt.compare(password, hash) : false;
  return okEmail && okPass;
}
