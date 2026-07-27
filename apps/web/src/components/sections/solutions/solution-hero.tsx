import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { solutionsContent } from "@/content/solutions";

export function SolutionHero() {
  return (
    <Section className="bg-slate-50">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-semibold uppercase tracking-widest text-primary">
            {solutionsContent.hero.badge}
          </p>

          <h1 className="mt-6 text-5xl font-bold lg:text-7xl">
            {solutionsContent.hero.title}
          </h1>

          <p className="mt-8 text-xl leading-9 text-muted-foreground">
            {solutionsContent.hero.description}
          </p>
        </div>
      </Container>
    </Section>
  );
}