import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { contactContent } from "@/content/contact";
import type { PageHero } from "@/server/cms";

interface ContactHeroProps {
  hero?: PageHero;
}

export function ContactHero({ hero = contactContent.hero }: ContactHeroProps) {
  return (
    <Section className="bg-medical">

      <Container>

        <div className="mx-auto max-w-4xl text-center">

          <p className="font-semibold uppercase tracking-[0.2em] text-primary">
            {hero.badge}
          </p>

          <h1 className="mt-6 text-5xl font-bold leading-tight lg:text-6xl">
            {hero.title}
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-600">
            {hero.description}
          </p>

        </div>

      </Container>

    </Section>
  );
}