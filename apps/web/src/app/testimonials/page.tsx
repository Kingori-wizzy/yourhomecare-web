import { Quote } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
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
      <Section className="bg-slate-50">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-semibold uppercase tracking-[0.2em] text-primary">{content.badge}</p>
            <h1 className="mt-4 text-4xl font-bold lg:text-5xl">{content.title}</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">{content.description}</p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-3">
            {items.map((testimonial, index) => (
              <article
                key={`${testimonial.name}-${index}`}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Quote size={28} />
                </div>

                <p className="mt-6 italic leading-8 text-slate-600">{testimonial.quote}</p>

                <div className="mt-8 border-t border-slate-100 pt-6">
                  <h3 className="text-lg font-semibold text-slate-900">{testimonial.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
