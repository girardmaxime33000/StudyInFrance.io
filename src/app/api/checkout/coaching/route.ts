import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import type { StripeCheckoutMetadata } from "@/types";

const bodySchema = z.object({
  coachingServiceSlug: z.string().min(1),
  currency: z.enum(["EUR", "USD"]),
  email: z.string().email().optional(),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { coachingServiceSlug, currency, email } = parsed.data;

  const service = await prisma.coachingService.findUnique({ where: { slug: coachingServiceSlug } });

  if (!service || !service.isActive) {
    return NextResponse.json({ error: "Coaching service not found" }, { status: 404 });
  }

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email ?? email;

  if (!userEmail) {
    return NextResponse.json({ error: "Email is required for guest checkout" }, { status: 400 });
  }

  const unitAmount = currency === "EUR" ? service.priceEurCents : service.priceUsdCents;
  const stripePriceId = currency === "EUR" ? service.stripePriceIdEur : service.stripePriceIdUsd;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const metadata: StripeCheckoutMetadata = {
    kind: "coaching",
    coachingServiceSlug: service.slug,
    userId: session?.user ? (session.user as { id?: string }).id : undefined,
    guestEmail: session?.user ? undefined : userEmail,
  };

  // Booking is created up front in PENDING_PAYMENT state; the Cal.com slot
  // itself is only picked by the user *after* payment succeeds (see
  // /coaching/booking-confirmed, which loads the Cal.com embed and passes
  // the booking id through as a custom field / metadata).
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: session?.user ? undefined : userEmail,
    line_items: [
      stripePriceId
        ? { price: stripePriceId, quantity: 1 }
        : {
            price_data: {
              currency: currency.toLowerCase(),
              product_data: {
                name: `${service.title} (${service.durationMinutes} min)`,
              },
              unit_amount: unitAmount,
            },
            quantity: 1,
          },
    ],
    success_url: `${siteUrl}/coaching/booking-confirmed?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/coaching?checkout=cancelled`,
    metadata: metadata as unknown as Record<string, string>,
  });

  await prisma.booking.create({
    data: {
      userId: metadata.userId ?? null,
      guestEmail: metadata.guestEmail ?? null,
      coachingServiceId: service.id,
      status: "PENDING_PAYMENT",
      currency,
      amountTotalCents: unitAmount,
      stripeCheckoutSessionId: checkoutSession.id,
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
