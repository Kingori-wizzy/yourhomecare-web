import {
  PhoneCall,
  ClipboardCheck,
  House,
  HeartHandshake,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { processContent } from "@/content/process";
import type { HomeSections } from "@/server/cms";

const icons = {
  PhoneCall,
  ClipboardCheck,
  House,
  HeartHandshake,
};

const ICON_NAMES = Object.keys(icons);

const DEFAULT_CONTENT: HomeSections["process"] = {
  badge: processContent.badge,
  title: processContent.title,
  description: processContent.description,
  steps: processContent.steps.map((step, index) => ({
    number: step.number,
    title: step.title,
    description: step.description,
    icon: ICON_NAMES[index] ?? "PhoneCall",
  })),
};

interface CareProcessProps {
  content?: HomeSections["process"];
}

export function CareProcess({ content = DEFAULT_CONTENT }: CareProcessProps) {
  return (
    <Section className="bg-white">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-semibold uppercase tracking-widest text-primary">
            {content.badge}
          </p>

          <h2 className="mt-4 text-4xl font-bold lg:text-5xl">
            {content.title}
          </h2>

          <p className="mt-6 text-lg text-muted-foreground">
            {content.description}
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {content.steps.map((step) => {
            const Icon = icons[step.icon as keyof typeof icons] ?? PhoneCall;

            return (
              <div
                key={step.number}
                className="relative rounded-3xl border border-slate-200 bg-slate-50 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
              >
                <div className="absolute right-6 top-6 text-5xl font-extrabold text-slate-100">
                  {step.number}
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon size={28} />
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  {step.title}
                </h3>

                <p className="mt-4 leading-7 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
