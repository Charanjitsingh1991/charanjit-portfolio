# Charanjit Singh — Portfolio (Next.js)

Award-style portfolio with a Three.js hero, role switcher, automatic **day/night theme by location**, Framer Motion animations, and a **self-hosted admin panel** that adds/edits/deletes projects which appear on the site instantly.

Stack: **Next.js 14 (App Router) · TypeScript · Three.js · Framer Motion · Prisma · PostgreSQL (Neon) · JWT auth**. Deploys free on **Vercel + Neon**.

---

## 1. Run locally

```bash
npm install
cp .env.example .env        # then fill in the values (see below)
npm run db:push             # creates the Project table in your database
npm run db:seed             # loads your existing 10 projects (optional)
npm run dev                 # http://localhost:3000  ·  admin: /admin
```

### Environment variables (`.env`)
| Key | What it is |
|-----|------------|
| `DATABASE_URL` | Neon **pooled** connection string (ends with `-pooler...`) |
| `DIRECT_URL` | Neon **direct** connection string (used by migrations) |
| `ADMIN_EMAIL` | the email you log into `/admin` with |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of your password (generate below) |
| `AUTH_SECRET` | long random string for signing your session |

Generate the password hash and secret:
```bash
node -e "console.log(require('bcryptjs').hashSync('YOUR_PASSWORD',10))"   # -> ADMIN_PASSWORD_HASH
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"  # -> AUTH_SECRET
```

---

## 2. Deploy to Vercel + Neon (free)

**a. Create the database (Neon)**
1. Go to neon.tech → new project → copy the two connection strings (pooled + direct).

**b. Push the code**
1. Push this folder to a GitHub repo.
2. On vercel.com → **Add New → Project** → import the repo. Framework auto-detects as Next.js.

**c. Set env vars in Vercel** (Project → Settings → Environment Variables): add the five keys above.
> You can also add Neon straight from Vercel: Project → **Storage → Create Database → Neon**. It injects `DATABASE_URL`/`DIRECT_URL` for you.

**d. Create the table** — run once from your machine with the production strings in `.env`:
```bash
npm run db:push
npm run db:seed     # optional: loads your existing projects
```
(or use Neon's SQL editor — `prisma db push` is easiest.)

**e. Deploy.** Vercel builds automatically. Your admin lives at `https://yourdomain.com/admin`.

**f. Point your Hostinger domain at Vercel** — in Vercel → Project → Domains, add `thecharanjitsingh.com`; Vercel shows the DNS records. In Hostinger → Domains → DNS, set the `A` / `CNAME` records as shown. SSL is automatic.

---

## 3. Using the admin panel
- Go to `/admin`, sign in with `ADMIN_EMAIL` + your password.
- **Add a project:** title, category, cover image **URL**, description, live/repo links, tech tags. Save → it appears in the Work section immediately (the front fetches live).
- Edit, delete, reorder (`order` field), mark **Featured** or save as **draft** (unpublished, hidden from the site).
- **Images:** paste any public image URL (your existing project images already live on your domain). To add file uploads later, wire `coverImage` to Cloudinary/Vercel Blob — the field stays the same.

---

## 4. Theme behaviour (day/night by location)
1. If the visitor ever clicks the toggle, their choice persists.
2. Otherwise it guesses from their **device clock** (reflects their location, no permission needed).
3. If they allow geolocation, it refines to **real sunrise/sunset** for their coordinates.
Both light and dark are hand-tuned palettes, not inverts.

---

## 5. Notes
- The home page is statically prerendered; the Work grid fetches `/api/projects` at runtime, so new projects show without a rebuild.
- To move off Neon to any other Postgres, just change `DATABASE_URL`. To use MySQL instead, set `provider = "mysql"` in `prisma/schema.prisma`.
- `npm run build` runs `prisma generate` automatically.
