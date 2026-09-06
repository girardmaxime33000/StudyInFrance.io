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
a showcase site, separate from the Next.js app described below. It has no
backend: purchases and coaching bookings go through Stripe Payment Links
you paste in yourself.

**Pages**:

```
docs/
├── index.html                          Home (EN)
├── resources/
│   ├── index.html                      Resources hub (EN)
│   ├── campus-france.html
│   ├── vfs-visa-appointments.html
│   ├── caf-application.html
│   └── housing-without-guarantor.html
├── contact/index.html                  Contact & booking (EN)
└── fr/                                 Same structure, French
    ├── index.html
    ├── resources/…
    └── contact/index.html
```

**Enable GitHub Pages**: repo Settings → Pages → Source: "Deploy from a
branch" → Branch: `main`, folder `/docs` → Save. The site is then served at
`https://<owner>.github.io/StudyInFrance.io/` (or your custom domain, once
attached under the same Pages settings).

**Before publishing, fill in three placeholders** (search each string
across `docs/`, they appear on every page):

- `REPLACE_WITH_YOUR_LINK` — Stripe Payment Link `href`s (5 per home page:
  4 info-product packs + coaching). Stripe Dashboard → Payment Links →
  Create link.
- `wa.me/33600000000` — the floating WhatsApp button and the Contact
  page's WhatsApp link. Replace with your real WhatsApp Business number,
  international format, digits only (e.g. `wa.me/919876543210`).
- `SIRET [YOUR SIRET NUMBER]` / `[Legal entity name]` / `[Street
  address]` — the trust badge footnote (footer, every page) and the
  Contact page's legal info card. These are placeholders on purpose: do
  not publish invented values — fill in your real registration once you
  have one. Presenting a fabricated SIRET or "registered in France" claim
  without an actual entity is a legal exposure, not a copy detail.

**Currency toggle (EUR/INR)**: every price carries `data-eur` and
`data-inr` attributes; the EUR/INR buttons in the pricing section swap
which one displays, with a stated reference rate. This is display only —
Stripe checkout always charges in EUR, and the page says so next to the
toggle and in a FAQ entry. To update the reference rate or amounts, edit
the `data-inr` values directly (search `data-inr=` in the home pages) —
there's no live FX lookup.

**Eligibility checker**: a 4-question client-side quiz (`#eligibility` on
the home page) that recommends a pack/guide based on the answers — no
data is sent anywhere. The script (`assets/js/main.js`) only decides
which `[data-outcome="…"]` block to reveal; the wording and links for
each outcome live directly in `index.html` / `fr/index.html`, so the
shared script works unchanged for both languages.

**Trust badges**: "Registered entity in France", "GDPR compliant", and
"Secure payments via Stripe" are factual claims once the legal
placeholders above are filled in — don't publish them otherwise. The
fourth badge reads "Expert visa application guidance", not a success
guarantee: the site's own FAQ states no visa or admission outcome is
guaranteed, and a "100%" claim for a paid consulting service is a real
deceptive-advertising exposure (and a self-contradiction against that
FAQ answer).

**Languages**: every English page has a French twin under `fr/` with the
matching path (e.g. `resources/campus-france.html` ↔
`fr/resources/campus-france.html`). They're independent, hand-translated
files sharing the same `assets/` — there's no i18n framework or build
step. Each page links to its twin via the EN/FR toggle in the header.
Edit both when copy, prices, or FAQ content changes — nothing keeps them
in sync automatically.

**Illustrations**: the hero, service icons, section divider, step icons,
testimonial avatars, and CTA accent are all hand-authored inline SVG,
directly in each page's HTML — no separate image files, crisp at any
size, on-brand by construction, zero extra requests. Drop real
photography into `docs/assets/img/` and reference it with an `<img>` tag
if you'd rather use photos for the hero or testimonials later.

**Edit content**: everything else (copy, prices, testimonials, FAQ,
guides) is plain markup in the files listed above — no build step, edit
and push.

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
