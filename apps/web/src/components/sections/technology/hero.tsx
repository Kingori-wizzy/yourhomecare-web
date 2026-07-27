import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";

import { technologyContent } from "@/content/technology";
import type { PageHero } from "@/server/cms";

interface TechnologyHeroProps {
  hero?: PageHero;
}

export function TechnologyHero({ hero = technologyContent.hero }: TechnologyHeroProps) {
  return (
    <Section className="bg-gradient-to-br from-slate-50 via-white to-primary/5">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Left */}

          <div>

            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
              <ShieldCheck size={18} />
              <span className="text-sm font-semibold">
                {hero.badge}
              </span>
            </div>

            <h1 className="mt-8 text-5xl font-bold leading-tight lg:text-6xl">
              {hero.title}
            </h1>

            <p className="mt-8 text-xl leading-9 text-slate-600">
              {hero.description}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/contact">
                <Button size="lg">
                  Speak to Our Team
                </Button>
              </Link>

              <Link href="/appointments">
                <Button
                  variant="outline"
                  size="lg"
                >
                  Book Assessment
                </Button>
              </Link>
            </div>

          </div>

          {/* Right */}

          <div className="flex justify-center">

            <div className="flex aspect-square w-full max-w-xl items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-xl">

              <div className="text-center">

                <ShieldCheck
                  size={80}
                  className="mx-auto text-primary"
                />

                <h3 className="mt-6 text-2xl font-bold">
                  TaskEase Platform
                </h3>

                <p className="mt-4 max-w-sm text-slate-600">
                  Secure digital care coordination for patients,
                  clinicians, hospitals and medical insurers.
                </p>

              </div>

            </div>

          </div>

        </div>
      </Container>
    </Section>
  );
}