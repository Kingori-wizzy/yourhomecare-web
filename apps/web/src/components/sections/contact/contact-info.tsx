import {
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { contactContent } from "@/content/contact";
import type { ContactSections } from "@/server/cms";

interface ContactInfoProps {
  information?: ContactSections["information"];
}

export function ContactInfo({ information = contactContent.information }: ContactInfoProps) {
  return (
    <Section>

      <Container>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-3xl border p-8">

            <Phone className="mb-5 text-primary" size={32} />

            <h3 className="font-semibold text-xl">
              Call Us
            </h3>

            <p className="mt-3 text-slate-600">
              {information.phone}
            </p>

          </div>

          <div className="rounded-3xl border p-8">

            <Mail className="mb-5 text-primary" size={32} />

            <h3 className="font-semibold text-xl">
              Email
            </h3>

            <p className="mt-3 text-slate-600">
              {information.email}
            </p>

          </div>

          <div className="rounded-3xl border p-8">

            <MapPin className="mb-5 text-primary" size={32} />

            <h3 className="font-semibold text-xl">
              Location
            </h3>

            <p className="mt-3 text-slate-600">
              {information.address}
            </p>

          </div>

          <div className="rounded-3xl border p-8">

            <Clock className="mb-5 text-primary" size={32} />

            <h3 className="font-semibold text-xl">
              Business Hours
            </h3>

            {information.hours.map((hour) => (
              <p
                key={hour}
                className="mt-2 text-slate-600"
              >
                {hour}
              </p>
            ))}

          </div>

        </div>

      </Container>

    </Section>
  );
}