import { Hospital, Home, Users, HeartPulse } from "lucide-react";

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
    <Section className="bg-section">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
            Our Approach
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary lg:text-5xl">
            Coordinated Healthcare Beyond Hospital Walls
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article
                key={step.title}
                className="rounded-[8px] border border-border bg-white p-7 shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/12 text-secondary">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="mt-5 text-2xl font-bold text-primary">{step.title}</h3>
                <p className="mt-3 text-base leading-[1.6] text-muted-foreground">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
