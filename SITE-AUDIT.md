# Portfolio audit and enhancement plan

Reviewed: 21 September 2026.

## Scope and evidence

Reviewed all supplied page components, CSS, API routes, authentication helpers, database model, seed data, and configuration. Public web retrieval returned the older WordPress homepage, portfolio archive, and RNZ design case study; this workspace contains a different Next.js implementation. Do not attribute local-code defects to the WordPress production backend.

Direct browser navigation to the public domain failed with ERR_ABORTED. Web retrieval may contain cached content and does not establish current visual appearance or uptime. A local dependency installation made no observable progress and was stopped. No build, Lighthouse run, rendered mobile inspection, authenticated admin interaction, database connection, or email delivery test was completed. Responsive observations below are code-based risks, not screenshot-confirmed defects. No application source was changed.

## Overall direction

The strongest opportunity is to make the portfolio lead with work and evidence. The local implementation has a coherent token system, typography, light/dark palettes, reusable sections, filters, and a distinctive featured product. But it repeats capabilities across About, Services, Skills, and the marquee before visitors reach the project grid. Its breadth needs a clearer primary position and stronger proof.

Suggested position: Full-stack developer and designer building websites, AI products, and digital experiences. Retain marketing, data, and IT as supporting strengths, with relevant examples.

## Priority 0: resolve before deploying the local implementation

| Finding | Evidence | Required change |
| --- | --- | --- |
| Draft project data is public | `app/api/projects/route.ts` GET queries every row; `components/Works.tsx` only hides drafts after download | Filter published projects on the server. Provide an authenticated admin listing for drafts. Verify unauthenticated responses never contain draft fields. |
| Known fallback signing secret | `lib/session.ts` uses a hardcoded fallback when AUTH_SECRET is absent | Fail closed when the secret is missing; enforce adequate configuration at deployment. Validate admin role and expected claims. This is conditional on missing configuration, not evidence of compromise. |
| Existing media and routes may be lost during migration | Seed images and CV use `/wp-content/uploads`; several project links use `/portfolio/...`, which has no corresponding local route or redirect | Inventory and copy required assets, recreate case studies, map existing URLs to preserved routes or permanent redirects, and test every URL before switching the domain. |

## Priority 1: functionality, accessibility, and credibility

1. **Contact is an email-client launcher.** `components/Contact.tsx` does not submit to a service. The note discloses this, but the primary button implies sending. Implement a real form endpoint, server validation, spam protection, loading/success/error states, and a direct email fallback. If keeping mailto, label the button “Open email draft.” Associate labels with inputs and use a semantic form.
2. **Database failures look like an empty portfolio.** The public API catches errors and returns HTTP 200 with an empty array. Works then tells public visitors to add projects through admin. Return a meaningful error, log it server-side, show a visitor-friendly retry state, and distinguish an empty category from failed loading. Prefer server-rendered initial published projects with a deliberate refresh policy.
3. **Insufficient text contrast.** Calculations from CSS tokens: light faint text `#8C97A3` on white is 2.97:1; dark faint text `#5C6B7C` on `#0A0E13` is 3.55:1; light teal `#0E9E8E` on `#F4F1EA` is 2.96:1; light gold `#C0892F` on that background is 2.71:1. Adjust foreground colors separately from decorative accents and test every theme/role combination. Normal text needs 4.5:1 and qualifying large text 3:1 under WCAG AA.
4. **Mobile menu is hidden only by transform.** Its links remain in the DOM without inert/visibility handling. Add an explicit accessible open state, aria-expanded/controls, Escape handling, focus restoration, and exclusion of collapsed links from keyboard navigation.
5. **Role selector semantics are incomplete.** A tablist contains ordinary buttons without tab roles, selected states, panels, or keyboard behavior. These controls mostly change presentation, so a labelled group of aria-pressed buttons may be more appropriate. Add selected states to project filters too.
6. **Motion preferences are incompletely respected.** HeroThree continues rendering and rotating the icosahedron under reduced motion. Reveal uses JavaScript animation unaffected by the CSS duration override. The CSS override shortens infinite animations instead of explicitly disabling them. Use a static reduced-motion state, stop unnecessary frame loops, and make reveal content visible without animation.
7. **Content depends on JavaScript.** Reveal starts content at opacity zero; projects load only after client hydration; counters initially show zero. Keep meaningful content visible and render final metric values in initial HTML.
8. **Theme requests location automatically.** ThemeProvider calls geolocation on mount without checking prior permission. Prefer system theme with Light/Dark/System choices; offer location-based behavior only as an explicit option. Handle unavailable storage gracefully.
9. **Claims need consistent evidence.** Hero says 10+ years while About says eight-plus; the five-disciplines heading precedes six cards. Metrics repeat without dates, baselines, or supporting case studies. Reconcile wording and attach legitimate evidence to each business result. Confirm current location, CV, and social handles across versions.
10. **Admin input and failure handling are thin.** Validate field types, URL protocols, categories, lengths, IDs, and integer ordering server-side. Handle invalid JSON, missing records, and database errors consistently. Add login throttling; infrastructure-level protection was not inspected. Delete and load actions need error feedback. Draft saves should not announce that the project is live.

## Section-by-section design changes

| Area | Current concern | Proposed treatment |
| --- | --- | --- |
| Navigation | Seven section links plus CV and theme; crowded intermediate-width risk | Work, Services, About, Contact; CV secondary; theme easy to access on mobile; active-section feedback |
| Hero | Long positioning paragraph, rotating roles, particles, counters, and several competing signals | Stable outcome headline, concise introduction, two CTAs, and one substantial real project visual or portrait |
| About | Six dense capability cards repeat services | Short personal introduction, portrait, working style, and three differentiators |
| Services | All cards lead to the same generic contact destination | Three main offer groups with deliverables, relevant proof, and inquiry links that preselect the service |
| Skills | Large chip inventory competes with project evidence | Compact grouped expertise; link key skills to actual work; reserve the full list for About or CV |
| CropWise | CSS phone illustration rather than demonstrated product screens | Real screenshots, concise demo, ownership/constraints/results, and a dedicated case study; clearly label any illustrative mockup |
| Work | Uniform small cards; external-only destinations; featured flag unused | One prominent featured project, 3–6 selected projects, larger images, outcome captions, local case studies, separate live/repository actions |
| Experience | Long resume-style sequence | Three recent roles and selected achievements; expandable older experience or a dedicated About page |
| Education | Twelve certificate cards add substantial length | Highlight 3–4 relevant credentials with verification links; expand the rest on demand |
| Contact | Long contact rows and a mailto form | Accessible delivered form, email copy action, truthful availability, optional call scheduling |
| Footer | Limited context | Compact navigation, current copyright, relevant social links, and appropriate inquiry privacy information |

## Visual system proposal

- Retain Syne/Manrope if they suit the desired identity; use monospace sparingly for metadata. Avoid tiny, widely spaced uppercase text for essential information.
- Keep dark and warm-light themes, with a stable brand accent. Role color changes can be local to a component instead of changing the entire page every six seconds.
- Introduce visual variety: an editorial introduction, large project panels, compact service rows, and a restrained timeline. Repeating rounded cards for every section weakens hierarchy.
- Use real screenshots, packaging photography, brand applications, and a professional portrait. Standardize image crops and backgrounds while preserving the distinct identity of each client.
- Give the homepage a consistent spacing scale, with smaller section gaps on phones. Current sections retain 110px vertical padding on mobile, which compounds the long content sequence.
- Add explicit focus-visible styling and interaction parity for keyboard and touch. Reserve movement for feedback and a small number of purposeful reveals.
- Use a lightweight static hero fallback if WebGL is unavailable. Consider deferred 3D loading and lower-complexity mobile rendering.

Suggested homepage order: Hero → selected client/result proof → featured work → selected projects → services → short About/experience → verified testimonials → contact → footer. Keep detailed education and stack information off the main conversion path.

Example hero copy:

> I build websites and AI products—and the design systems behind them.
>
> I’m Charanjit Singh, a full-stack developer and designer based in Abu Dhabi. I help businesses turn complex ideas into useful digital experiences.
>
> Explore my work · Discuss a project

Confirm the location and emphasis before publication.

## Responsive checks required

- At 320–390px, contact rows combine a fixed 90px label, a 16px gap, and a long unbroken email. Stack labels and values, permit safe wrapping, and verify no clipping. Body overflow-x hidden can conceal overflow rather than solve it.
- Around 881–1024px, check navigation fit before the burger breakpoint; use a content-driven breakpoint.
- Inspect the abrupt About grid change from three columns to one below 900px; consider a two-column tablet layout.
- Verify role text wrapping, hero height, phone illustration text, filters, and admin row action widths.
- Test portrait/landscape, browser zoom, long project titles, large text, touch, keyboard-only use, both themes, every role accent, slow network, and failed media requests.

## SEO, performance, and maintainability

- Create indexable case-study routes using the existing slug field, with unique titles/descriptions, social images, and sensible canonical URLs.
- Add sitemap/robots handling and exclude admin pages from indexing. Add accurate Person/ProfilePage and project structured data where applicable.
- Preserve existing WordPress URLs and media during migration; do not switch hosting with only the homepage recreated.
- Replace the CSS Google Fonts import with an optimized/self-hosted font delivery strategy. Serve responsive compressed images with explicit sizing and useful alternative text.
- Defer heavy visual code, pause it when hidden, honor reduced motion, and dispose all Three.js geometries/materials on cleanup. Current cleanup omits several scene resources.
- Add observable error handling, an explicit content refresh policy, and a validated shared project model. Remove broad any usage where practical.
- Add reproducible type checking and lint configuration, and targeted tests for authentication, draft privacy, validation, and contact delivery. Dependencies were not installed successfully, so no build or dependency vulnerability assessment is claimed.
- Measure production performance before setting an optimization backlog; no speed score or conversion estimate is justified by this review.

## Older public-site observations

The retrieved homepage includes an empty shopping cart, a misspelled website category, certificate links to the theme vendor, and a Dubai contact location that differs from the local version. Remove irrelevant shopping UI, correct labels, replace template certificate links, and reconcile contact details. These observations are from retrieved content and need a fresh production check.

The retrieved portfolio archive has additional content, including a WordPress plugin project, beyond the ten local seed projects. Perform a complete content inventory rather than treating the seed as a full migration.

The retrieved RNZ case study provides a useful image gallery and deliverable descriptions. Improve the narrative with project dates, role, constraints, decisions, and evidence of outcomes; preserve its visual assets during migration.

## Enhancement backlog

High value: three detailed case studies; real product demo; verified testimonials; documented before/after examples; accessible project galleries; functional inquiry delivery; reliable project publishing; migration redirects.

Useful next: CMS image upload/preview and alt text; draft preview; featured ordering; inquiry service selection; scheduling; downloadable current CV; certificate verification; privacy-conscious conversion events for project views, CV downloads, and successful inquiries.

Optional: a maintained insights section, bilingual content if the target audience needs it, richer project filtering as the portfolio grows, and a carefully scoped interactive demo. Avoid adding more decorative motion before content and delivery problems are resolved.

## Delivery sequence and completion criteria

1. **Stabilize:** eliminate public drafts and fallback authentication, validate APIs, replace misleading failure states, deliver contact messages, and inventory old assets/routes.
2. **Restructure:** approve positioning, select strongest projects, shorten repeated content, and establish the homepage hierarchy.
3. **Redesign:** implement hero/project layouts, mobile typography/spacing, accessible colors/controls, and motion/theme improvements.
4. **Substantiate:** publish genuine screenshots, evidence-backed case studies, verified credentials, and permitted testimonials.
5. **Verify and launch:** run the production build, test draft privacy and admin flows, verify real inquiry receipt, crawl migrated links, test keyboard/mobile/reduced-motion behavior, and measure performance on the final deployment.

Launch is ready when inquiries arrive reliably, draft content stays private, all migrated assets/routes work, primary content survives failed animation, both themes meet contrast requirements, and key journeys pass on mobile and desktop.

## Sources

- Public homepage: https://thecharanjitsingh.com/
- Public portfolio archive: https://thecharanjitsingh.com/portfolio/
- RNZ design case study: https://thecharanjitsingh.com/portfolio/rnz-group-design-portfolio/
- W3C contrast guidance: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
