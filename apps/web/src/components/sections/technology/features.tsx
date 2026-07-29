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
    <Section className="bg-section">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
            Platform Features
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary lg:text-5xl">
            Everything Needed to Coordinate Home Healthcare
          </h2>
          <p className="mt-4 text-lg leading-[1.6] text-muted-foreground">
            TaskEase provides healthcare professionals with the digital tools
            needed to deliver coordinated, accountable and patient-centred care.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = icons[index % icons.length];

            return (
              <article
                key={feature}
                className="rounded-[8px] border border-border bg-white p-6 shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/12 text-secondary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-primary">{feature}</h3>
                <p className="mt-3 text-sm leading-[1.6] text-muted-foreground">
                  Securely managed through our integrated TaskEase healthcare
                  platform.
                </p>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
