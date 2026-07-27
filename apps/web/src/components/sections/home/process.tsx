import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { processContent } from "@/content/process";

export function CareProcess() {
  return (
    <Section className="bg-white">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-semibold uppercase tracking-widest text-primary">
            {processContent.badge}
          </p>

          <h2 className="mt-4 text-4xl font-bold lg:text-5xl">
            {processContent.title}
          </h2>

          <p className="mt-6 text-lg text-muted-foreground">
            {processContent.description}
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {processContent.steps.map((step) => {
            const Icon = step.icon;

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