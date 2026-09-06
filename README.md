# Study In France

Information portal, info-product shop, coaching booking platform, and affiliate directory for
Indian students and young professionals moving to France.

This repository holds two separate things:

- **`docs/`** — a static showcase site (no backend, Stripe Payment Links
  pasted in manually), deployable to GitHub Pages today. See
  [Static showcase site (GitHub Pages)](#static-showcase-site-github-pages) below.
- **`src/`** — the full Next.js application (shop, coaching bookings,
  accounts, webhooks) for later, deployable to Vercel. See
  [Deployment (Vercel)](#deployment-vercel) below.

## Stack (full application, `src/`)

- Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- Prisma + PostgreSQL
- Stripe (Checkout + webhooks) for info-products and coaching payments, EUR/USD
- Cal.com (embed + webhook) for 1-on-1 coaching scheduling
- Contentlayer2 (MDX) for SEO guides
- NextAuth (Prisma adapter) for customer accounts

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL, Stripe, Cal.com, NextAuth secrets
npx prisma migrate dev
npm run dev
```

## Stripe webhook (local dev)

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_...` value into `STRIPE_WEBHOOK_SECRET`.

## Cal.com webhook

Configure a webhook in your Cal.com account pointing to
`POST /api/cal/webhook`, subscribed to `BOOKING_CREATED` and
`BOOKING_RESCHEDULED`, with the signing secret matching `CAL_WEBHOOK_SECRET`.
The booking form must include a hidden field named `bookingId` prefilled with
the internal `Booking.id` (passed as a query param from
`/coaching/booking-confirmed`) so the webhook can match the Cal.com booking
back to the Stripe-paid `Booking` row.

## Static showcase site (GitHub Pages)

`docs/` is a standalone, dependency-free static site (plain HTML/CSS/JS) —
a showcase/landing page, separate from the Next.js app described below.
It has no backend: purchases and bookings go through Stripe Payment Links
you paste in yourself.

**Enable GitHub Pages**: repo Settings → Pages → Source: "Deploy from a
branch" → Branch: `main`, folder `/docs` → Save. The site is then served at
`https://<owner>.github.io/StudyInFrance.io/` (or your custom domain, once
attached under the same Pages settings).

**Add your Stripe links**: open `docs/index.html` and search for
`REPLACE_WITH_YOUR_LINK` (3 occurrences, one per pricing card). Replace each
`href` with the corresponding Stripe Payment Link
(Stripe Dashboard → Payment Links → Create link). For the coaching card, if
booking needs a calendar step, either use a Stripe link that redirects to
your Calendly/Cal.com page after payment, or point the button directly at
that booking link instead.

**Edit content**: everything else (copy, prices, testimonials, FAQ) is
plain markup in `docs/index.html` — no build step, edit and push.

## Deployment (Vercel)

This project uses Next.js API routes, NextAuth sessions, and a PostgreSQL
database via Prisma — none of that runs on a static host like GitHub Pages.
Vercel (built by the Next.js team) runs the App Router, API routes, and
webhooks with no extra config.

1. **Database**: provision a PostgreSQL instance (Vercel Postgres, Neon, or
   Supabase). Copy its connection string.
2. **Import the repo**: on [vercel.com](https://vercel.com), "Add New →
   Project", import `girardmaxime33000/StudyInFrance.io`, select the
   branch to deploy (e.g. `main` after merging this PR).
3. **Environment variables**: in the project's Settings → Environment
   Variables, set every key from `.env.example`:
   - `DATABASE_URL` — from step 1
   - `NEXTAUTH_URL` — your production URL (e.g. `https://studyinfrance.io`)
   - `NEXTAUTH_SECRET` — `openssl rand -base64 32`
   - `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — from the
     Stripe Dashboard (live keys for production)
   - `STRIPE_WEBHOOK_SECRET` — created in step 5
   - `CAL_API_KEY`, `CAL_WEBHOOK_SECRET`, `NEXT_PUBLIC_CAL_USERNAME`,
     `NEXT_PUBLIC_CAL_EVENT_SLUG`
   - `RESEND_API_KEY`, `EMAIL_FROM`
   - `NEXT_PUBLIC_SITE_URL` — your production URL
4. **Run the migration** against the production database before or right
   after the first deploy: `DATABASE_URL=... npx prisma migrate deploy`.
5. **Stripe webhook**: in the Stripe Dashboard, add an endpoint at
   `https://<your-domain>/api/webhooks/stripe` for `checkout.session.completed`,
   `checkout.session.async_payment_failed`, and `charge.refunded`. Copy its
   signing secret into `STRIPE_WEBHOOK_SECRET` (step 3) and redeploy.
6. **Cal.com webhook**: point it at `https://<your-domain>/api/cal/webhook`
   (see the Cal.com webhook section above) once the domain is live.
7. **Custom domain**: attach `studyinfrance.io` under the Vercel project's
   Domains tab, then update `NEXTAUTH_URL` / `NEXT_PUBLIC_SITE_URL` to match.

Every subsequent push to the deployed branch redeploys automatically.

## Project structure

See the architecture overview shared in the project brief. Key directories:

- `src/app` — routes (App Router), including `api/` for Stripe/Cal.com/NextAuth handlers
- `src/components/marketing` — landing page sections
- `src/components/ui` — shadcn/ui primitives
- `src/config` — site metadata, pricing/catalog fallback data, affiliate links
- `src/content/guides` — MDX SEO guides (Contentlayer)
- `prisma/schema.prisma` — data model (users, products, orders, coaching services, bookings)
