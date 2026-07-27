import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export function CallToAction() {
  return (
    <Section className="bg-primary text-white">
      <Container>
        <div className="mx-auto max-w-4xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
            Let’s Bring Healthcare Home
          </p>

          <h2 className="mt-6 text-4xl font-bold leading-tight lg:text-6xl">
            Professional Healthcare,
            <br />
            Wherever Patients Call Home.
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-white/90">
            Whether you’re a patient, family member, hospital,
            medical insurer or healthcare professional,
            our experienced team is ready to support you with
            compassionate, coordinated healthcare delivered in
            the comfort of home.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link href="/appointments">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-slate-100"
              >
                Request an Assessment
              </Button>
            </Link>

            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                Speak to Our Team
              </Button>
            </Link>
          </div>

        </div>
      </Container>
    </Section>
  );
}