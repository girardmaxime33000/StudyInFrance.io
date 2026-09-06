/**
 * Static fallback catalog used for the pricing section and static rendering.
 * Authoritative data lives in the `Product` / `CoachingService` Prisma tables;
 * this file only seeds them and feeds statically-generated marketing sections.
 */

export type PricingPlan = {
  slug: string;
  name: string;
  description: string;
  priceEurCents: number;
  priceUsdCents: number;
  billing: "one-time" | "session";
  features: string[];
  cta: string;
  highlighted?: boolean;
};

export const pricingPlans: PricingPlan[] = [
  {
    slug: "campus-france-starter-kit",
    name: "Campus France Starter Kit",
    description: "The essential PDF pack to build a winning Campus France / Parcoursup application.",
    priceEurCents: 1900,
    priceUsdCents: 2100,
    billing: "one-time",
    features: [
      "Motivation letter templates (5 field-tested examples)",
      "Study project (projet d'études) writing framework",
      "Document checklist for the France Visas portal",
      "Common rejection reasons and how to avoid them",
    ],
    cta: "Get the kit",
  },
  {
    slug: "visa-and-arrival-bundle",
    name: "Visa & Arrival Bundle",
    description: "Everything to move from acceptance letter to landing in France with a plan.",
    priceEurCents: 3900,
    priceUsdCents: 4300,
    billing: "one-time",
    features: [
      "Long-stay student visa (VLS-TS) step-by-step guide",
      "OFII validation & CAF housing allowance walkthrough",
      "Bank account & phone plan comparison (for Indian students)",
      "First 30 days in France checklist",
    ],
    cta: "Get the bundle",
    highlighted: true,
  },
  {
    slug: "1on1-coaching-45",
    name: "1-on-1 Coaching Call",
    description: "45 minutes live on video with a France-based advisor for your specific situation.",
    priceEurCents: 6900,
    priceUsdCents: 7500,
    billing: "session",
    features: [
      "Application or visa file review",
      "Personalized action plan",
      "Follow-up notes by email",
      "Flexible slots (IST-friendly evening times available)",
    ],
    cta: "Book a session",
  },
];
