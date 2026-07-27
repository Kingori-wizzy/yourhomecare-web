import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { solutionsContent } from "@/content/solutions";
import type { PageHero, SolutionItem } from "@/server/cms";

interface SolutionsProps {
  heading?: PageHero;
  solutions?: SolutionItem[];
}

export function Solutions({ heading = solutionsContent.hero, solutions = solutionsContent.solutions }: SolutionsProps) {
  return (
    <Section className="bg-white">
      <Container>
        {/* Section Heading */}

        <div className="mx-auto max-w-3xl text-center">
          <p className="font-semibold uppercase tracking-widest text-primary">
            {heading.badge}
          </p>

          <h2 className="mt-4 text-4xl font-bold lg:text-5xl">
            {heading.title}
          </h2>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {heading.description}
          </p>
        </div>

        {/* Solutions Grid */}

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {solutions.map((solution) => (
            <Link
              key={solution.slug}
              href={`/solutions/${solution.slug}`}
              className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-xl"
            >
              <h3 className="text-2xl font-bold">
                {solution.title}
              </h3>

              <p className="mt-4 leading-7 text-muted-foreground">
                {solution.description}
              </p>

              <ul className="mt-6 space-y-2">
                {solution.features.slice(0, 4).map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-slate-700"
                  >
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-8 inline-flex items-center font-semibold text-primary">
                Explore Solution

                <ArrowRight
                  size={18}
                  className="ml-2 transition-transform group-hover:translate-x-1"
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}

        <div className="mt-16 text-center">
          <Link
            href="/solutions"
            className="inline-flex items-center rounded-xl bg-primary px-8 py-4 font-semibold text-white transition hover:opacity-90"
          >
            View All Solutions

            <ArrowRight
              size={20}
              className="ml-2"
            />
          </Link>
        </div>
      </Container>
    </Section>
  );
}