import { FileText, CalendarClock, Landmark, BookOpenCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    icon: FileText,
    title: "Ready-to-use templates",
    description:
      "Motivation letters, study project write-ups, and CV formats accepted by French institutions — copy, adapt, submit.",
  },
  {
    icon: CalendarClock,
    title: "1-on-1 video coaching",
    description:
      "Book a session with an advisor who reviews your file live and gives you a concrete action plan.",
  },
  {
    icon: BookOpenCheck,
    title: "Step-by-step guides",
    description:
      "From Campus France to OFII validation — guides written specifically for the Indian applicant's paperwork and timeline.",
  },
  {
    icon: Landmark,
    title: "Trusted local resources",
    description:
      "A vetted directory of insurance, housing, and banking options that work for newcomers with no French credit history.",
  },
];

export function FeaturesSection() {
  return (
    <section className="border-b border-border bg-muted/30 py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">Everything you need, in one place</h2>
          <p className="mt-4 text-muted-foreground">
            No more scattered forum threads and outdated PDFs. One platform built around the
            actual steps of moving from India to France.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border/60">
              <CardHeader>
                <feature.icon className="h-8 w-8 text-primary" />
                <CardTitle className="mt-4 text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
