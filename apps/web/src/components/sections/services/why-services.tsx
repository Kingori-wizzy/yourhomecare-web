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
    <Section className="bg-slate-50">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-semibold uppercase tracking-widest text-primary">
            Why Choose YourHomeCare
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            Trusted Healthcare Beyond Hospital Walls
          </h2>
        </div>

        <div className="mx-auto mt-16 max-w-5xl grid gap-6 md:grid-cols-2">
          {reasons.map((reason) => (
            <div
              key={reason}
              className="flex items-center gap-4 rounded-2xl border bg-white p-6"
            >
              <CheckCircle2
                className="text-primary"
                size={22}
              />

              <span>{reason}</span>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}