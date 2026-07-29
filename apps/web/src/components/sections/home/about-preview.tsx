import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";

import { aboutContent } from "@/content/about";
import type { HomeSections } from "@/server/cms";

const DEFAULT_CONTENT: HomeSections["aboutPreview"] = {
  badge: aboutContent.hero.badge,
  title: aboutContent.hero.title,
  paragraphs: aboutContent.story.paragraphs.slice(0, 2),
  values: aboutContent.values,
};

interface AboutPreviewProps {
  content?: HomeSections["aboutPreview"];
}

export function AboutPreview({ content = DEFAULT_CONTENT }: AboutPreviewProps) {
  return (
    <Section className="bg-section-alt">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="font-semibold uppercase tracking-widest text-secondary">
            {content.badge}
          </p>

          <h2 className="mt-4 text-4xl font-bold leading-tight lg:text-5xl">
            {content.title}
          </h2>

          <p className="mt-8 text-lg leading-8 text-muted-foreground">
            {content.paragraphs[0]}
          </p>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {content.paragraphs[1]}
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {content.values.map((value) => (
              <div key={value} className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-secondary" />
                <span className="font-medium text-primary">{value}</span>
              </div>
            ))}
          </div>

          <Link href="/about" className="mt-10 inline-block">
            <Button size="lg">
              Learn More About Us
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
