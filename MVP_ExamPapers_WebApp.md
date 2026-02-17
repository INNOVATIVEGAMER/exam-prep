# ExamPrep — MVP Product Requirements Document

## 1. Overview

**Product:** A web app for college exam preparation where students can access sample question papers with detailed answers, behind a paywall with content protection.

**Target audience:** Engineering students (starting with JISCE, expandable to other colleges).

**Core value:** High-quality, exam-pattern-matched question papers with step-by-step solutions — something students currently don't have access to in a structured, digital format.

---

## 2. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | Next.js 14+ (App Router, CSR) + TypeScript | Familiar stack, great DX |
| **UI** | shadcn/ui + Tailwind CSS | Production-grade components, consistent design |
| **Math Rendering** | KaTeX | Lighter than MathJax, fast client-side rendering |
| **Backend + Auth + DB** | Supabase (Auth + Postgres + RLS) | Single platform — auth, database, and access control |
| **Payments** | Razorpay | UPI + cards + netbanking, ideal for Indian students |
| **Payment API** | Next.js API Routes (2 files) | Only needed for Razorpay server-side secrets |
| **Hosting** | Vercel | Single platform for frontend + API routes |
| **Content Seeding** | CLI scripts (JSON → Supabase Postgres) | Fast content addition without admin panel |

---

## 3. Architecture

```
┌─────────────────────────────────┐
│            VERCEL                │
│                                  │
│  ┌────────────────────────────┐  │
│  │        Next.js App          │  │
│  │                             │  │
│  │   Client Pages (CSR)        │  │
│  │   ├── Landing, Catalog      │  │
│  │   ├── Paper View + Paywall  │  │
│  │   └── Dashboard             │  │
│  │                             │  │
│  │   API Routes (serverless)   │  │
│  │   ├── /api/payment/create   │  │
│  │   └── /api/payment/verify   │  │
│  └──────────┬─────────────────┘  │
│             │                    │
└─────────────┼────────────────────┘
              │
    ┌─────────▼──────────┐
    │     SUPABASE        │
    │                     │
    │  Auth (Google/Email) │
    │  Postgres Database   │
    │  Row Level Security  │
    └─────────┬───────────┘
              │
        ┌─────▼─────┐
        │  Razorpay  │
        └────────────┘
```

### Why This Works

**No Express backend.** Supabase handles auth, database, and access control. The frontend talks directly to Supabase for all data reads. The only server-side code is 2 Next.js API routes for Razorpay (which needs secret keys).

**No MongoDB.** Postgres with `jsonb` columns handles the flexible question structure just as well. One fewer service to manage.

**Row Level Security as the core content gate.** Instead of application code that strips answers from responses, RLS policies control visibility at the database level. A user who hasn't purchased a paper literally cannot read the answer columns — the database refuses to return them. Stronger than middleware-based stripping, and zero application logic needed.

---

## 4. Database Schema (Supabase Postgres)

### `subjects` table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Auto-generated |
| code | text (unique) | `"IT301"`, `"PH301"` |
| name | text | `"Computer Organization & Architecture"` |
| short_name | text | `"COA"` |
| regulation | text | `"R23"` |
| semester | int | `3` |
| department | text | `"IT"` |
| college | text | `"JISCE"` |
| exam_pattern | jsonb | Group structure, marks, attempt rules — varies per subject |
| created_at | timestamptz | Auto |

The `exam_pattern` jsonb stores the group definitions (Group A: 12 MCQ/attempt 10/1 mark; Group B: 5 short/attempt 3/5 marks; etc.). Since exam structure varies by subject, jsonb avoids rigid columns.

---

### `papers` table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Auto-generated |
| subject_id | uuid (FK → subjects) | Parent subject |
| title | text | `"Sample Paper 1"` |
| type | text | `"end_sem"` / `"mid_sem_1"` / `"mid_sem_2"` |
| year | text | `"2025-26"` |
| is_free | boolean | Whether answers are freely visible |
| price | int | Price in paisa (4900 = ₹49), 0 if free |
| questions | jsonb | All question data (text, options, sub-parts, marks, CO/BL) |
| answers | jsonb | All answer data (solutions, correct options, key points) |
| metadata | jsonb | Difficulty, modules covered |
| created_at | timestamptz | Auto |

**Critical design decision:** Questions and answers live in **separate jsonb columns**. Questions are always publicly readable — they're the hook. Answers are gated by RLS — only returned if the user has paid or the paper is free. This separation is what makes the entire paywall work at the database level.

Both jsonb columns use matching keys (question number as key) so the frontend can pair them.

---

### `users` table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK, FK → auth.users) | Matches Supabase Auth UID |
| email | text | From auth provider |
| name | text | Display name |
| college | text (nullable) | Optional |
| semester | int (nullable) | Optional |
| active_device_token | text (nullable) | Single-device enforcement |
| created_at | timestamptz | Auto |

Created automatically via a Supabase database trigger when a new user signs up in `auth.users`.

---

### `purchases` table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Auto-generated |
| user_id | uuid (FK → users) | Purchaser |
| paper_id | uuid (FK → papers) | Purchased paper |
| amount | int | Paisa |
| razorpay_order_id | text | Order reference |
| razorpay_payment_id | text (nullable) | Filled after payment |
| status | text | `"created"` / `"paid"` / `"failed"` |
| created_at | timestamptz | Auto |

Unique constraint on `(user_id, paper_id)` — no duplicate purchases.

---

### Row Level Security Policies

| Table | Policy | Rule |
|-------|--------|------|
| `subjects` | Public read | Anyone can browse subjects, no auth needed |
| `papers.questions` | Public read | Questions are always visible — the preview hook |
| `papers.answers` | Conditional read | Only if `is_free = true` OR a matching paid purchase exists for the current user |
| `purchases` | Own reads only | Users see only their own purchases (`user_id = auth.uid()`) |
| `purchases` | Service role insert | Only the payment API route (using service role key) can insert/update |
| `users` | Own row only | Users can read/update only their own row |

The answers RLS policy is the most important one — it runs a subquery against `purchases` to check if the authenticated user has a paid record for the requested paper. If not, the column returns null regardless of how the request is made.

---

## 5. Auth Flow

### Login

```
User clicks "Login with Google"
  → Supabase Auth handles OAuth
  → Row auto-created in public.users via DB trigger
  → Frontend receives session (access + refresh tokens)
  → Device token generated → stored in DB + localStorage
  → signOut({ scope: 'others' }) revokes other sessions
  → User lands on dashboard
```

### Session Management

Supabase client SDK handles token refresh and persistence automatically. The frontend wraps the app in an auth context provider that exposes current user and session state to all components.

### JWT in API Routes

The 2 payment API routes receive the Supabase access token via Authorization header, verify it using the JWT secret, extract user ID, and proceed with payment logic.

---

## 6. Single-Device Enforcement

### Concept

The `users` table has an `active_device_token` column. On every login, a new random token is generated, written to the DB, and stored in localStorage. On every protected page load, the frontend compares local token vs DB token. Mismatch = forced logout.

### Flow

```
Login on Device A
  → Generate token_A
  → Write to users.active_device_token
  → Store in Device A localStorage

Login on Device B (same account)
  → Generate token_B
  → Overwrites token_A in DB
  → Device B is now active

Device A opens any protected page
  → Reads localStorage (token_A)
  → Queries DB (finds token_B)
  → Mismatch → force logout
  → Show: "Signed in on another device"
```

### Why Two Mechanisms

Supabase's `signOut({ scope: 'others' })` invalidates refresh tokens, but existing JWTs remain valid until expiry (~1 hour). The device token check provides **instant** enforcement with no expiry gap.

### Edge Cases

- **Cleared browser data:** Logging in again generates a fresh token. No deadlock.
- **Multiple tabs:** Same browser, same localStorage, same token. Works fine.
- **Credential sharing:** Two people keep kicking each other out. Annoying enough to discourage sharing — this is intentional.

---

## 7. Payment Flow (Razorpay)

```
Student views paid paper → questions visible, answers locked
  → Clicks "Unlock Answers — ₹49"
  → Frontend calls POST /api/payment/create
      → Creates Razorpay order (server-side, uses secret key)
      → Inserts purchase row (status: "created") via service role
      → Returns order_id

  → Frontend opens Razorpay checkout modal
  → Student pays (UPI / Card / Netbanking)
  → Razorpay returns payment_id + signature

  → Frontend calls POST /api/payment/verify
      → Verifies signature using Razorpay secret
      → Updates purchase row (status: "paid") via service role
      → Returns success

  → Frontend refetches paper data
      → RLS now finds a paid purchase → answers column returned
      → UI reveals answers with content protection active
```

### Why API Routes

Razorpay order creation and signature verification require `key_secret`, which must never reach the browser. Next.js API routes run server-side on Vercel. Only 2 files needed.

---

## 8. Content Protection Strategy

### Tier 1 — Database Level (Strongest)

Answers in a separate column, gated by RLS. Unpaid users cannot access answer data even via dev tools or direct Supabase queries — the database itself refuses to return it.

### Tier 2 — Client-Side Deterrents

Applied on the paper view page for unlocked content:
- Disable right-click context menu
- Block Ctrl+P, Ctrl+S, Ctrl+C, Ctrl+U, F12
- Disable text selection via CSS and JS
- Hide all content in print mode via CSS `@media print`, show redirect message instead
- Basic dev tools detection via window dimension anomalies

### Tier 3 — Watermarking

For paid content, overlay the user's email as a repeated semi-transparent watermark across the page. Low enough opacity to not disrupt reading, visible enough in screenshots. Makes leaked content traceable.

### Threat Coverage

| Threat | Prevented? | How |
|--------|-----------|-----|
| Accessing answers without paying | ✅ Fully | RLS at database level |
| Copy-paste content | ✅ Yes | CSS + JS |
| Print to PDF | ✅ Yes | CSS media query |
| Sharing credentials | ✅ Yes | Single-device lock |
| Dev tools inspection | ⚠️ Partial | Content was legitimately fetched; can warn |
| OS screenshots | ⚠️ Deterred | Watermark makes traceable |
| Phone camera | ❌ No | Watermark only deterrent |

---

## 9. Content Seeding

### Seed File Structure

```
seed/
  subjects/
    IT301.json              → Subject metadata + exam pattern
    PH301.json
  papers/
    IT301/
      end_sem_paper_1.json  → Full paper: questions + answers
      end_sem_paper_2.json
    PH301/
      practice_set.json
  seed.ts                   → CLI: validate + push to Supabase
```

### Paper JSON Structure (Conceptual)

Each paper JSON contains: subject code (resolved to ID during seeding), title, type, year, pricing, a `questions` object (groups → questions with markdown text, options, sub-parts, marks, CO/BL), and a matching `answers` object (keyed by question number with solution markdown, correct option, key points).

Math uses LaTeX syntax in markdown — `$...$` inline, `$$...$$` block — rendered by KaTeX on the frontend.

### Seeding Workflow

```
1. Write/edit JSON seed files
2. Run seed script with --dry-run to validate
3. Run seed script (uses Supabase service role key, bypasses RLS)
4. Script resolves subject codes → IDs, upserts into Postgres
5. Verify in Supabase dashboard
```

Supports `--dry-run`, `--subject IT301` (seed one subject), and `all` (seed everything).

---

## 10. Frontend Pages

### Page Map

```
/                               → Landing (hero + subject catalog)
/subjects                       → Browse all subjects
/subjects/[code]                → Subject detail (exam pattern + paper list)
/subjects/[code]/[paperId]      → Paper view (core page)
/login                          → Supabase Auth (Google + Email)
/dashboard                      → Purchased papers + profile
/payment/success                → Post-payment confirmation
```

### Paper View — The Core Page

**Not purchased:** All questions visible. Answer sections show blurred overlay with lock icon. Sticky "Unlock Answers — ₹49" CTA on mobile. Free papers show 1-2 sample answers as proof of quality.

**Purchased:** Full questions + answers. Content protection active. Clean reading with KaTeX math. Question nav sidebar for long papers.

### Component Organization

```
components/
  ui/                       → shadcn primitives
  layout/
    Navbar                  → Logo, subjects, auth, dashboard
    Footer
  paper/
    PaperHeader             → Title, marks, duration, CO table
    GroupSection             → Group A/B/C with instructions
    QuestionCard            → Question + marks + CO/BL badges
    AnswerCard              → Answer content or locked state
    McqOptions              → MCQ option list
    SubPartList             → Multi-part questions
    MathRenderer            → KaTeX wrapper
    PaywallOverlay          → Blur + CTA
  auth/
    AuthProvider            → Supabase session context
    LoginButton
    DeviceGuard             → Single-device check wrapper
  payment/
    BuyButton               → Razorpay checkout trigger
    PurchaseBadge           → "Purchased ✓"
  protection/
    ContentProtection       → Anti-copy wrapper
    Watermark               → Email overlay
```

---

## 11. Pricing

### Per-Paper (MVP)

| Paper Type | Price |
|-----------|-------|
| End Sem Sample Paper | ₹49 |
| Mid Sem Sample Paper | ₹29 |
| Practice Set (Solutions) | ₹39 |
| Free Demo | ₹0 (1 per subject) |

### Why Per-Paper, Not Subscription

₹49 is an impulse purchase — lower friction than ₹199/month. Students buy what they need for the upcoming exam. Simpler to implement. Subscription can come later when the content catalog grows.

### Free Tier

One paper per subject is fully free. This proves quality, enables SEO indexing, and becomes the shareable artifact that drives word-of-mouth growth.

---

## 12. Project Structure

```
examprep/
├── src/
│   ├── app/
│   │   ├── page.tsx                        # Landing
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── subjects/
│   │   │   ├── page.tsx                    # Browse
│   │   │   └── [code]/
│   │   │       ├── page.tsx                # Subject detail
│   │   │       └── [paperId]/
│   │   │           └── page.tsx            # Paper view
│   │   ├── payment/
│   │   │   └── success/page.tsx
│   │   └── api/
│   │       └── payment/
│   │           ├── create/route.ts         # Razorpay order
│   │           └── verify/route.ts         # Razorpay verify
│   ├── components/                         # As listed above
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useDeviceGuard.ts
│   │   ├── useContentProtection.ts
│   │   └── usePaper.ts
│   ├── lib/
│   │   ├── supabase-browser.ts             # Browser client (anon key)
│   │   ├── supabase-server.ts              # API route client (service role)
│   │   └── razorpay.ts
│   └── types/
│       └── index.ts
├── seed/
│   ├── subjects/                           # Subject JSONs
│   ├── papers/                             # Paper JSONs per subject
│   └── seed.ts                             # CLI seeder
├── supabase/
│   └── migrations/
│       ├── 001_create_tables.sql           # Schema
│       ├── 002_rls_policies.sql            # Access control
│       └── 003_triggers.sql                # Auto user creation
├── .env.local
└── package.json
```

One Next.js project. No separate backend. SQL migrations version-controlled in `supabase/migrations/`.

---

## 13. Environment Variables

```
# Supabase — public (safe for browser)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Supabase — private (API routes only)
SUPABASE_SERVICE_ROLE_KEY=

# Razorpay — public (checkout modal)
NEXT_PUBLIC_RAZORPAY_KEY_ID=

# Razorpay — private (API routes only)
RAZORPAY_KEY_SECRET=

# App
NEXT_PUBLIC_APP_URL=
```

Two private secrets, both only accessed in the 2 API route files. Everything else is browser-safe.

---

## 14. MVP Milestones

### Phase 1 — Foundation
- Initialize Next.js + shadcn + Tailwind
- Create Supabase project
- Write and run SQL migrations (tables, RLS, triggers)
- Set up Vercel, connect env vars
- Build seed CLI, test with one subject

### Phase 2 — Core
- Auth: Google login, auth provider, device guard hook
- Data: subject listing, paper listing, paper view with RLS-gated answers
- Paper view page with KaTeX rendering
- Paywall overlay for unpaid papers
- Free paper visible as demo

### Phase 3 — Payments
- Razorpay API routes (create order + verify)
- Purchase flow: buy → checkout → verify → unlock
- Dashboard: purchased papers
- Payment success page

### Phase 4 — Polish
- Content protection (disable select, print, copy, right-click)
- Watermark overlay
- Single-device enforcement on protected pages
- Mobile responsive
- Loading/error/empty states

### Phase 5 — Launch
- Seed COA papers + Physics practice set
- Mark one free paper per subject
- End-to-end test: signup → browse → buy → view → device lock
- Razorpay test mode → live mode
- Launch 🚀

---

## 15. Future Enhancements

- **Admin panel** for adding questions via UI
- **Subscription model** when catalog grows
- **Multi-college** expansion (MAKAUT, other autonomous)
- **Question bank** with randomized practice mode
- **Watermarked PDF download** for paid users
- **Analytics** (popular subjects, conversion rates)
- **Referral system** (share → earn credit)
- **Canvas rendering** for high-value content (harder to scrape)
- **Rate limiting** on answer fetches to prevent bulk scraping
