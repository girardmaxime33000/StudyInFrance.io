import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import type { StripeCheckoutMetadata } from "@/types";

export const runtime = "nodejs";

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata as unknown as StripeCheckoutMetadata | null;
  if (!metadata?.kind) return;

  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;

  if (metadata.kind === "product") {
    const order = await prisma.order.update({
      where: { stripeCheckoutSessionId: session.id },
      data: { status: "PAID", stripePaymentIntentId: paymentIntentId },
      include: { items: { include: { product: true } }, user: true },
    });

    // TODO: send transactional email with signed download link(s) via Resend.
    // e.g. await sendProductDeliveryEmail(order);
    console.log(`[stripe] Order ${order.id} marked PAID, delivering ${order.items.length} item(s).`);
    return;
  }

  if (metadata.kind === "coaching") {
    const booking = await prisma.booking.update({
      where: { stripeCheckoutSessionId: session.id },
      data: { status: "CONFIRMED", stripePaymentIntentId: paymentIntentId },
      include: { coachingService: true, user: true },
    });

    // TODO: send email inviting the user to pick a slot on the Cal.com
    // embed at /coaching/booking-confirmed?session_id=...
    console.log(`[stripe] Booking ${booking.id} confirmed, awaiting Cal.com slot selection.`);
    return;
  }
}

async function handleAsyncPaymentFailed(session: Stripe.Checkout.Session) {
  const metadata = session.metadata as unknown as StripeCheckoutMetadata | null;
  if (!metadata?.kind) return;

  if (metadata.kind === "product") {
    await prisma.order
      .update({ where: { stripeCheckoutSessionId: session.id }, data: { status: "FAILED" } })
      .catch(() => undefined);
  }

  if (metadata.kind === "coaching") {
    await prisma.booking
      .update({ where: { stripeCheckoutSessionId: session.id }, data: { status: "CANCELLED" } })
      .catch(() => undefined);
  }
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing Stripe signature or webhook secret" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[stripe] Webhook signature verification failed: ${message}`);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "checkout.session.async_payment_failed":
        await handleAsyncPaymentFailed(event.data.object as Stripe.Checkout.Session);
        break;
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        if (typeof charge.payment_intent === "string") {
          await prisma.order
            .updateMany({
              where: { stripePaymentIntentId: charge.payment_intent },
              data: { status: "REFUNDED" },
            })
            .catch(() => undefined);
        }
        break;
      }
      default:
        // Unhandled event types are ignored on purpose — Stripe expects a 2xx
        // for any event type we don't act on.
        break;
    }
  } catch (err) {
    console.error(`[stripe] Error handling webhook event ${event.type}:`, err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
