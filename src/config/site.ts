export const siteConfig = {
  name: "Study In France",
  tagline: "Your bridge from India to a French degree, visa, and career.",
  description:
    "Guides, templates, and 1-on-1 coaching to help Indian students and young professionals study, work, and settle in France — Campus France applications, student visas, housing, and career paths, explained clearly.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://studyinfrance.io",
  ogImage: "/images/og-cover.jpg",
  links: {
    instagram: "https://instagram.com/studyinfrance.io",
    linkedin: "https://linkedin.com/company/studyinfrance-io",
  },
  nav: [
    { title: "Guides", href: "/guides" },
    { title: "Shop", href: "/shop" },
    { title: "Coaching", href: "/coaching" },
    { title: "Resources", href: "/resources" },
    { title: "FAQ", href: "/faq" },
  ],
} as const;
