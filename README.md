# Study In France

Information portal, info-product shop, coaching booking platform, and affiliate directory for
Indian students and young professionals moving to France.

## Stack

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

## Project structure

See the architecture overview shared in the project brief. Key directories:

- `src/app` — routes (App Router), including `api/` for Stripe/Cal.com/NextAuth handlers
- `src/components/marketing` — landing page sections
- `src/components/ui` — shadcn/ui primitives
- `src/config` — site metadata, pricing/catalog fallback data, affiliate links
- `src/content/guides` — MDX SEO guides (Contentlayer)
- `prisma/schema.prisma` — data model (users, products, orders, coaching services, bookings)
