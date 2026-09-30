# Charanjit Singh — portfolio and private admin

The original Three.js hero, four role colors, scrolling reveals, technology marquee, card grids, timeline, and light/dark palettes are retained. Functional additions include project detail pages, a printable CV, an authenticated project editor with image uploads, and an inquiry inbox with email notifications.

## Local preview

Node 20.9+ is required. Install with npm ci, then run npm run dev. Without DATABASE_URL, development uses a local JSON store in .data/portfolio.json. This is for one Node process on a persistent disk only. Uploaded local images live under .data/uploads and are served through a validated image route.

A local preview account, when generated for this workspace, is documented in .data/LOCAL-ACCESS.md. That private file and .env.local are ignored by Git. No default password exists in application source.

For new credentials run npm run admin:credentials. The script writes a private credential file under .data. Set ADMIN_EMAIL, ADMIN_PASSWORD_HASH_BASE64, and AUTH_SECRET in the environment. The base64 setting stores an encoded bcrypt hash, not a recoverable password.

## Production setup

1. Create a MySQL database in Hostinger. Set `DATABASE_URL` using the format in `.env.example`.
2. Configure SITE_URL to the exact HTTPS origin visitors will use. Redirect alternate domains to this canonical origin at the host.
3. Set a unique ADMIN_EMAIL, ADMIN_PASSWORD_HASH_BASE64, and AUTH_SECRET. Generate production values separately from local preview values.
4. Run `npm run db:deploy` against the intended MySQL database, then `npm run db:seed`. Seeding inserts missing projects and preserves existing edits.
5. Set `HOSTINGER_UPLOADS=true` and `UPLOADS_DIR` to a persistent writable directory. Uploads accept PNG, JPEG, WebP, PDF, and MP4 files up to 4 MB.
6. Create a Hostinger mailbox and set `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM`, and `CONTACT_EMAIL`.
7. Run `npm run build` and deploy the Node.js application through Hostinger. Do not set `ALLOW_LOCAL_STORAGE` in production.
8. Verify a real inquiry appears in Admin > Inquiries and reaches the receiving mailbox. Also test password recovery before launch.

After adding the environment variables, open Admin > Connections and use **Send SMTP test email**. The button is enabled only when every required SMTP setting and `CONTACT_EMAIL` are present. Hostinger commonly uses `smtp.hostinger.com` with port 465 and a secure connection; use the exact values shown for your mailbox in hPanel.

The project does not auto-provision paid services or store production credentials in public files. A production environment without database configuration still renders the bundled published catalog, but admin data operations and inquiry submission fail clearly rather than pretending to save.

### Existing database from the original project

The included migration is a clean MySQL baseline for a new Hostinger database. Do not run it against the earlier PostgreSQL version. Export any real data first and import it through a reviewed conversion process. No migration was applied to an external database during implementation.

## Admin features

- Overview: published projects, drafts, and new inquiries.
- Projects: add/edit/delete, unique slugs, order, featured status, draft/public status, cover alt text, uploads, gallery, challenge/solution/outcome, live and repository links.
- Inquiries: search, status filters, private notes, archive, reply through your email app, retry email notifications, CSV export.
- Connections: storage/email/upload configuration status. Secrets stay in host environment variables.

A public API never returns drafts. Public detail pages and sitemap use only published projects. Admin APIs validate the session independently of page middleware.

## Inquiry delivery

The contact form validates input and consent, uses a honeypot and persistent rate limits, saves the inquiry first, and then sends a notification through Hostinger SMTP. A request UUID makes repeated submissions idempotent. Failed or unconfigured notifications remain visible in the inbox and can be retried. No third-party contact message is sent during automated tests.

Notifications go only to CONTACT_EMAIL, with the visitor address as Reply-To. Replies from the admin open your mail client; the app does not send replies on your behalf.

## Content and media migration

The bundled catalog contains the ten original seed projects, Agri Cropwise, Hindi Quran Viewer, and three freelance projects from the original experience section (15 total). All have new, local vector illustrations in public/work/covers. These are labelled project covers, not actual screenshots. Regenerate them with npm run covers:generate. Existing /portfolio/[slug] links redirect to /work/[slug]; /work/rnz-cropwise redirects to /work/agri-cropwise.

In Admin > Projects > Edit, choose an illustrated cover or upload your own image, add gallery samples, reorder/remove them, and set the live demo and repository links. Save & publish applies changes to public pages. Existing external links are preserved. The first published, featured app drives the homepage spotlight, including its title, description, cover, and live link. Unpublishing it removes it from public views.

For an existing store, run npm run content:presentation before seeding to apply the Cropwise rename and replace only old seed covers; uploaded images, galleries, and edited links are preserved. Export DATABASE_URL when targeting an existing database. Without it, the script updates the local store and saves a backup. The legacy source URLs remain in lib/legacy-projects.json. Original legacy screenshots were not downloaded. Existing business metrics remain from the supplied content and should be checked before publication.

## Verification

## Support chat

The public support button stores visitor conversations in MySQL and refreshes both sides every five seconds. It shows online only Monday–Friday, 9:00 AM–6:00 PM Gulf Standard Time while an admin session is active. Visitor messages notify `CONTACT_EMAIL` through Hostinger SMTP; admin replies are emailed to the visitor and remain in the same browser support session.

After uploading this release, run `npm run db:deploy` once to apply `20260927000100_support_chat`. Conversations appear under **Admin → Support**.

## Search and AI discovery

Set `SITE_URL=https://thecharanjitsingh.com` before building. The site publishes canonical metadata, Person and Service structured data, focused service pages, `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, and `llms.txt`. After deployment, submit the sitemap in Google Search Console and Bing Webmaster Tools and request indexing for the homepage, About, Services, and Portfolio pages.

## Client website tracker

**Admin → Client sites** stores client domains, hosting providers, domain/server renewal dates, notes, uptime response details, mobile PageSpeed scores, and essential on-page SEO findings. `PAGESPEED_API_KEY` is optional but recommended for reliable Google PageSpeed quota.

Set `CRON_SECRET` to a random value of at least 24 characters. In Hostinger, add a daily cron job using:

```sh
curl -fsS -H "Authorization: Bearer YOUR_CRON_SECRET" "https://thecharanjitsingh.com/api/cron/renewals"
```

Run it once daily. Renewal emails are sent at 30, 20, 15, 7, 1, and 0 days before expiry, with each threshold sent only once. Run `npm run db:deploy` after uploading this release to apply the managed-sites migration.

- npm run typecheck
- npm run build
- npm run test:platform (requires a current build; runs an isolated local server/store and deletes only its generated test data)
- npm run lint

The platform tests cover auth protection, same-origin checks, project publishing and draft privacy, project routes, redirects, inquiry validation and idempotency, admin updates, and upload validation. Configure and separately test live Hostinger MySQL, SMTP, and persistent uploads before launch.

## Operating notes

Back up the Hostinger MySQL database and the directory configured by `UPLOADS_DIR`. Remove old inquiry records under an appropriate retention policy. Project deletion does not delete shared media files. Rate-limit expiry records are periodically cleaned up. Local JSON storage is not suitable for production. Platform security checks complement Hostinger firewall and monitoring controls.

## Expanded studio

- **Site content:** edit profile, four work areas, services, skills, experience, education, certifications, contact details, CV link, testimonials, and global search/social metadata. Drafts autosave; Publish applies them. Only testimonials explicitly approved for publication reach public pages.
- **Projects:** videos (direct MP4 URLs), PDF case studies, results, project SEO/social images, reusable media picker, and project-specific inquiries. Galleries open full screen and support arrow keys, Escape, and touch swipes.
- **Media:** batch upload PNG/JPEG/WebP/PDF/MP4 files (4 MB each), descriptions, folders, reusable URLs. Use an external HTTPS MP4 URL for larger videos. Files remain public; removing a gallery item does not erase a shared upload.
- **History & trash:** soft deletion, restore projects as drafts, the latest 150 saved revisions across site/projects, and autosaved draft recovery. Restoration never silently publishes a deleted project.
- **Inquiries:** contacted/proposal sent/won/closed stages, follow-up dates, notes, source project, notification and visitor-confirmation status, CSV export. Dates are visible follow-up prompts in the inbox; they do not schedule external notifications.
- **Analytics:** aggregate views and attributed inquiries over 90 days. No cookies, visitor identifiers, or IP addresses are stored. Browser Do Not Track is respected. These are approximate event totals, not unique visitors or fraud-proof attribution.
- **Security:** authenticator setup with proof of possession, eight single-use recovery codes, encrypted authenticator key, session revocation, password reset, and the latest 300 admin activity records. Enable two-factor yourself in Security and keep recovery codes privately. Enrollment and password reset revoke all existing sessions.

Apply `npm run db:deploy` before starting the application against Hostinger MySQL. Local previews create `.data/platform.json` automatically. MySQL updates lock the platform state row to avoid overwriting concurrent changes. The compact state document is intended for a personal portfolio, not high-volume analytics.

Password recovery, inquiry notifications, and visitor confirmations use Hostinger SMTP. Recovery links expire after 20 minutes, are stored as hashes, work once, and do not disable two-factor. The reset token is carried in the browser fragment and cleared from the address bar on load. Enable visitor confirmation in Site content > Preferences after verifying SMTP delivery. Initial passwords come from Hostinger environment configuration; a completed reset stores a new bcrypt hash in private storage. Losing both the authenticator and every recovery code requires trusted server-side recovery; there is no public second-factor bypass.

Security implementation references: [TOTP specification, RFC 6238](https://www.rfc-editor.org/rfc/rfc6238) and [OWASP password recovery guidance](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html).
