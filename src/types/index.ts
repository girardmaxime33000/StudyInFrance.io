import type { Currency } from "@prisma/client";

export type SupportedCurrency = Currency; // "EUR" | "USD"

export type CheckoutProductRequest = {
  productSlug: string;
  currency: SupportedCurrency;
  email?: string; // required for guest checkout, prefilled if authenticated
};

export type CheckoutCoachingRequest = {
  coachingServiceSlug: string;
  currency: SupportedCurrency;
  email?: string;
};

export type StripeCheckoutMetadata = {
  kind: "product" | "coaching";
  productSlug?: string;
  coachingServiceSlug?: string;
  userId?: string;
  guestEmail?: string;
};
