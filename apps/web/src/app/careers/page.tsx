import Link from "next/link";
import { Briefcase, HeartHandshake, ShieldCheck } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { ApplicationForm } from "@/components/sections/careers/application-form";
import { buildMetadata } from "@/lib/metadata";
import { getPageContent, getPublishedJobs, toJobItems } from "@/server/cms";

export const metadata = buildMetadata({
  title: "Careers",
  description: "Explore current careers opportunities at YourHomeCare and join our healthcare team.",
  path: "/careers",
});

export default async function CareersPage() {
  const [content, jobs] = await Promise.all([getPageContent("careers"), getPublishedJobs()]);
  const positions = toJobItems(jobs);

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
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border bg-white p-8 shadow-sm">
              <h2 className="text-3xl font-bold">Open Positions</h2>
              <div className="mt-8 space-y-6">
                {positions.map((position) => (
                  <div key={position.title} className="rounded-2xl border bg-slate-50 p-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-semibold">{position.title}</h3>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">{position.type}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">{position.location}</p>
                    <p className="mt-4 leading-8 text-muted-foreground">{position.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border bg-white p-8 shadow-sm">
                <div className="flex items-center gap-3 text-primary">
                  <Briefcase size={20} />
                  <h3 className="text-xl font-semibold">Benefits</h3>
                </div>
                <ul className="mt-6 space-y-3 text-muted-foreground">
                  {content.benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-3"><ShieldCheck className="mt-1 text-primary" size={18} />{benefit}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border bg-slate-50 p-8 shadow-sm">
                <div className="flex items-center gap-3 text-primary">
                  <HeartHandshake size={20} />
                  <h3 className="text-xl font-semibold">Culture</h3>
                </div>
                <ul className="mt-6 space-y-3 text-muted-foreground">
                  {content.culture.map((item) => (
                    <li key={item} className="flex gap-3"><ShieldCheck className="mt-1 text-primary" size={18} />{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <ApplicationForm positions={positions} />

      <Section className="bg-primary text-white">
        <Container>
          <div className="mx-auto max-w-3xl rounded-3xl border border-white/20 bg-white/10 p-8 text-center">
            <h2 className="text-3xl font-bold">Have questions before applying?</h2>
            <p className="mt-4 text-lg text-white/80">Reach out to our recruitment team and we&apos;ll be happy to help.</p>
            <Link href="/contact" className="mt-8 inline-block">
              <Button size="lg" className="bg-white text-primary hover:bg-slate-100">Get in Touch</Button>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
