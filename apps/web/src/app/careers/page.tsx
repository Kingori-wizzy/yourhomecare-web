import Link from "next/link";
import { Briefcase, HeartHandshake, ShieldCheck } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { careersContent } from "@/content/careers";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Careers",
  description: "Explore current careers opportunities at YourHomeCare and join our healthcare team.",
  path: "/careers",
});

export default function CareersPage() {
  return (
    <>
      <Section className="bg-slate-50">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-semibold uppercase tracking-[0.2em] text-primary">{careersContent.hero.badge}</p>
            <h1 className="mt-4 text-4xl font-bold lg:text-5xl">{careersContent.hero.title}</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">{careersContent.hero.description}</p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border bg-white p-8 shadow-sm">
              <h2 className="text-3xl font-bold">Open Positions</h2>
              <div className="mt-8 space-y-6">
                {careersContent.positions.map((position) => (
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
                  {careersContent.benefits.map((benefit) => (
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
                  {careersContent.culture.map((item) => (
                    <li key={item} className="flex gap-3"><ShieldCheck className="mt-1 text-primary" size={18} />{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-primary text-white">
        <Container>
          <div className="mx-auto max-w-3xl rounded-3xl border border-white/20 bg-white/10 p-8 text-center">
            <h2 className="text-3xl font-bold">Apply today</h2>
            <p className="mt-4 text-lg text-white/80">Send your CV and a short note to start a conversation with our recruitment team.</p>
            <Link href="/contact" className="mt-8 inline-block">
              <Button size="lg" className="bg-white text-primary hover:bg-slate-100">Get in Touch</Button>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
