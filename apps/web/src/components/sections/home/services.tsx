import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BriefcaseMedical,
  HeartHandshake,
  HeartPulse,
  HelpingHand,
  Hospital,
  Network,
  Users,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { servicesContent } from "@/content/services";

const icons = {
  HeartPulse,
  HeartHandshake,
  Users,
  Hospital,
  Activity,
  BriefcaseMedical,
  HelpingHand,
  Network,
};

export function Services() {
  return (
    <Section className="bg-slate-50">
      <Container>
        {/* Section Heading */}

        <div className="mx-auto max-w-3xl text-center">
          <p className="font-semibold uppercase tracking-widest text-primary">
            {servicesContent.hero.badge}
          </p>

          <h2 className="mt-4 text-4xl font-bold lg:text-5xl">
            {servicesContent.hero.title}
          </h2>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {servicesContent.hero.description}
          </p>
        </div>

        {/* Services Grid */}

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {servicesContent.services.map((service) => {
            const Icon =
              icons[service.icon as keyof typeof icons] ?? HeartPulse;

            return (
              <div
                key={service.title}
                className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon size={28} />
                </div>

                <h3 className="mt-6 text-2xl font-bold">
                  {service.title}
                </h3>

                <p className="mt-4 leading-7 text-muted-foreground">
                  {service.description}
                </p>

                {/* Preview Features */}

                <ul className="mt-6 space-y-2">
                  {service.features.slice(0, 3).map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-slate-700"
                    >
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/services"
                  className="mt-8 inline-flex items-center font-semibold text-primary transition group-hover:translate-x-1"
                >
                  View Service

                  <ArrowRight
                    size={18}
                    className="ml-2"
                  />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}

        <div className="mt-16 text-center">
          <Link
            href="/services"
            className="inline-flex items-center rounded-xl bg-primary px-8 py-4 font-semibold text-white transition hover:opacity-90"
          >
            Explore All Healthcare Services

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