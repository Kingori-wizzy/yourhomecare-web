import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";

import { aboutContent } from "@/content/about";

export function AboutPreview() {
  return (
    <Section className="bg-white">
      <Container>
        <div className="grid items-center gap-20 lg:grid-cols-2">

          {/* Left Content */}

          <div>

            <p className="font-semibold uppercase tracking-widest text-primary">
              {aboutContent.hero.badge}
            </p>

            <h2 className="mt-4 text-4xl font-bold leading-tight lg:text-5xl">
              {aboutContent.hero.title}
            </h2>

            <p className="mt-8 text-lg leading-8 text-muted-foreground">
              {aboutContent.story.paragraphs[0]}
            </p>

            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {aboutContent.story.paragraphs[1]}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {aboutContent.values.map((value) => (
                <div
                  key={value}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2
                    size={20}
                    className="text-primary"
                  />

                  <span className="font-medium">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="mt-10 inline-block"
            >
              <Button size="lg">
                Learn More About Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

          </div>

          {/* Right Content */}

          <div className="relative">

            <div className="flex min-h-[500px] items-center justify-center rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">

              <span className="text-lg text-slate-400">
                Company Image
              </span>

            </div>

            {/* Floating Card */}

            <div className="absolute -bottom-8 -left-8 rounded-2xl bg-white p-6 shadow-xl">

              <p className="text-3xl font-bold text-primary">
                24/7
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Professional Home Care
              </p>

            </div>

          </div>

        </div>
      </Container>
    </Section>
  );
}