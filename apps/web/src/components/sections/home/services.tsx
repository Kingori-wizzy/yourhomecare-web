import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/common/section-heading";
import { ServiceCard } from "@/components/cards/service-card";
import { services } from "@/content/services";

export function Services() {
  return (
    <Section>
      <Container>
        <SectionHeading
          badge="Our Services"
          title="Professional Home Healthcare Services"
          description="We provide compassionate healthcare services tailored to every individual and family."
        />

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              icon={service.icon}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}