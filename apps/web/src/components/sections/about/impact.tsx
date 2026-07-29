import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { aboutContent } from "@/content/about";
import type { AboutSections } from "@/server/cms";

interface ImpactSectionProps {
  impact?: AboutSections["impact"];
}

export function ImpactSection({ impact = aboutContent.impact }: ImpactSectionProps) {
  return (
    <Section className="bg-white">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
            Our Impact
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary lg:text-5xl">
            Care that makes a measurable difference
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {impact.map((item) => (
            <article
              key={item.label}
              className="rounded-[8px] border border-border bg-[#f8f9ff] p-7 text-center shadow-[var(--shadow-sm)]"
            >
              <p className="text-4xl font-extrabold text-secondary">{item.value}</p>
              <p className="mt-2 text-sm font-medium text-primary">{item.label}</p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
