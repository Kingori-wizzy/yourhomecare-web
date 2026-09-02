import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { CallToAction } from "@/components/sections/home/cta";

import { getPublishedSolutions, toSolutionItems } from "@/server/cms";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const solutions = toSolutionItems(await getPublishedSolutions());
  const solution = solutions.find((item) => item.slug === slug);

  if (!solution) {
    return { title: "Solution not found" };
  }

  return {
    title: solution.title,
    description: solution.description,
    robots: { index: true, follow: true },
  };
}

export default async function SolutionPage({ params }: PageProps) {
  const { slug } = await params;

  const solutions = toSolutionItems(await getPublishedSolutions());
  const solution = solutions.find((item) => item.slug === slug);

  if (!solution) {
    notFound();
  }

  return (
    <>
      <PageHero
        badge="Healthcare Solutions"
        title={solution.title}
        description={solution.description}
        imageUrl="/images/flyers/insurers-partners.png"
        primaryCta={{ label: "Find Care", href: "/appointments" }}
        secondaryCta={{ label: "Our Services", href: "/services" }}
        priority
      />

      <Section className="bg-white">
        <Container>
          <Link
            href="/solutions"
            className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-secondary transition hover:text-primary"
          >
            <ArrowLeft size={16} />
            Back to Solutions
          </Link>

          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
                What&apos;s included
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary lg:text-5xl">
                Services Included
              </h2>
              <p className="mt-4 text-lg leading-[1.6] text-muted-foreground">
                Every solution from YourHomeCare is designed around safe,
                coordinated, patient-centred healthcare delivered in the comfort
                of home. Our multidisciplinary team works closely with patients,
                families, hospitals and healthcare partners to ensure continuity
                of care and better clinical outcomes.
              </p>
              <Link href="/appointments" className="mt-8 inline-block">
                <Button
                  size="lg"
                  className="h-12 rounded-[8px] bg-secondary px-6 text-base font-semibold text-white hover:bg-secondary/90"
                >
                  Book an Assessment
                </Button>
              </Link>
            </div>

            <div className="rounded-[8px] border border-border bg-[#f8f9ff] p-7 shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]">
              <h3 className="text-2xl font-bold text-primary">Services Included</h3>
              <div className="mt-6 space-y-4">
                {solution.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-secondary" />
                    <span className="text-[15px] font-medium text-primary">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <CallToAction />
    </>
  );
}
