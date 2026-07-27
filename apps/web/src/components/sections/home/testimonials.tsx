import { Quote } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { testimonialsContent } from "@/content/testimonials";

export function Testimonials() {
  return (
    <Section className="bg-slate-50">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-semibold uppercase tracking-widest text-primary">
            {testimonialsContent.badge}
          </p>

          <h2 className="mt-4 text-4xl font-bold lg:text-5xl">
            {testimonialsContent.title}
          </h2>

          <p className="mt-6 text-lg text-muted-foreground">
            {testimonialsContent.description}
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {testimonialsContent.testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Quote size={28} />
              </div>

              <p className="mt-6 italic leading-8 text-slate-600">
                {testimonial.quote}
              </p>

              <div className="mt-8 border-t border-slate-100 pt-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  {testimonial.name}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}