import {
  Activity,
  BriefcaseMedical,
  HeartHandshake,
  HeartPulse,
  HelpingHand,
  Hospital,
  Network,
  Users,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ServiceDetailCard } from "@/components/cards/service-detail-card";
import { servicesContent } from "@/content/services";
import type { ServiceItem } from "@/server/cms";

const icons = {
  HeartPulse,
  HeartHandshake,
  Users,
  Hospital,
  Activity,
  BriefcaseMedical,
  HelpingHand,
  Network,
};

interface ServicesGridProps {
  services?: ServiceItem[];
}

export function ServicesGrid({ services = servicesContent.services }: ServicesGridProps) {
  return (
    <Section className="bg-white">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
            What we offer
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary lg:text-5xl">
            Home healthcare services
          </h2>
          <p className="mt-4 text-lg leading-[1.6] text-muted-foreground">
            Clinically led care packages designed around comfort, recovery, and family peace of mind.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {services.map((service) => {
            const Icon = icons[service.icon as keyof typeof icons] ?? HeartPulse;
            return (
              <ServiceDetailCard
                key={service.title}
                title={service.title}
                description={service.description}
                features={service.features}
                icon={<Icon className="h-6 w-6" />}
              />
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
