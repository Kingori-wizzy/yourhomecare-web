import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { aboutContent } from "@/content/about";
import type { PageHero } from "@/server/cms";

interface AboutHeroProps {
  hero?: PageHero;
}

export function AboutHero({ hero = aboutContent.hero }: AboutHeroProps) {
  return (
    <Section className="bg-medical">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            {hero.badge}
          </span>

          <h1 className="mt-8 text-5xl font-bold lg:text-7xl">
            {hero.title}
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-muted-foreground">
            {hero.description}
          </p>
        </div>
      </Container>
    </Section>
  );
}