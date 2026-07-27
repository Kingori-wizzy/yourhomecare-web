import {
  Heart,
  Target,
  Eye,
  ShieldCheck,
  Sparkles,
  Handshake,
  Users,
  BadgeCheck,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { aboutContent } from "@/content/about";

const icons = [
  Heart,
  ShieldCheck,
  BadgeCheck,
  Sparkles,
 Handshake,
  Users,
  Target,
];

export function MissionSection() {
  return (
    <Section className="bg-slate-50">
      <Container>
        <div className="mx-auto max-w-3xl text-center">

          <p className="font-semibold uppercase tracking-widest text-primary">
            Our Foundation
          </p>

          <h2 className="mt-4 text-4xl font-bold lg:text-5xl">
            Guided by Purpose
          </h2>

        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">

          <div className="rounded-3xl border bg-white p-8 shadow-sm">

            <Target className="text-primary" size={42} />

            <h3 className="mt-6 text-2xl font-bold">
              Mission
            </h3>

            <p className="mt-4 leading-8 text-muted-foreground">
              {aboutContent.mission}
            </p>

          </div>

          <div className="rounded-3xl border bg-white p-8 shadow-sm">

            <Eye className="text-primary" size={42} />

            <h3 className="mt-6 text-2xl font-bold">
              Vision
            </h3>

            <p className="mt-4 leading-8 text-muted-foreground">
              {aboutContent.vision}
            </p>

          </div>

          <div className="rounded-3xl border bg-white p-8 shadow-sm">

            <Heart className="text-primary" size={42} />

            <h3 className="mt-6 text-2xl font-bold">
              Core Values
            </h3>

            <div className="mt-6 space-y-4">
              {aboutContent.values.map((value, index) => {
                const Icon = icons[index] ?? Heart;

                return (
                  <div
                    key={value}
                    className="flex items-center gap-3"
                  >
                    <Icon
                      size={18}
                      className="text-primary"
                    />

                    <span>{value}</span>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </Container>
    </Section>
  );
}