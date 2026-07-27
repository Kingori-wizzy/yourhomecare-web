import {
  HeartHandshake,
  Hospital,
  Shield,
  UserRound,
} from "lucide-react";

import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";

import { technologyContent } from "@/content/technology";

const icons = [
  UserRound,
  HeartHandshake,
  Hospital,
  Shield,
];

export function TechnologyBenefits() {
  return (
    <Section className="bg-white">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-semibold uppercase tracking-widest text-primary">
            Who Benefits?
          </p>

          <h2 className="mt-4 text-4xl font-bold lg:text-5xl">
            Better Outcomes for Everyone
          </h2>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            TaskEase improves communication, accountability and continuity of
            care across the entire healthcare ecosystem.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {technologyContent.benefits.map((benefit, index) => {
            const Icon = icons[index % icons.length];

            return (
              <div
                key={benefit.title}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm transition hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon size={28} />
                </div>

                <h3 className="mt-6 text-2xl font-bold">
                  {benefit.title}
                </h3>

                <p className="mt-4 leading-8 text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-20 rounded-3xl bg-primary p-10 text-white lg:p-16">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="text-3xl font-bold">
                Connected Healthcare Starts Here
              </h3>

              <p className="mt-6 text-white/90 leading-8">
                From the moment a patient is discharged until recovery is
                complete, TaskEase keeps healthcare professionals, hospitals,
                insurers and families connected through one secure platform.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-2xl bg-white/10 p-6">
                <div className="text-4xl font-bold">100%</div>
                <p className="mt-2 text-white/80">
                  Digital Documentation
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-6">
                <div className="text-4xl font-bold">24/7</div>
                <p className="mt-2 text-white/80">
                  Care Coordination
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-6">
                <div className="text-4xl font-bold">Secure</div>
                <p className="mt-2 text-white/80">
                  Clinical Records
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-6">
                <div className="text-4xl font-bold">Real-Time</div>
                <p className="mt-2 text-white/80">
                  Care Updates
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}