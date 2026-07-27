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
    <Section className="bg-primary py-24 text-white">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold lg:text-5xl">
            {title}
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/90">
            {description}
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-5">
            <Link href="#assessment">
              <Button
                size="lg"
                variant="secondary"
              >
                Book Assessment
              </Button>
            </Link>

            <Link href="#referral">
              <Button
                size="lg"
                variant="outline"
                className="border-white bg-transparent text-white hover:bg-white hover:text-primary"
              >
                Refer a Patient
              </Button>
            </Link>

            <Link href={`tel:${phone.replace(/[^+\d]/g, "")}`}>
              <Button
                size="lg"
                className="bg-black text-white hover:bg-slate-900"
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