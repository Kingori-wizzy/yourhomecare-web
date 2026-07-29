import { Star } from "lucide-react";

import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CallToAction } from "@/components/sections/home/cta";
import { buildMetadata } from "@/lib/metadata";
import { getPageContent, getPublishedTestimonials, toTestimonialItems } from "@/server/cms";

export const metadata = buildMetadata({
  title: "Testimonials",
  description: "Read stories from patients, families and partners who trust YourHomeCare.",
  path: "/testimonials",
});

export default async function TestimonialsPage() {
  const [content, testimonials] = await Promise.all([
    getPageContent("testimonials"),
    getPublishedTestimonials(),
  ]);
  const items = toTestimonialItems(testimonials);

  return (
    <>
      <PageHero
        badge={content.badge || "Trusted by 5,000+ families"}
        title={content.title}
        description={content.description}
        imageUrl="/images/flyers/loved-ones-home.png"
        primaryCta={{ label: "Find Care", href: "/appointments" }}
        secondaryCta={{ label: "Our Services", href: "/services" }}
        priority
      />

      <Section className="bg-white">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((testimonial, index) => (
              <article
                key={`${testimonial.name}-${index}`}
                className="rounded-[8px] border border-border bg-[#f8f9ff] p-7 shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
              >
                <div className="flex gap-1 text-secondary" aria-label="5 star rating">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="h-4 w-4 fill-secondary text-secondary"
                    />
                  ))}
                </div>

                <p className="mt-5 text-base leading-[1.6] text-primary/90">
                  “{testimonial.quote}”
                </p>

                <div className="mt-7 border-t border-border pt-5">
                  <h3 className="font-bold text-primary">{testimonial.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <CallToAction />
    </>
  );
}
