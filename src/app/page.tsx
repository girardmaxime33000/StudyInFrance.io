import type { Metadata } from "next";

import { HeroSection } from "@/components/marketing/hero-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { PricingSection } from "@/components/marketing/pricing-section";
import { FAQSection } from "@/components/marketing/faq-section";

export const metadata: Metadata = {
  title: "Study, Work & Settle in France — Guides & Coaching for Indian Students",
  description:
    "Campus France applications, student visas, housing, and career guidance for Indian students and young professionals moving to France. Guides, templates, and 1-on-1 coaching.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
    </>
  );
}
