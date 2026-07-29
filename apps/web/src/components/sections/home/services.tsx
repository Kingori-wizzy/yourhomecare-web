import Link from "next/link";
import { Check, HeartHandshake, HeartPulse, Activity } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

const glanceServices = [
  {
    title: "Nursing",
    icon: HeartPulse,
    description: "Clinical nursing care delivered at home by experienced professionals.",
    points: ["Wound & medication management", "Post-hospital recovery", "Chronic condition support"],
  },
  {
    title: "Personal Care",
    icon: HeartHandshake,
    description: "Dignified daily living support that helps families breathe easier.",
    points: ["Assistance with daily routines", "Companionship & mobility", "Respite for family caregivers"],
  },
  {
    title: "Therapy",
    icon: Activity,
    description: "Rehabilitation therapy that rebuilds strength and independence.",
    points: ["Physiotherapy at home", "Stroke & mobility recovery", "Personalized therapy plans"],
  },
];

export function Services() {
  return (
    <Section className="bg-white">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
            Our Care
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary lg:text-5xl">
            Services at a Glance
          </h2>
          <p className="mt-4 text-lg leading-[1.6] text-muted-foreground">
            Nurse-led home healthcare designed around comfort, clinical excellence, and family trust.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {glanceServices.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                className="rounded-[8px] border border-border bg-[#f8f9ff] p-7 shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/12 text-secondary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-2xl font-bold text-primary">{service.title}</h3>
                <p className="mt-3 text-base leading-[1.6] text-muted-foreground">
                  {service.description}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-[15px] text-primary/90">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/services"
                  className="mt-7 inline-block text-sm font-semibold text-secondary transition hover:text-primary"
                >
                  Learn more →
                </Link>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
