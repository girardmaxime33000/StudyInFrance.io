import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import type { StripeCheckoutMetadata } from "@/types";

const bodySchema = z.object({
  productSlug: z.string().min(1),
  currency: z.enum(["EUR", "USD"]),
  email: z.string().email().optional(),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { productSlug, currency, email } = parsed.data;

  const product = await prisma.product.findUnique({ where: { slug: productSlug } });

  if (!product || !product.isActive) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email ?? email;

  if (!userEmail) {
    return NextResponse.json({ error: "Email is required for guest checkout" }, { status: 400 });
  }

  const unitAmount = currency === "EUR" ? product.priceEurCents : product.priceUsdCents;
  const stripePriceId = currency === "EUR" ? product.stripePriceIdEur : product.stripePriceIdUsd;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const metadata: StripeCheckoutMetadata = {
    kind: "product",
    productSlug: product.slug,
    userId: session?.user ? (session.user as { id?: string }).id : undefined,
    guestEmail: session?.user ? undefined : userEmail,
  };

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: session?.user ? undefined : userEmail,
    line_items: [
      stripePriceId
        ? { price: stripePriceId, quantity: 1 }
        : {
            price_data: {
              currency: currency.toLowerCase(),
              product_data: { name: product.title },
              unit_amount: unitAmount,
            },
            quantity: 1,
          },
    ],
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/shop/${product.slug}?checkout=cancelled`,
    metadata: metadata as unknown as Record<string, string>,
  });

  // Persist a PENDING order now so we can reconcile it even if the webhook
  // arrives before the client redirect, or if the user abandons checkout.
  await prisma.order.create({
    data: {
      userId: metadata.userId ?? null,
      guestEmail: metadata.guestEmail ?? null,
      status: "PENDING",
      currency,
      amountTotalCents: unitAmount,
      stripeCheckoutSessionId: checkoutSession.id,
      items: {
        create: [{ productId: product.id, unitPriceCents: unitAmount, quantity: 1 }],
      },
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
