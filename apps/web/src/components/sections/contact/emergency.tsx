import { AlertTriangle } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { contactContent } from "@/content/contact";

interface EmergencySectionProps {
  message?: string;
}

export function EmergencySection({ message = contactContent.emergency }: EmergencySectionProps) {
  return (
    <Section className="bg-section">
      <Container>
        <div className="rounded-[8px] border border-border bg-white p-10 shadow-[var(--shadow-sm)] lg:p-12">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/12 text-secondary">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <h2 className="mt-6 text-3xl font-bold tracking-tight text-primary">
              Medical Emergency?
            </h2>

            <p className="mt-4 max-w-3xl text-lg leading-[1.6] text-muted-foreground">
              {message}
            </p>

            <p className="mt-3 max-w-3xl leading-[1.6] text-muted-foreground">
              Our team can assist with arranging home healthcare after hospital discharge and
              support your continued recovery.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
