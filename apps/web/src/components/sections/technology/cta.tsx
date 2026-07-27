import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";

export function TechnologyCTA() {
  return (
    <Section className="bg-primary text-white">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-semibold uppercase tracking-[0.25em] text-white/80">
            Powered by TaskEase
          </p>

          <h2 className="mt-6 text-4xl font-bold lg:text-5xl">
            Smarter Healthcare Starts with Better Coordination
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-white/90">
            Whether you are a patient, family member, hospital, medical insurer
            or healthcare professional, TaskEase helps ensure continuity,
            accountability and high-quality care throughout every stage of the
            healthcare journey.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-5">
            <Link href="/appointments">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-slate-100"
              >
                Book an Assessment
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

            <Link
              href="/solutions"
              className="inline-flex items-center font-semibold text-white hover:text-white/80"
            >
              Explore Our Solutions

              <ArrowRight
                size={18}
                className="ml-2"
              />
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}