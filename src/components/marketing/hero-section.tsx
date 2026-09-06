import Link from "next/link";
import { ArrowRight, ShieldCheck, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="container grid gap-12 py-20 md:grid-cols-2 md:py-28">
        <div className="flex flex-col justify-center">
          <Badge variant="secondary" className="w-fit">
            Built for Indian students & professionals
          </Badge>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Your bridge from India to a life in France.
          </h1>

          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Step-by-step guides, ready-to-use templates, and 1-on-1 coaching to help you apply,
            get your visa, and settle in France — without the guesswork.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/shop">
                Browse guides & templates
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/coaching">Book a coaching call</Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              1,200+ students helped
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Secure payments via Stripe
            </div>
          </div>
        </div>

        <div className="relative hidden items-center justify-center md:flex">
          <div className="aspect-square w-full max-w-md rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-transparent" />
        </div>
      </div>
    </section>
  );
}
