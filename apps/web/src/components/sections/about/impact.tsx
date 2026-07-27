import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { aboutContent } from "@/content/about";
import type { AboutSections } from "@/server/cms";

interface ImpactSectionProps {
  impact?: AboutSections["impact"];
}

export function ImpactSection({ impact = aboutContent.impact }: ImpactSectionProps) {
  return (
    <Section className="bg-primary text-white">

      <Container>

        <div className="grid gap-10 text-center md:grid-cols-4">

          {impact.map((item) => (
            <div key={item.label}>

              <h2 className="text-5xl font-extrabold">
                {item.value}
              </h2>

              <p className="mt-3 text-white/80">
                {item.label}
              </p>

            </div>
          ))}

        </div>

      </Container>

    </Section>
  );
}