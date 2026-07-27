import {
  Hospital,
  Home,
  Users,
  HeartPulse,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

const steps = [
  {
    icon: Hospital,
    title: "Hospital Partnership",
    description:
      "We work closely with hospitals and consultants to ensure smooth transitions from hospital to home.",
  },
  {
    icon: HeartPulse,
    title: "Personalised Care Plan",
    description:
      "Every patient receives an individual care plan tailored to their clinical and personal needs.",
  },
  {
    icon: Home,
    title: "Healthcare at Home",
    description:
      "Qualified healthcare professionals deliver compassionate, high-quality care in the comfort of home.",
  },
  {
    icon: Users,
    title: "Continuous Coordination",
    description:
      "Families, clinicians, insurers and healthcare teams stay connected throughout the care journey.",
  },
];

export function ApproachSection() {
  return (
    <Section>
      <Container>

        <div className="mx-auto max-w-3xl text-center">

          <p className="font-semibold uppercase tracking-widest text-primary">
            Our Approach
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            Coordinated Healthcare Beyond Hospital Walls
          </h2>

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="rounded-3xl border p-8 transition hover:shadow-lg"
              >
                <Icon
                  className="text-primary"
                  size={42}
                />

                <h3 className="mt-6 text-2xl font-semibold">
                  {step.title}
                </h3>

                <p className="mt-4 leading-8 text-muted-foreground">
                  {step.description}
                </p>

              </div>
            );
          })}

        </div>

      </Container>
    </Section>
  );
}