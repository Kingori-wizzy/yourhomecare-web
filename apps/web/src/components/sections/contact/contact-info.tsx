import {
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { contactContent } from "@/content/contact";
import type { ContactSections } from "@/server/cms";

interface ContactInfoProps {
  information?: ContactSections["information"];
}

const cards = [
  {
    key: "phone",
    title: "Call Us",
    icon: Phone,
    getContent: (information: ContactSections["information"]) => [information.phone],
  },
  {
    key: "email",
    title: "Email",
    icon: Mail,
    getContent: (information: ContactSections["information"]) => [information.email],
  },
  {
    key: "location",
    title: "Location",
    icon: MapPin,
    getContent: (information: ContactSections["information"]) => [information.address],
  },
  {
    key: "hours",
    title: "Business Hours",
    icon: Clock,
    getContent: (information: ContactSections["information"]) => information.hours,
  },
] as const;

export function ContactInfo({ information = contactContent.information }: ContactInfoProps) {
  return (
    <Section className="bg-section">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
            Reach Us
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary lg:text-5xl">
            How to get in touch
          </h2>
          <p className="mt-4 text-lg leading-[1.6] text-muted-foreground">
            Call, email, or visit — our care coordination team is ready to help.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            const lines = card.getContent(information);

            return (
              <article
                key={card.key}
                className="rounded-[8px] border border-border bg-white p-7 shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/12 text-secondary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-primary">{card.title}</h3>
                {lines.map((line) => (
                  <p key={line} className="mt-2 text-base leading-[1.6] text-muted-foreground">
                    {line}
                  </p>
                ))}
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
