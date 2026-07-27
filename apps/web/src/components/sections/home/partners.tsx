import Image from "next/image";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { partnersContent } from "@/content/partners";

export function Partners() {
  return (
    <Section className="bg-white">
      <Container>

        <div className="mx-auto max-w-3xl text-center">

          <p className="font-semibold uppercase tracking-widest text-primary">
            {partnersContent.hero.badge}
          </p>

          <h2 className="mt-4 text-4xl font-bold lg:text-5xl">
            {partnersContent.hero.title}
          </h2>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {partnersContent.hero.description}
          </p>

        </div>

        {partnersContent.categories.map((category) => (

          <div
            key={category.title}
            className="mt-20"
          >

            <h3 className="mb-10 text-center text-2xl font-bold">
              {category.title}
            </h3>

            <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">

              {category.partners.map((partner) => (

                <div
                  key={partner.name}
                  className="flex h-40 items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >

                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={180}
                    height={80}
                    className="max-h-20 w-auto object-contain"
                  />

                </div>

              ))}

            </div>

          </div>

        ))}

      </Container>
    </Section>
  );
}