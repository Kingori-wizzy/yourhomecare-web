import {
  CheckCircle2,
  Lock,
  ShieldCheck,
  Database,
  Fingerprint,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { technologyContent } from "@/content/technology";

interface TechnologySecurityProps {
  security?: string[];
}

const securityHighlights = [
  {
    icon: Lock,
    title: "Secure Access",
    description: "Controlled user permissions and secure authentication.",
  },
  {
    icon: Database,
    title: "Protected Clinical Records",
    description: "Patient documentation remains organised and securely managed.",
  },
  {
    icon: Fingerprint,
    title: "Audit Trails",
    description: "Every activity is traceable, improving accountability.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Collaboration",
    description:
      "Secure communication between clinicians, hospitals, insurers and families.",
  },
];

export function TechnologySecurity({ security = technologyContent.security }: TechnologySecurityProps) {
  return (
    <Section className="bg-section">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
            Security & Compliance
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary lg:text-5xl">
            Protecting Every Patient&apos;s Information
          </h2>
          <p className="mt-4 text-lg leading-[1.6] text-muted-foreground">
            Healthcare information deserves the highest level of protection.
            TaskEase is designed to promote secure documentation,
            accountability and trusted collaboration across the care journey.
          </p>
        </div>

        <div className="mt-14 grid items-start gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            {security.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-[8px] border border-border bg-white p-5 shadow-[var(--shadow-sm)]"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-secondary" />
                <span className="text-[15px] font-medium text-primary">{item}</span>
              </div>
            ))}
          </div>

          <div className="rounded-[8px] border border-border bg-white p-8 shadow-[var(--shadow-sm)]">
            <div className="grid gap-6">
              {securityHighlights.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/12 text-secondary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary">{item.title}</h3>
                      <p className="mt-1 text-sm leading-[1.6] text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
