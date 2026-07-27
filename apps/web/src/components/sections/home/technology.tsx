import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { technologyContent } from "@/content/technology";

export function Technology() {
  return (
    <Section className="bg-slate-50">
      <Container>
        {/* Section Heading */}

        <div className="mx-auto max-w-3xl text-center">
          <p className="font-semibold uppercase tracking-widest text-primary">
            {technologyContent.hero.badge}
          </p>

          <h2 className="mt-4 text-4xl font-bold lg:text-5xl">
            {technologyContent.hero.title}
          </h2>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {technologyContent.hero.description}
          </p>
        </div>

        {/* Main Content */}

        <div className="mt-20 grid items-center gap-16 lg:grid-cols-2">
          {/* Left */}

          <div>
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Smartphone size={34} />
            </div>

            <h3 className="mt-8 text-3xl font-bold">
              {technologyContent.introduction.title}
            </h3>

            <p className="mt-6 leading-8 text-muted-foreground">
              {technologyContent.introduction.description}
            </p>

            <div className="mt-10">
              <Link
                href="/technology"
                className="inline-flex items-center font-semibold text-primary"
              >
                Learn More About TaskEase

                <ArrowRight
                  className="ml-2"
                  size={18}
                />
              </Link>
            </div>
          </div>

          {/* Right */}

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-center gap-3">
              <ShieldCheck
                className="text-primary"
                size={28}
              />

              <h3 className="text-2xl font-bold">
                Platform Features
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {technologyContent.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
                >
                  <CheckCircle2
                    size={18}
                    className="text-primary"
                  />

                  <span className="text-sm font-medium">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits */}

        <div className="mt-20">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {technologyContent.benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h4 className="text-xl font-semibold">
                  {benefit.title}
                </h4>

                <p className="mt-4 leading-7 text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}

        <div className="mt-20 text-center">
          <Link
            href="/technology"
            className="inline-flex items-center rounded-xl bg-primary px-8 py-4 font-semibold text-white transition hover:opacity-90"
          >
            Explore Our Technology

            <ArrowRight
              className="ml-2"
              size={20}
            />
          </Link>
        </div>
      </Container>
    </Section>
  );
}