import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "Do you provide official visa or admission guarantees?",
    answer:
      "No. We provide guides, templates, and coaching based on real application experience, but we are not a government body or an admissions committee. Final decisions always rest with Campus France, French universities, and the consulate.",
  },
  {
    question: "Can I pay in Indian Rupees?",
    answer:
      "Checkout is processed in EUR or USD via Stripe. Stripe and your card network will convert the charge to INR automatically at your bank's exchange rate.",
  },
  {
    question: "How is coaching delivered?",
    answer:
      "After payment, you'll be redirected to our booking calendar (Cal.com) to pick a slot. Sessions are held over video call, with time slots available in the evening IST to suit applicants still in India.",
  },
  {
    question: "How do I access a PDF or template after purchase?",
    answer:
      "Immediately after a successful payment, you'll get a secure download link by email and inside your account dashboard. Access does not expire.",
  },
  {
    question: "Are the insurance, housing, and banking links sponsored?",
    answer:
      "Some listings in our Resources directory are affiliate links: we may earn a commission if you sign up through them, at no extra cost to you. This is always disclosed next to the listing.",
  },
];

export function FAQSection() {
  return (
    <section className="py-20">
      <div className="container max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Frequently asked questions</h2>
          <p className="mt-4 text-muted-foreground">
            Can&apos;t find your answer here? Reach out before booking a session.
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
