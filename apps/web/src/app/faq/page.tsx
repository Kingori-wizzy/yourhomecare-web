import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CallToAction } from "@/components/sections/home/cta";
import { buildMetadata } from "@/lib/metadata";
import { getPageContent, getPublishedFaqs, toFaqItems } from "@/server/cms";

export const metadata = buildMetadata({
  title: "FAQ",
  description: "Common questions about YourHomeCare services, referrals and care delivery.",
  path: "/faq",
});

export default async function FAQPage() {
  const [content, faqs] = await Promise.all([getPageContent("faq"), getPublishedFaqs()]);
  const items = toFaqItems(faqs);

  return (
    <>
      <PageHero
        badge={content.hero.badge || "Trusted by 5,000+ families"}
        title={content.hero.title}
        description={content.hero.description}
        imageUrl="/images/flyers/safe-discharge.png"
        primaryCta={{ label: "Find Care", href: "/appointments" }}
        secondaryCta={{ label: "Our Services", href: "/services" }}
        priority
      />

      <Section className="bg-white">
        <Container>
          <div className="mx-auto max-w-4xl">
            <Accordion type="single" collapsible className="space-y-4">
              {items.map((item) => (
                <AccordionItem
                  key={item.question}
                  value={item.question}
                  className="rounded-[8px] border border-border bg-[#f8f9ff] px-5 py-1 shadow-[var(--shadow-sm)] transition duration-300 hover:shadow-[var(--shadow-md)]"
                >
                  <AccordionTrigger className="text-left text-lg font-semibold text-primary hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pt-1 text-base leading-[1.6] text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Container>
      </Section>

      <CallToAction />
    </>
  );
}
