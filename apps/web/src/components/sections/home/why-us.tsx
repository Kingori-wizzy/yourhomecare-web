import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { whyUsContent } from "@/content/why-us";

export function WhyChooseUs() {
  return (
    <Section className="bg-white">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-semibold uppercase tracking-widest text-primary">
            {whyUsContent.badge}
          </p>

          <h2 className="mt-4 text-4xl font-bold lg:text-5xl">
            {whyUsContent.title}
          </h2>

          <p className="mt-6 text-lg text-muted-foreground">
            {whyUsContent.description}
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {whyUsContent.features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:bg-white hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon size={28} />
                </div>

                <h3 className="mt-6 text-xl font-semibold leading-snug">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}