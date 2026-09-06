import { createHmac, timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const bookingPayloadSchema = z.object({
  triggerEvent: z.string(),
  payload: z.object({
    uid: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    metadata: z.record(z.unknown()).optional(),
    // The Stripe checkout session id is passed through as a hidden/custom
    // field on the Cal.com booking form so we can match it back here.
    responses: z
      .object({
        bookingId: z.object({ value: z.string() }).optional(),
      })
      .optional(),
    videoCallData: z.object({ url: z.string() }).optional(),
  }),
});

function isValidSignature(rawBody: string, signatureHeader: string | null, secret: string) {
  if (!signatureHeader) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(signatureHeader, "utf8");
  if (expectedBuffer.length !== receivedBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, receivedBuffer);
}

export async function POST(request: Request) {
  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Cal.com webhook secret not configured" }, { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-cal-signature-256");

  if (!isValidSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const json = JSON.parse(rawBody);
  const parsed = bookingPayloadSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { triggerEvent, payload } = parsed.data;

  if (triggerEvent !== "BOOKING_CREATED" && triggerEvent !== "BOOKING_RESCHEDULED") {
    return NextResponse.json({ received: true });
  }

  const bookingId = payload.responses?.bookingId?.value;
  if (!bookingId) {
    return NextResponse.json({ error: "Missing internal bookingId reference" }, { status: 400 });
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      calBookingUid: payload.uid,
      scheduledStart: new Date(payload.startTime),
      scheduledEnd: new Date(payload.endTime),
      meetingUrl: payload.videoCallData?.url ?? null,
    },
  });

  // TODO: send a calendar-confirmation email with the meeting link via Resend.

  return NextResponse.json({ received: true });
}
