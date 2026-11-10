# VIBE landing page

A pre-launch marketing and waitlist site for VIBE, a CRM for real estate owner-operators who run several business lines (real estate, mortgage, insurance, title, construction, investing) from one place.

Cinematic gold-on-black design with Three.js hero effects, scroll-driven sections, a waitlist form backed by SQLite, optional Resend email notifications, and a small password-protected admin dashboard to manage leads.

## Features

- Animated hero (React Three Fiber canvas + Framer Motion), splash screen, custom cursor, scroll progress
- Sections: pain points, chat-style "voice of the market", features, comparison table, workflow, "founding 50" offer, tech stack, CTA
- Waitlist API (`/api/waitlist`) with Zod validation, origin check and rate limiting; stores leads in SQLite (`data/vibe.db`)
- Optional Resend notification email per signup
- `/admin`: password-protected lead list with status and notes
- Privacy and terms pages, sitemap, robots, Open Graph / Twitter cards, JSON-LD, strict security headers (CSP, HSTS)

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Three.js / React Three Fiber / drei · better-sqlite3 · Resend · Zod

## Quick start

```bash
npm ci
cp .env.example .env.local   # set ADMIN_PASSWORD, optionally RESEND_*
npm run dev                  # http://localhost:3000
npm run lint
npm run build && npm start
```

The SQLite database is created automatically at `data/vibe.db` on first request (gitignored). `scripts/migrate-json.mjs` imports a legacy `waitlist.json` into it, if you have one.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `ADMIN_PASSWORD` | yes (for `/admin`) | Password for the admin dashboard; session tokens rotate daily |
| `RESEND_API_KEY` | no | Enables signup notification emails |
| `RESEND_NOTIFY_EMAIL` | no | Where signup notifications are sent |
| `VERCEL` | auto | Set by Vercel; switches SQLite to `/tmp` |

## Deploy

Any Node host with a writable disk works best (the waitlist lives in SQLite). On Vercel the database lives in `/tmp` and is wiped between cold starts, so rely on the Resend notifications as the durable record there, or swap `src/lib/db.ts` for a hosted database.

## Make it yours

- `src/lib/constants.ts`: brand name, tagline, domain, contact email, social handle, pricing perks, sample quotes, competitor table, tech stack
- `src/app/layout.tsx`: `SITE_URL`, metadata, JSON-LD organization
- `src/app/robots.ts`, `src/app/sitemap.ts`: your domain (currently `example.com`)
- `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`: replace "Your Company" and have them reviewed
- `src/components/sections/Footer.tsx`: social links
- `public/` images (`vibe-hero.jpeg`, `opengraph-image.jpeg`, `vibe-logo.png`, `favicon-source.jpeg`), `src/app/favicon.ico`, `src/app/apple-icon.png`
- `src/app/api/waitlist/route.ts`: the Resend `from` address (uses Resend's shared test sender by default)

The bundled Playfair Display font (`public/fonts/`) is licensed under the SIL Open Font License.

## License

MIT, see [LICENSE](LICENSE).
