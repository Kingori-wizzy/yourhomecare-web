import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { servicesContent } from "@/content/services";
import type { PageHero } from "@/server/cms";

interface ServicesHeroProps {
  hero?: PageHero;
}

export function ServicesHero({ hero = servicesContent.hero }: ServicesHeroProps) {
  return (
    <Section className="bg-medical">
      <Container>
        <div className="mx-auto max-w-4xl text-center">

          <p className="font-semibold uppercase tracking-widest text-primary">
            {hero.badge}
          </p>

          <h1 className="mt-6 text-5xl font-bold lg:text-7xl">
            {hero.title}
          </h1>

          <p className="mt-8 text-xl leading-9 text-muted-foreground">
            {hero.description}
          </p>

        </div>
      </Container>
    </Section>
  );
}