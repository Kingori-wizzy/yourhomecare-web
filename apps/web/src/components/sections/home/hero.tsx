import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { HeroImage } from "./hero-image";
import { TrustPill } from "./trust-pill";

import { homeContent } from "@/content/home";
import type { HomeSections } from "@/server/cms";

interface HeroProps {
  hero?: HomeSections["hero"];
}

export function Hero({ hero = homeContent.hero }: HeroProps) {
  return (
    <Section className="overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              {hero.badge}
            </div>

            {/* Heading */}
            <h1 className="mt-8 text-5xl font-extrabold leading-tight tracking-tight lg:text-7xl">
              {hero.title}
            </h1>

            {/* Highlight */}
            <p className="mt-4 text-xl font-semibold text-primary">
              {hero.highlight}
            </p>

            {/* Description */}
            <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground">
              {hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href={hero.primaryButton.href}>
                <Button size="lg">
                  {hero.primaryButton.text}
                </Button>
              </Link>

              <Link href={hero.secondaryButton.href}>
                <Button
                  variant="outline"
                  size="lg"
                >
                  {hero.secondaryButton.text}
                </Button>
              </Link>
            </div>

            {/* Trust Pills */}
            <div className="mt-10 flex flex-wrap gap-3">
              {hero.trust.map((item) => (
                <TrustPill
                  key={item}
                  text={item}
                />
              ))}
            </div>
          </div>

          {/* Right Image */}
          <HeroImage />
        </div>
      </Container>
    </Section>
  );
}