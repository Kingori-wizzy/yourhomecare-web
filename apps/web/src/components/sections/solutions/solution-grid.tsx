import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { solutionsContent } from "@/content/solutions";

export function SolutionGrid() {
  return (
    <Section>
      <Container>
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {solutionsContent.solutions.map((solution) => (
            <Link
              key={solution.slug}
              href={`/solutions/${solution.slug}`}
              className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-xl"
            >
              <h3 className="text-2xl font-bold">
                {solution.title}
              </h3>

              <p className="mt-4 leading-8 text-muted-foreground">
                {solution.description}
              </p>

              <ul className="mt-6 space-y-2">
                {solution.features.map((feature) => (
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
                  className="ml-2 transition-transform group-hover:translate-x-1"
                  size={18}
                />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}