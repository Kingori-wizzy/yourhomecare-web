import { Heart, Target, Eye, ShieldCheck, Sparkles, Handshake, Users, BadgeCheck } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { aboutContent } from "@/content/about";

const icons = [Heart, ShieldCheck, BadgeCheck, Sparkles, Handshake, Users, Target];

interface MissionSectionProps {
  mission?: string;
  vision?: string;
  values?: string[];
}

export function MissionSection({
  mission = aboutContent.mission,
  vision = aboutContent.vision,
  values = aboutContent.values,
}: MissionSectionProps) {
  return (
    <Section className="bg-white">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
            Our Foundation
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary lg:text-5xl">
            Guided by Purpose
          </h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          <article className="rounded-[8px] border border-border bg-[#f8f9ff] p-7 shadow-[var(--shadow-sm)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/12 text-secondary">
              <Target className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-2xl font-bold text-primary">Mission</h3>
            <p className="mt-3 text-base leading-[1.6] text-muted-foreground">{mission}</p>
          </article>

          <article className="rounded-[8px] border border-border bg-[#f8f9ff] p-7 shadow-[var(--shadow-sm)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/12 text-secondary">
              <Eye className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-2xl font-bold text-primary">Vision</h3>
            <p className="mt-3 text-base leading-[1.6] text-muted-foreground">{vision}</p>
          </article>

          <article className="rounded-[8px] border border-border bg-[#f8f9ff] p-7 shadow-[var(--shadow-sm)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/12 text-secondary">
              <Heart className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-2xl font-bold text-primary">Core Values</h3>
            <div className="mt-5 space-y-3">
              {values.map((value, index) => {
                const Icon = icons[index] ?? Heart;
                return (
                  <div key={value} className="flex items-center gap-3 text-[15px] text-primary/90">
                    <Icon className="h-4 w-4 text-secondary" />
                    <span>{value}</span>
                  </div>
                );
              })}
            </div>
          </article>
        </div>
      </Container>
    </Section>
  );
}
