import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { aboutContent } from "@/content/about";

export function CompanyStory() {
  return (
    <Section>
      <Container>
        <div className="grid gap-16 lg:grid-cols-2">

          <div>

            <h2 className="text-4xl font-bold">
              {aboutContent.story.title}
            </h2>

            <div className="mt-8 space-y-6 text-lg leading-8 text-muted-foreground">
              {aboutContent.story.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

          </div>

          <div className="rounded-3xl bg-slate-100 min-h-[420px]" />

        </div>
      </Container>
    </Section>
  );
}