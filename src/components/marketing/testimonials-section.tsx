import { Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Ananya R.",
    role: "MSc student, Toulouse",
    quote:
      "The Campus France Starter Kit saved me weeks of research. My motivation letter went from generic to something an admissions officer actually remembered.",
  },
  {
    name: "Rohan K.",
    role: "Software engineer, Paris",
    quote:
      "The coaching call was worth ten times its price. In 45 minutes I understood exactly what was missing from my visa file.",
  },
  {
    name: "Priya S.",
    role: "MBA student, Lyon",
    quote:
      "I found my student residence and opened a French bank account before landing, thanks to the resources directory. Zero stress on arrival.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">Trusted by students across France</h2>
          <p className="mt-4 text-muted-foreground">
            Real outcomes from students who used our guides and coaching to move from India to
            France.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="border-border/60">
              <CardContent className="pt-6">
                <div className="flex gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="mt-6">
                  <p className="text-sm font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
