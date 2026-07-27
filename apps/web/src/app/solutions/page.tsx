import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";
import { getPageContent, getPublishedSolutions, toSolutionItems } from "@/server/cms";

export const metadata = buildMetadata({
  title: "Solutions",
  description: "Discover tailored healthcare solutions for patients, families, hospitals, insurers and corporate clients.",
  path: "/solutions",
});

export default async function SolutionsPage() {
  const [content, solutions] = await Promise.all([getPageContent("solutions"), getPublishedSolutions()]);
  const items = toSolutionItems(solutions);

  return (
    <>
      <Section className="bg-slate-50">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-semibold uppercase tracking-[0.2em] text-primary">{content.hero.badge}</p>
            <h1 className="mt-4 text-4xl font-bold lg:text-5xl">{content.hero.title}</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">{content.hero.description}</p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            {items.map((solution) => (
              <div key={solution.slug} className="rounded-3xl border bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-bold">{solution.title}</h2>
                <p className="mt-4 leading-8 text-muted-foreground">{solution.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {solution.features.map((feature) => (
                    <span key={feature} className="rounded-full bg-primary/10 px-3 py-2 text-sm text-primary">{feature}</span>
                  ))}
                </div>
                <Link href={`/solutions/${solution.slug}`} className="mt-8 inline-block">
                  <Button>Explore Solution</Button>
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
