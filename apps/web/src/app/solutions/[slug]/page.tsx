import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";

import { getSolution } from "@/lib/solutions";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function SolutionPage({ params }: PageProps) {
  const { slug } = await params;

  const solution = getSolution(slug);

  if (!solution) {
    notFound();
  }

  return (
    <>
      {/* Hero */}

      <Section className="bg-slate-50">
        <Container>
          <Link
            href="/solutions"
            className="mb-8 inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft size={18} />
            Back to Solutions
          </Link>

          <div className="max-w-4xl">
            <p className="font-semibold uppercase tracking-widest text-primary">
              Solution
            </p>

            <h1 className="mt-4 text-5xl font-bold lg:text-6xl">
              {solution.title}
            </h1>

            <p className="mt-8 text-xl leading-9 text-muted-foreground">
              {solution.description}
            </p>
          </div>
        </Container>
      </Section>

      {/* Features */}

      <Section>
        <Container>
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">
                Services Included
              </h2>

              <p className="mt-6 leading-8 text-muted-foreground">
                Every solution from YourHomeCare is designed around safe,
                coordinated, patient-centred healthcare delivered in the comfort
                of home. Our multidisciplinary team works closely with patients,
                families, hospitals and healthcare partners to ensure continuity
                of care and better clinical outcomes.
              </p>

              <Link
                href="/appointments"
                className="mt-10 inline-block"
              >
                <Button size="lg">
                  Book an Assessment
                </Button>
              </Link>
            </div>

            <div className="rounded-3xl border bg-white p-8 shadow-sm">
              <h3 className="mb-6 text-2xl font-semibold">
                Services Included
              </h3>

              <div className="space-y-4">
                {solution.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2
                      size={20}
                      className="text-primary"
                    />

                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA */}

      <Section className="bg-primary text-white">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold">
              Ready to Learn More?
            </h2>

            <p className="mt-6 text-lg text-white/80">
              Speak with our healthcare team to discuss how this solution can
              support you, your family, your organisation or your patients.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/appointments">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-slate-100"
                >
                  Book Assessment
                </Button>
              </Link>

              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}