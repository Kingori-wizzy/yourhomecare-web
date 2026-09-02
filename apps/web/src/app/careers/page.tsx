import { Briefcase, HeartHandshake, ShieldCheck } from "lucide-react";

import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ApplicationForm } from "@/components/sections/careers/application-form";
import { CallToAction } from "@/components/sections/home/cta";
import { buildMetadata } from "@/lib/metadata";
import { getPageContent, getPublishedJobs, toJobItems } from "@/server/cms";

export const metadata = buildMetadata({
  title: "Careers",
  description: "Explore current careers opportunities at YourHomeCare and join our healthcare team.",
  path: "/careers",
});

export const dynamic = "force-dynamic";

export default async function CareersPage() {
  const [content, jobs] = await Promise.all([getPageContent("careers"), getPublishedJobs()]);
  const positions = toJobItems(jobs);

  return (
    <>
      <PageHero
        badge={content.hero.badge || "Join Our Team"}
        title={content.hero.title}
        description={content.hero.description}
        imageUrl="/images/flyers/refer-patients.png"
        primaryCta={{ label: "Apply Now", href: "#apply" }}
        secondaryCta={{ label: "Our Services", href: "/services" }}
        priority
      />

      <Section className="bg-white">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[8px] border border-border bg-[#f8f9ff] p-7 shadow-[var(--shadow-sm)] lg:p-8">
              <h2 className="text-3xl font-bold tracking-tight text-primary">Open Positions</h2>
              <div className="mt-8 space-y-5">
                {positions.map((position) => (
                  <div
                    key={position.title}
                    className="rounded-[8px] border border-border bg-white p-6 shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-semibold text-primary">{position.title}</h3>
                      <span className="rounded-[8px] bg-secondary/12 px-3 py-1 text-sm font-medium text-secondary">
                        {position.type}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{position.location}</p>
                    <p className="mt-4 leading-[1.6] text-muted-foreground">{position.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[8px] border border-border bg-white p-7 shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/12 text-secondary">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary">Benefits</h3>
                </div>
                <ul className="mt-6 space-y-3 text-muted-foreground">
                  {content.benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-3 leading-[1.6]">
                      <ShieldCheck className="mt-0.5 h-[18px] w-[18px] shrink-0 text-secondary" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[8px] border border-border bg-[#f8f9ff] p-7 shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/12 text-secondary">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary">Culture</h3>
                </div>
                <ul className="mt-6 space-y-3 text-muted-foreground">
                  {content.culture.map((item) => (
                    <li key={item} className="flex gap-3 leading-[1.6]">
                      <ShieldCheck className="mt-0.5 h-[18px] w-[18px] shrink-0 text-secondary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <ApplicationForm positions={positions} />

      <CallToAction />
    </>
  );
}
