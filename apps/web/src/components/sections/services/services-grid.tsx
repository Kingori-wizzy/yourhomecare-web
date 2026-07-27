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

export function ServicesGrid() {
  return (
    <Section>
      <Container>
        <div className="grid gap-10 lg:grid-cols-2">
          {servicesContent.services.map((service) => {
            const Icon =
              icons[service.icon as keyof typeof icons] ?? HeartPulse;

            return (
              <ServiceDetailCard
                key={service.title}
                title={service.title}
                description={service.description}
                features={service.features}
                icon={<Icon size={42} />}
              />
            );
          })}
        </div>
      </Container>
    </Section>
  );
}