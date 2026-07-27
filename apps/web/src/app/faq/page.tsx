import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqContent } from "@/content/faq";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "FAQ",
  description: "Common questions about YourHomeCare services, referrals and care delivery.",
  path: "/faq",
});

export default function FAQPage() {
  return (
    <>
      <Section className="bg-slate-50">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-semibold uppercase tracking-[0.2em] text-primary">{faqContent.hero.badge}</p>
            <h1 className="mt-4 text-4xl font-bold lg:text-5xl">{faqContent.hero.title}</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">{faqContent.hero.description}</p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-4xl rounded-3xl border bg-white p-6 shadow-sm lg:p-10">
            <Accordion type="single" collapsible className="space-y-4">
              {faqContent.items.map((item) => (
                <AccordionItem key={item.question} value={item.question} className="rounded-2xl border px-4 py-2">
                  <AccordionTrigger className="text-left text-lg font-semibold text-slate-900">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pt-3 text-base leading-8 text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Container>
      </Section>

      <Section className="bg-primary text-white">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold">Still have questions?</h2>
            <p className="mt-6 text-lg text-white/80">Our care coordinators can help you understand the right service for your situation.</p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-primary hover:bg-slate-100">
                  Contact Us
                </Button>
              </Link>
              <Link href="/appointments">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Book Assessment
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
