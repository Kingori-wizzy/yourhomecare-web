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

        <div className="mx-auto max-w-3xl text-center">

          <p className="font-semibold uppercase tracking-widest text-primary">
            Digital Healthcare
          </p>

          <h2 className="mt-4 text-4xl font-bold lg:text-5xl">
            {introduction.title}
          </h2>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {introduction.description}
          </p>

        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2">

          {highlights.map((item) => {

            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon size={28} />
                </div>

                <h3 className="mt-6 text-2xl font-semibold">
                  {item.title}
                </h3>

                <p className="mt-4 leading-8 text-muted-foreground">
                  {item.description}
                </p>

              </div>
            );

          })}

        </div>

      </Container>
    </Section>
  );
}