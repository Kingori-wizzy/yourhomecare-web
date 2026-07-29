import { Star } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

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
          {testimonials.slice(0, 3).map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-[8px] border border-border bg-[#f8f9ff] p-7 shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
            >
              <div className="flex gap-1 text-secondary" aria-label="5 star rating">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-secondary text-secondary" />
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
  );
}
