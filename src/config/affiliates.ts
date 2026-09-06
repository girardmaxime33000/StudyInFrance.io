export type AffiliateLink = {
  category: "insurance" | "housing" | "banking" | "mobile" | "travel";
  name: string;
  description: string;
  url: string;
  disclosure?: string;
};

/**
 * Affiliate directory. `url` should point to the tracked affiliate link.
 * Every entry is disclosed to end users per FTC / EU affiliate-marketing rules
 * on the /resources page.
 */
export const affiliateLinks: AffiliateLink[] = [
  {
    category: "insurance",
    name: "April International Student Cover",
    description: "Student health insurance accepted for French visa applications.",
    url: "https://example.com/affiliate/april",
    disclosure: "We earn a commission if you subscribe through this link, at no extra cost to you.",
  },
  {
    category: "housing",
    name: "Nexity Studea Residences",
    description: "Student residences across major French university cities, bookable before arrival.",
    url: "https://example.com/affiliate/studea",
  },
  {
    category: "banking",
    name: "N26 / Revolut France",
    description: "Mobile-first bank accounts that don't require a French address at signup.",
    url: "https://example.com/affiliate/n26",
  },
  {
    category: "mobile",
    name: "Free Mobile / Lebara France",
    description: "No-commitment SIM plans, easy to activate as a newcomer.",
    url: "https://example.com/affiliate/free-mobile",
  },
];
