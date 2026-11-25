# Rise Academy website

Website for Rise Academy (राइज़ एकेडमी), Sector 110, Gurugram: a public landing page plus a private admin CRM at
`/admin` for students, courses, fees, WhatsApp messages, Excel import and yearly Excel reports.

- **Live:** https://jatin3010.github.io/rise-academy/ (CRM: `/admin`)
- **Stack:** Next.js (static export), Tailwind, shadcn/ui, React Bits components, Supabase for the CRM data.

## Work on it

```bash
npm install
npm run dev     # http://localhost:3000 — the CRM needs .env.local, see supabase/README.md
npm test        # fee, import and report rules (lib/*.test.mjs)
npm run lint
```

## Deploy

Every push to `main` runs [.github/workflows/deploy.yml](.github/workflows/deploy.yml): tests, lint, build, then
publish to GitHub Pages. The CRM needs two repository variables, `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`
(public by design); setting up the database and admin logins is in [supabase/README.md](supabase/README.md).

Optional repository variables (GitHub → Settings → Secrets and variables → Actions → Variables), all public:

- `GA_MEASUREMENT_ID` — Google Analytics 4 (`G-…`). Counts visits, and Call / WhatsApp / call-back taps as leads.
- `GOOGLE_SITE_VERIFICATION` — the code from Search Console's "HTML tag" ownership check.

[keep-alive.yml](.github/workflows/keep-alive.yml) pings the database twice a week so the free Supabase project never pauses.

**Own domain:** set `SITE_URL` in `lib/site.ts`, add the domain in GitHub → Settings → Pages → Custom domain, point
the domain's DNS at GitHub Pages, and add it to Search Console. The base path then drops to `/` by itself.

## Where things are

- `app/page.tsx`, `app/hero.tsx` — the home page; `lib/site.ts` — phone, address, rating, reviews, FAQ, UPI ID, Instagram, class videos (YouTube) and review videos (`public/reviews/`).
- `app/(pages)/` — the course pages (`/courses/<slug>/`, one per group in `lib/courses.ts`) and the privacy policy.
- `app/admin/` — the CRM screens; `lib/fees.ts`, `lib/import.ts`, `lib/report.ts` — its rules, with tests next to them.
- `lib/courses.ts` — the course list, shared by the site and the CRM.
- `supabase/schema.sql` — tables and access rules (safe to run again).
