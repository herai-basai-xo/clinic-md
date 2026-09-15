# ClinicMD — Dental Booking Web App

ClinicMD is a dental clinic booking management SPA. Staff, managers, and admins manage
bookings, dentists, chairs, treatments, payments, and discounts across multiple branches;
patients book through an org-scoped public flow.

## Tech stack

- **React 18 + Vite 5** SPA (JSX, not TypeScript)
- **Tailwind CSS 3** with a custom design-token theme (`tailwind.config.js`)
- **Supabase** — Postgres, Auth, Row-Level Security, Realtime (separate staging & production
  projects)
- **React Router v6** (Context API for state — no Redux), **Framer Motion**, **date-fns**,
  **Recharts**, **@dnd-kit**, **FullCalendar**

## Getting started

```bash
npm install
cp .env.example .env   # defaults to the staging Supabase project
npm start              # dev server on http://localhost:4028
```

Only Supabase `anon` keys belong in `.env`. Never put a `service_role` key in any env file.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Vite dev server (port 4028) |
| `npm run build` | Production build → `build/` |
| `npm run serve` | Preview the production build |
| `npm test` | Vitest unit tests |

## Project layout

```
src/
├── components/   # Shared + ui/ reusable components
├── contexts/     # Auth → Org → Branch → AIAssistant (+ Tenant for customer routes)
├── lib/          # supabase.js client singleton
├── pages/        # Route pages (org-scoped: /:orgSlug/...)
├── services/     # api.js (state machine + mutations), transformers, enrichment
└── styles/       # Tailwind entry
supabase/         # schema.sql, rls.sql, seed.sql
```

## Database & deployment

Schema lives in a single consolidated `supabase/schema.sql` (+ `rls.sql` for policies, `seed.sql`
for dev data) rather than a numbered migration chain — apply changes directly to each Supabase
project via `psql -f supabase/schema.sql` (and `rls.sql`) as the schema evolves. Staging and
production are separate Supabase projects that share no data.

Git flow: `feature/*` → `stage` → `main`. `stage` deploys to staging, `main` to production.
