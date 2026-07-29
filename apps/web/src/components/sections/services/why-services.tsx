import { CheckCircle2 } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

const reasons = [
  "Qualified healthcare professionals",
  "Personalised care plans",
  "Technology-enabled care coordination",
  "Flexible home care packages",
  "Hospital partnerships",
  "Medical insurer partnerships",
  "Home visits across Kenya",
  "Compassionate patient-centred care",
];

export function WhyServices() {
  return (
    <Section className="bg-section">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
            Why Choose YourHomeCare
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary lg:text-5xl">
            Trusted Healthcare Beyond Hospital Walls
          </h2>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-2">
          {reasons.map((reason) => (
            <div
              key={reason}
              className="flex items-center gap-3 rounded-[8px] border border-border bg-white p-5 shadow-[var(--shadow-sm)]"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0 text-secondary" />
              <span className="text-[15px] font-medium text-primary">{reason}</span>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
