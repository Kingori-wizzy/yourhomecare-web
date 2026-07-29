import {
  Activity,
  ClipboardList,
  HeartHandshake,
  Smartphone,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { technologyContent } from "@/content/technology";
import type { TechnologySections } from "@/server/cms";

const highlights = [
  {
    icon: Smartphone,
    title: "Digital Care Coordination",
    description:
      "Every visit, observation and care plan is securely recorded for continuity of care.",
  },
  {
    icon: ClipboardList,
    title: "Clinical Documentation",
    description:
      "Healthcare professionals document assessments, medications and treatment plans digitally.",
  },
  {
    icon: Activity,
    title: "Real-Time Monitoring",
    description:
      "Patient observations and visit updates are captured accurately to improve decision making.",
  },
  {
    icon: HeartHandshake,
    title: "Connected Care",
    description:
      "Families, hospitals and clinicians stay informed throughout the patient's healthcare journey.",
  },
];

interface TechnologyOverviewProps {
  introduction?: TechnologySections["introduction"];
}

export function TechnologyOverview({ introduction = technologyContent.introduction }: TechnologyOverviewProps) {
  return (
    <Section className="bg-white">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
            Digital Healthcare
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary lg:text-5xl">
            {introduction.title}
          </h2>
          <p className="mt-4 text-lg leading-[1.6] text-muted-foreground">
            {introduction.description}
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-[8px] border border-border bg-[#f8f9ff] p-7 shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/12 text-secondary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-2xl font-bold text-primary">{item.title}</h3>
                <p className="mt-3 text-base leading-[1.6] text-muted-foreground">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
