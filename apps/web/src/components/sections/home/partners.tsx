import Image from "next/image";

import { Container } from "@/components/layout/container";
import { partners } from "@/content/partners";

export function Partners() {
  return (
    <section className="bg-slate-50 py-20">
      <Container>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="font-semibold uppercase tracking-widest text-primary">
            Trusted Partnerships
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            Working Together to Deliver Better Care
          </h2>

          <p className="mt-6 text-muted-foreground">
            We collaborate with respected healthcare and community organisations
            to provide comprehensive, high-quality home care services.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex h-32 items-center justify-center rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={140}
                height={60}
                className="h-auto max-h-14 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}