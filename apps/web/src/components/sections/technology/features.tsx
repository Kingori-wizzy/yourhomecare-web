import {
  CalendarClock,
  ClipboardCheck,
  FileText,
  HeartPulse,
  MessageSquare,
  ShieldCheck,
  Stethoscope,
  Users,
  Activity,
  Bell,
  Database,
  Smartphone,
} from "lucide-react";

import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";

import { technologyContent } from "@/content/technology";

interface TechnologyFeaturesProps {
  features?: string[];
}

const icons = [
  ClipboardCheck,
  FileText,
  HeartPulse,
  CalendarClock,
  Activity,
  MessageSquare,
  Stethoscope,
  Bell,
  Users,
  Smartphone,
  Database,
  ShieldCheck,
];

export function TechnologyFeatures({ features = technologyContent.features }: TechnologyFeaturesProps) {
  return (
    <Section className="bg-slate-50">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-semibold uppercase tracking-widest text-primary">
            Platform Features
          </p>

          <h2 className="mt-4 text-4xl font-bold lg:text-5xl">
            Everything Needed to Coordinate Home Healthcare
          </h2>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            TaskEase provides healthcare professionals with the digital tools
            needed to deliver coordinated, accountable and patient-centred care.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = icons[index % icons.length];

            return (
              <div
                key={feature}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                  <Icon size={28} />
                </div>

                <h3 className="mt-6 text-lg font-semibold">
                  {feature}
                </h3>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Securely managed through our integrated TaskEase healthcare
                  platform.
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}