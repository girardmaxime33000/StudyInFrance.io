import Link from "next/link";
import { Check } from "lucide-react";

import { pricingPlans } from "@/config/products";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PricingSection() {
  return (
    <section className="border-y border-border bg-muted/30 py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">Simple, one-time pricing</h2>
          <p className="mt-4 text-muted-foreground">
            No subscriptions. Pay once in EUR or USD, get lifetime access to your guide, or book
            your coaching slot directly.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.slug}
              className={cn(
                "flex flex-col border-border/60",
                plan.highlighted && "border-primary shadow-lg ring-1 ring-primary",
              )}
            >
              <CardHeader>
                {plan.highlighted && (
                  <Badge className="w-fit" variant="default">
                    Most popular
                  </Badge>
                )}
                <CardTitle className="mt-2">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{formatPrice(plan.priceEurCents, "EUR")}</span>
                  <span className="text-sm text-muted-foreground">
                    / {formatPrice(plan.priceUsdCents, "USD")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {plan.billing === "one-time" ? "One-time payment" : "Per session"}
                </p>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button className="w-full" variant={plan.highlighted ? "default" : "outline"} asChild>
                  <Link href={plan.billing === "session" ? "/coaching" : `/shop/${plan.slug}`}>
                    {plan.cta}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
