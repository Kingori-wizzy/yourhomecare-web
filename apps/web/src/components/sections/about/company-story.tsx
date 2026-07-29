import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { aboutContent } from "@/content/about";
import type { AboutSections } from "@/server/cms";

interface CompanyStoryProps {
  story?: AboutSections["story"];
}

export function CompanyStory({ story = aboutContent.story }: CompanyStoryProps) {
  return (
    <Section className="bg-section">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
            Our Story
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary lg:text-5xl">
            {story.title}
          </h2>
          <div className="mt-8 space-y-5 text-lg leading-[1.6] text-muted-foreground">
            {story.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
