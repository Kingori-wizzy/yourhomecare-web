import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { contactContent } from "@/content/contact";
import { company } from "@/content/company";

interface ContactCTAProps {
  title?: string;
  description?: string;
  phone?: string;
}

export function ContactCTA({
  title = contactContent.cta.title,
  description = contactContent.cta.description,
  phone = company.phone,
}: ContactCTAProps) {
  return (
    <Section className="relative overflow-hidden bg-gradient-to-br from-secondary via-[#0a6b6b] to-primary text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]"
        aria-hidden
      />
      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
            Ready to start?
          </p>
          <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-[1.6] text-white/90">
            {description}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="#assessment">
              <Button
                size="lg"
                className="h-12 rounded-[8px] bg-white px-6 text-base font-semibold text-primary hover:bg-white/90"
              >
                Book Assessment
              </Button>
            </Link>
            <Link href="#referral">
              <Button
                size="lg"
                className="h-12 rounded-[8px] border-2 border-white/80 bg-transparent px-6 text-base font-semibold text-white hover:bg-white hover:text-primary"
              >
                Refer a Patient
              </Button>
            </Link>
            <Link href={`tel:${phone.replace(/[^+\d]/g, "")}`}>
              <Button
                size="lg"
                className="h-12 rounded-[8px] border-2 border-white/40 bg-white/10 px-6 text-base font-semibold text-white hover:bg-white hover:text-primary"
              >
                Call Now
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
