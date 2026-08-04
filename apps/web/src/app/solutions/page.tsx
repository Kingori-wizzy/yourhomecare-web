import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { CallToAction } from "@/components/sections/home/cta";
import { buildMetadata } from "@/lib/metadata";
import { getPageContent, getPublishedSolutions, toSolutionItems } from "@/server/cms";

export const metadata = buildMetadata({
  title: "Solutions",
  description:
    "Discover tailored healthcare solutions for patients, families, hospitals, insurers and corporate clients.",
  path: "/solutions",
});

export default async function SolutionsPage() {
  const [content, solutions] = await Promise.all([
    getPageContent("solutions"),
    getPublishedSolutions(),
  ]);
  const items = toSolutionItems(solutions);

  return (
    <>
      <PageHero
        badge={content.hero.badge || "Healthcare Solutions"}
        title={content.hero.title}
        description={content.hero.description}
        imageUrl="/images/flyers/insurers-partners.png"
        primaryCta={{ label: "Find Care", href: "/appointments" }}
        secondaryCta={{ label: "Our Services", href: "/services" }}
        priority
      />

      <Section className="bg-white">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
              Who we serve
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary lg:text-5xl">
              Solutions for every care partner
            </h2>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {items.map((solution) => (
              <article
                key={solution.slug}
                className="rounded-[8px] border border-border bg-[#f8f9ff] p-7 shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
              >
                <h2 className="text-2xl font-bold text-primary">{solution.title}</h2>
                <p className="mt-3 text-base leading-[1.6] text-muted-foreground">
                  {solution.description}
                </p>
                <ul className="mt-6 space-y-2">
                  {solution.features.slice(0, 4).map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-[15px] text-primary/90">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={`/solutions/${solution.slug}`} className="mt-7 inline-block">
                  <Button className="h-11 rounded-[8px] bg-secondary px-5 font-semibold text-white hover:bg-secondary/90">
                    Explore Solution
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <CallToAction />
    </>
  );
}
