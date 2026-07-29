import {
  HeartHandshake,
  Hospital,
  Shield,
  UserRound,
} from "lucide-react";

import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";

import { technologyContent } from "@/content/technology";
import type { TechnologySections } from "@/server/cms";

const icons = [
  UserRound,
  HeartHandshake,
  Hospital,
  Shield,
];

interface TechnologyBenefitsProps {
  benefits?: TechnologySections["benefits"];
}

export function TechnologyBenefits({ benefits = technologyContent.benefits }: TechnologyBenefitsProps) {
  return (
    <Section className="bg-white">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
            Who Benefits?
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary lg:text-5xl">
            Better Outcomes for Everyone
          </h2>
          <p className="mt-4 text-lg leading-[1.6] text-muted-foreground">
            TaskEase improves communication, accountability and continuity of
            care across the entire healthcare ecosystem.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {benefits.map((benefit, index) => {
            const Icon = icons[index % icons.length];

            return (
              <article
                key={benefit.title}
                className="rounded-[8px] border border-border bg-[#f8f9ff] p-7 shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/12 text-secondary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-2xl font-bold text-primary">{benefit.title}</h3>
                <p className="mt-3 text-base leading-[1.6] text-muted-foreground">
                  {benefit.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="relative mt-16 overflow-hidden rounded-[8px] bg-gradient-to-br from-secondary via-[#0a6b6b] to-primary p-10 text-white lg:p-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]"
            aria-hidden
          />
          <div className="relative grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="text-3xl font-bold tracking-tight">
                Connected Healthcare Starts Here
              </h3>
              <p className="mt-5 text-lg leading-[1.6] text-white/90">
                From the moment a patient is discharged until recovery is
                complete, TaskEase keeps healthcare professionals, hospitals,
                insurers and families connected through one secure platform.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-[8px] border border-white/20 bg-white/10 p-5">
                <div className="text-3xl font-bold">100%</div>
                <p className="mt-2 text-sm text-white/80">Digital Documentation</p>
              </div>
              <div className="rounded-[8px] border border-white/20 bg-white/10 p-5">
                <div className="text-3xl font-bold">24/7</div>
                <p className="mt-2 text-sm text-white/80">Care Coordination</p>
              </div>
              <div className="rounded-[8px] border border-white/20 bg-white/10 p-5">
                <div className="text-3xl font-bold">Secure</div>
                <p className="mt-2 text-sm text-white/80">Clinical Records</p>
              </div>
              <div className="rounded-[8px] border border-white/20 bg-white/10 p-5">
                <div className="text-3xl font-bold">Real-Time</div>
                <p className="mt-2 text-sm text-white/80">Care Updates</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
