import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { TestimonialCard } from "@/components/cards/testimonial-card";

import { testimonialsContent } from "@/content/testimonials";
import type { TestimonialItem, TestimonialsSections } from "@/server/cms";

interface TestimonialsProps {
  heading?: TestimonialsSections;
  testimonials?: TestimonialItem[];
}

export function Testimonials({
  heading = testimonialsContent,
  testimonials = testimonialsContent.testimonials,
}: TestimonialsProps) {
  return (
    <Section className="bg-white">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
            {heading.badge}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary lg:text-5xl">
            {heading.title}
          </h2>
          <p className="mt-4 text-lg leading-[1.6] text-muted-foreground">
            {heading.description}
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <TestimonialCard key={`${testimonial.name}-${index}`} testimonial={testimonial} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
