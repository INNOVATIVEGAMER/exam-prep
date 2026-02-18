# ExamPrep

Question papers and worked solutions for MAKAUT engineering students. Sample papers and past year papers with step-by-step answers, inline math rendering, and course-outcome mapping — behind a one-time paywall.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router) + TypeScript |
| UI | shadcn/ui + Tailwind CSS v4 |
| Math | KaTeX via remark-math + rehype-katex |
| Backend + Auth + DB | Supabase (Postgres + RLS + Auth) |
| Payments | Razorpay |
| Hosting | Vercel |

## Architecture

```
Browser
  └── Next.js App (Vercel)
        ├── Server components → Supabase (data fetch, auth)
        ├── Client components → Supabase (session, realtime)
        └── API routes
              ├── /api/payment/create   (Razorpay order)
              └── /api/payment/verify   (Razorpay webhook)

Supabase
  ├── Auth (email/password)
  ├── Postgres
  │     ├── subjects       — subject metadata + exam pattern
  │     ├── papers         — questions + answers (RLS-gated)
  │     ├── purchases      — payment records
  │     ├── users          — profile + device token
  │     └── support_tickets
  └── RLS policies         — answers only readable after purchase
```

Access control is enforced at the database level via Row Level Security — unpurchased papers return questions but no answers, regardless of client-side state.

## Scripts

```bash
# Dev
npm run dev               # start local dev server

# Build
npm run build             # production build
npm run start             # start production server
npm run lint              # eslint

# Seeding (staging — uses .env.local)
npm run seed              # seed all subjects + papers
npm run seed:dry          # dry run (no DB writes)
npm run seed:subject      # seed a specific subject
npm run db:reset          # wipe and re-seed staging DB

# Seeding (production — uses .env.prod)
npm run prod:seed
npm run prod:seed:dry
npm run prod:seed:subject
npm run prod:db:reset
```

Seed data lives in `seed/subjects/` (subject JSON) and `seed/papers/` (paper JSON).

## Environment Variables

Two env files are used:

- `.env.local` — staging Supabase project
- `.env.prod` — production Supabase project

See `.env.local.example` for required keys.

## Database Setup

SQL migrations are in `supabase/`:

```
001_create_tables.sql   — schema
002_rls_policies.sql    — access control
003_triggers.sql        — device session management
```

Run them in order in the Supabase SQL editor.

## Adding Papers

There are two prompts for generating papers, depending on what you need:

### 1. `seed/PAPER_GENERATOR_PROMPT.md` — for the web app

Use this to generate papers as JSON files that get seeded into the database and served on the app.

1. Open the prompt in Claude (or any capable AI)
2. Attach the subject syllabus, previous year papers, and any reference material
3. Fill in the subject details at the bottom of the prompt
4. Claude generates validated JSON files and saves them to `seed/subjects/` and `seed/papers/`
5. Run `npm run seed` to push to staging, or `npm run prod:seed` for production

The prompt handles schema validation, CO/BL mapping, math formatting (KaTeX), and cross-checks question/answer keys before saving.

### 2. `seed/PDF_PAPER_GENERATOR_PROMPT.md` — for standalone PDFs

Use this to generate professionally formatted PDF papers via LaTeX — useful for sharing with students directly or printing, without needing to seed anything into the app.

1. Paste the prompt into any AI agent (Claude, ChatGPT, etc.)
2. Attach syllabus and reference papers
3. Fill in the subject details at the bottom
4. The AI generates LaTeX source that compiles to styled PDFs with colored question/answer boxes, TikZ diagrams, and proper math rendering

No seeding or app involvement — output is just the PDF files.

---

## Content Management

### Feature a subject on the homepage promo banner

```sql
-- Promote for 14 days
UPDATE subjects SET featured_until = CURRENT_DATE + INTERVAL '14 days' WHERE code = 'IT301';

-- Remove early
UPDATE subjects SET featured_until = NULL WHERE code = 'IT301';
```

The banner auto-hides once `featured_until` passes — no manual cleanup needed.
