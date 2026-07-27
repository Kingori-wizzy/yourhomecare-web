import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { aboutContent } from "@/content/about";

export function AboutHero() {
  return (
    <Section className="bg-gradient-to-b from-slate-50 to-white">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            {aboutContent.hero.badge}
          </span>

          <h1 className="mt-8 text-5xl font-bold lg:text-7xl">
            {aboutContent.hero.title}
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-muted-foreground">
            {aboutContent.hero.description}
          </p>
        </div>
      </Container>
    </Section>
  );
}