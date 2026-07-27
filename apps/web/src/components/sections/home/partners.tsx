import Image from "next/image";

import { Container } from "@/components/layout/container";
import { partnersContent } from "@/content/partners";

export function Partners() {
  return (
    <section className="bg-slate-50 py-20">
      <Container>
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="font-semibold uppercase tracking-widest text-primary">
            {partnersContent.badge}
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            {partnersContent.title}
          </h2>

          <p className="mt-6 text-lg text-muted-foreground">
            {partnersContent.description}
          </p>
        </div>

        <div className="space-y-14">
          {partnersContent.categories.map((category) => (
            <div key={category.title}>
              <h3 className="mb-8 text-center text-2xl font-semibold">
                {category.title}
              </h3>

              <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
                {category.partners.map((partner) => (
                  <div
                    key={partner.name}
                    className="flex h-32 items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={150}
                      height={70}
                      className="h-auto max-h-14 w-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}