import Image from "next/image";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

const trustPoints = [
  {
    number: "01",
    title: "Clinically led care",
    body: "Every care plan is guided by experienced nurses and healthcare professionals.",
  },
  {
    number: "02",
    title: "Reliable coordination",
    body: "Clear communication with families, hospitals, and insurers — every step of the way.",
  },
  {
    number: "03",
    title: "Dignity at home",
    body: "We bring hospital-standard care into familiar spaces where people feel safest.",
  },
];

export function TrustSection() {
  return (
    <Section className="bg-section">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative mx-auto w-full max-w-md">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[8px] shadow-[var(--shadow-lg)]">
              <Image
                src="/images/home/trust-administrator.jpg"
                alt="YourHomeCare care administrator"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 420px"
              />
            </div>
            <div className="absolute -bottom-4 left-4 rounded-[8px] bg-white px-4 py-3 shadow-[var(--shadow-md)] sm:left-6">
              <p className="text-2xl font-extrabold text-secondary">98%</p>
              <p className="text-sm font-medium text-primary">Satisfaction</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
              Why families trust us
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary lg:text-5xl">
              Reliability and clinical excellence, every visit
            </h2>
            <p className="mt-5 text-lg leading-[1.6] text-muted-foreground">
              YourHomeCare combines compassionate caregivers with structured clinical oversight so
              families know their loved ones are in safe hands.
            </p>

            <ol className="mt-10 space-y-7">
              {trustPoints.map((point) => (
                <li key={point.number} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-white">
                    {point.number}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-primary">{point.title}</h3>
                    <p className="mt-1.5 text-base leading-[1.6] text-muted-foreground">
                      {point.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </Section>
  );
}
